const express = require("express");
const cors = require("cors");
const fs = require("fs");

const PORT = 3000;
const app = express()

// To Handle Cross-Origin Resource Sharing
app.use(cors())

// Setup a MiddleWare
app.use(express.json())

// Setup Static Handling
app.use(express.static('frontend'))

// Handle API Routes

// => Handling POST request from 'createAc.html'
app.post("/create-account", (req, res) => {
    // Take out data from req (request)
    const { email, password } = req.body;

    // Preparing data to write into 'data.txt'
    const data = `Email: ${email}, Password: ${password}\n`

    // Appending data to "data.txt"
    fs.appendFile("data.txt", data, (err) => {
        if (err) {
            console.error("Error to writing:", err);
            return res.status(500).json({error: "Error occured while saving data"})
        }
        res.json({message: "Data successfully saved!"})
    });
});

// => Handling POST requests from "siginin.html"
app.post("/sign-in", (req, res) => {
    // line to compare with lines in 'data.txt' to check if it exists
    const data_line = req.body.data;
    // File Reading
    fs.readFile("data.txt", "utf8", (err, fileContent) => {
        if (err) {
            return res.status(500).json({error : "Failed to check if user exists"})
        }
        // Stores data of the file as list line by line
        const lines = fileContent.split(/\r?\n/);

        // Checks for user using comparison
        const userExists = lines.some(line => line.trim() == data_line);

        // Sending response
        res.json({ userExists })
    });
});

app.listen(PORT, () => {
    console.log(`Server is running  at http://localhost:${PORT}`);
});