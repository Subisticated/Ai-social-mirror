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
        length: 'medium',           // options: short | medium | long
        format: 'paragraph',        // options: paragraph | bullets
        extractiveness: 'auto',     // options: low | medium | high | auto
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
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
