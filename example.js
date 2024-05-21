// The module 'vscode' contains the VS Code extensibility API
import { join } from 'path';
import { exec, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct the path to the Python script
const pythonScriptPath = join(__dirname, 'use_models.py');

// The text to be processed
// let text = "The sun is the center of the solar system!";
const text = processInput(input);

function processInput(input) {
    // Process the input text and return the result
    var result = "Processed: " + input; // Example processing
    return result;
  }
  

// Method 1: Using exec with proper escaping for command-line arguments
// Note: This method may still have issues with special characters in the path or arguments.
// It's recommended to use spawn for more complex scenarios or paths with special characters.
exec(`python3 "${pythonScriptPath}" "${text}"`, (err, stdout, stderr) => {
    if (err) {
        console.error("Error executing Python script:", err);
        return;
    }
    if (stderr) {
        console.error("Python script stderr:", stderr);
        return;
    }
    console.log(stdout);
});

// Method 2: Using spawn to avoid shell parsing issues
// // This method is safer for dealing with paths and arguments that might contain special characters.
// const pythonProcess = spawn('python3', [pythonScriptPath, text]);

// pythonProcess.stdout.on('data', (data) => {
//     console.log("Python script output:", data.toString());
// });

// pythonProcess.stderr.on('data', (data) => {
//     console.error("Python script error output:", data.toString());
// });

// pythonProcess.on('close', (code) => {
//     console.log(`Python script process exited with code ${code}`);
// });
