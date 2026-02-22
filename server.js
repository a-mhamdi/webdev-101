const express = require('express');
const path = require('path');

const Database = require('better-sqlite3');

const db = new Database('mydb.sqlite');

// Create a table (runs once)
db.exec(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    specialty TEXT,
    score NUMBER)`);

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.status(200).send('HTML rendered successfully!');
});

app.get('/students', (req, res) => {
    const students = db.prepare(`SELECT * FROM students`).all();
    res.json(students);
})

app.post('/students', (req, res) => {
    const { name, specialty, score } = req.body;
    db.prepare(`INSERT INTO students (name, specialty, score) VALUES (?, ?, ?)`).run(name, specialty, score);
    res.json({ message: 'Data saved successfully!' });
});

app.delete('/students', (req, res) => {
    db.prepare('DELETE FROM students').run();
    res.json({ message: 'All records cleared' });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});