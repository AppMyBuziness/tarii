const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to get messages
app.get('/messages', (req, res) => {
    fs.readFile('messages.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading messages.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to post a new message
app.post('/messages', (req, res) => {
    const newMessage = req.body;
    fs.readFile('messages.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading messages.');
        }
        const messages = JSON.parse(data);
        messages.push(newMessage);
        fs.writeFile('messages.json', JSON.stringify(messages), (err) => {
            if (err) {
                return res.status(500).send('Error saving message.');
            }
            res.status(201).send('Message saved.');
        });
    });
});

// Initialize messages.json if it doesn't exist
fs.exists('messages.json', (exists) => {
    if (!exists) {
        fs.writeFile('messages.json', JSON.stringify([]), (err) => {
            if (err) console.log('Error initializing messages file.');
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});