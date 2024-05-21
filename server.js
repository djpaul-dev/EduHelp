import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import openai from './config/open-ai.js'; // Ensure this path is correct
import { exec } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'; // Import bodyParser

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(bodyParser.json()); // Use bodyParser to parse JSON bodies

io.on('connection', (socket) => {
  console.log('A user connected');
  let conversationHistory = []; // Initialize conversation history for each connection

  socket.on('chat message', async (msg) => {
    console.log(msg);
    // Add user message to history
    conversationHistory.push({ role: 'user', content: msg });

    try {
      // Call the API with user input & entire conversation history
      const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: conversationHistory,
      });

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content;

      // Add bot response to history
      conversationHistory.push({ role: 'assistant', content: completionText });

      // Send bot response to client
      socket.emit('bot reply', completionText);
    } catch (error) {
      console.error('Error:', error);
      socket.emit('bot reply', 'Sorry, something went wrong.');
    }
  });
});

// Endpoint to execute Python script
app.post('/execute', (req, res) => {
  const text = req.body.text; // Extract text from the request body
  const pythonScriptPath = join(__dirname, 'use_models.py');// Adjust the path to your Python script

  const command = `python3 "${pythonScriptPath}" "${text}"`; // Construct the command
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error executing Python script:", err);
      return res.status(500).send("Error executing Python script");
    }
    if (stderr) {
      console.error("Python script stderr:", stderr);
      return res.status(500).send(stderr);
    }
    res.json({ result: stdout }); // Send the Python script output back to the client
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
