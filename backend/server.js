require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect(err => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Database connected successfully.');
    }
});

// POST - Add Project
app.post('/api/add-project', (req, res) => {
    const { title, description, date, image } = req.body;
    const sql = 'INSERT INTO projects (title, description, date, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, date, image], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Project added successfully.');
    });
});

// GET - Fetch Projects
app.get('/api/get-projects', (req, res) => {
    const sql = 'SELECT * FROM projects';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
