# Meet Ai 
Meet AI is an intelligent meeting assistant designed to make your virtual meetings more productive and accessible. Powered by state-of-the-art AI technologies, Meet AI automatically joins your Zoom meetings, transcribes the entire conversation using OpenAI’s Whisper model, and generates concise, accurate summaries using Cohere. Whether you're a professional, student, or team leader, Meet AI helps you focus on the conversation while it handles the documentation.
## Features
1.Auto Join Meetings – Automatically joins Zoom meetings using pre-configured credentials and meeting links.(Under progress)

2.Real-Time Transcription – Converts spoken words into accurate text using Whisper.

3.AI-Powered Summarization – Uses Cohere to generate clean and useful summaries of meetings.

4.Meeting Archive – Stores transcripts and summaries for later access and review.

5.Posture Detection - Helps you analyze your facial expressions and posture during a metting to correct them on the go and leave a lasting impression.(making it more accurate and trying to conenct with frontend remainders)

## Tech Stack
1. FrontEnd - React Js
2. Backend - Node Js
3. Transcription - Whisper by OpenAI
4. Ai Summarization - Cohere's Ai
# Installation
1. The First step is cloning the repo in your local machine using the following command `git clone https://github.com/Subisticated/Meet-Ai.git`
2. Make sure you have Node js installed on your Machine ,Then open the directory where installed in terminal and run `npm install` to install all node dependecies.
3. Now to Install Whisper ,Make sure you have pyhton and pip installed then run the command `pip install git+https://github.com/openai/whisper.git `.
4. Now run `conda create -n <name> python=3.11.11`
 `conda activate <name>`
 `pip install -r requirements.txt`
 to setup and install pyhton dependencies for facial and posture detection.
5. Now to start the Backend server simply run in terminal `npm start`.
6. To run the testing frontend simply open test.html and golive using live server extension.( the reactjs frontend is still under developement).
## Contributions
[@DevRanaKaila](https://github.com/DevRanaKaila)
[@rohant05](https://github.com/rohant05)
[@DKS-TYRL](https://github.com/DKS-TYRL)
