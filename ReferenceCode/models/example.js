// The module 'vscode' contains the VS Code extensibility API
const path = require('path');
const cp = require('child_process');

const pythonScriptPath = path.join(__dirname, 'use_models.py');
let text = "The sun is the center of the solar system!"

// Method 1
cp.exec(`python3 ${pythonScriptPath} "${text}"`, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        console.error(stderr);
        return;
    }
    console.log(stdout);
});

// Method 2
const pythonProcess = cp.spawn('python3', [pythonScriptPath, text]);
pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
});