const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(require('cors')());

let emotionRecognitionEnabled = false;
const notifications = [];

app.post('/toggle-emotion-recognition', (req, res) => {
  emotionRecognitionEnabled = !emotionRecognitionEnabled;
  console.log(`Emotion recognition is now ${emotionRecognitionEnabled ? 'enabled' : 'disabled'}`);
  res.json({ status: emotionRecognitionEnabled });
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  const audioPath = req.file.path;

  console.log('\n======================');
  console.log('📥 New audio file received:', audioPath);
  console.log('⏳ Starting transcription with Whisper...');

  try {
    exec(`py transcriber.py ${audioPath}`, async (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Whisper error:', stderr);
        return res.status(500).json({ error: stderr });
      }

      const transcript = stdout.trim();
      console.log('✅ Transcription complete.');
      console.log('📝 Transcript:', transcript.slice(0, 300) + '...'); // First 300 chars only

      console.log('🤖 Sending transcript to GPT for summarization...');

      try {
        const summary = await summarizeWithCohere(transcript);
        console.log('✅ Summary complete.');
        console.log('📄 Summary:', summary);

        res.json({ transcript, summary });
        await saveToNotion({
          title: `Meeting - ${new Date().toLocaleDateString()}`,
          summary
        });
      } catch (gptError) {
        console.error('❌ Cohere\'s Summarization Error:', gptError.message);
        res.status(500).json({ error: 'Failed to summarize.' });
      }
    });
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/analyze', async (req, res) => {
  if (!emotionRecognitionEnabled) {
    return res.status(400).json({ error: 'Emotion recognition is disabled' });
  }

  console.log('\n======================');
  console.log('📥 New request for emotion and pose analysis received.');

  try {
    exec('py main.py', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Emotion and Pose Analysis Error:', stderr);
        return res.status(500).json({ error: stderr });
      }

      const analysisResult = stdout.trim();
      console.log('✅ Emotion and Pose Analysis complete.');
      console.log('📊 Analysis Result:', analysisResult);

      res.json({ analysis: analysisResult });
    });
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/logs', (req, res) => {
  const { log } = req.body;
  if (log) {
    console.log(log);
    res.status(200).send('Log received');
  } else {
    res.status(400).send('No log provided');
  }
});

app.post('/notify', (req, res) => {
  const { message } = req.body;
  if (message) {
    console.log(`Notification: ${message}`);
    notifications.push({ message });
    res.status(200).send('Notification received');
  } else {
    res.status(400).send('No message provided');
  }
});

app.get('/notifications', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    if (notifications.length > 0) {
      const notification = notifications.shift();
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

async function saveToNotion({ title, summary }) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: summary.slice(0, 2000), // Notion text limit safeguard
              },
            },
          ],
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    console.log("✅ Notion entry created:", response.id);
  } catch (error) {
    console.error("❌ Notion error:", error.response?.data || error.message);
  }
}

async function summarizeWithCohere(text) {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: text,
        length: 'long', // or 'auto'
        format: 'paragraph', // can be changed to 'bullets'
        extractiveness: 'medium',
        temperature: 0.3,
        additional_command: `Convert this transcript into professional minutes of the meeting. Include key points discussed, decisions made, action items, and next steps. Use today's date.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
  
    return response.data.summary;
  } catch (error) {
    console.error('❌ Cohere Summarization Error:', error.response?.data || error.message);
    throw new Error('Cohere summarization failed.');
  }
}

app.listen(3000, () => {
  console.log('🚀 Server started on http://localhost:3000');
});