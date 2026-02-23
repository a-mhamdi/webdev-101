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

app.post('/students', (req, res) => {
    const { id, name, specialty, score } = req.body;
    db.prepare(`INSERT INTO students (id, name, specialty, score) VALUES (?, ?, ?, ?)`).run(id, name, specialty, score);
    res.json({ message: 'Data saved successfully!' });
});

app.get('/students', (req, res) => {
    const students = db.prepare(`SELECT * FROM students`).all();
    if (students && students.length > 0) {
        res.json(students);
    } else {
        res.status(404).json({ error: 'No students found' });
    }
});

app.get('/students/:id', (req, res) => {
    const id = req.params.id;
    const student = db.prepare(`SELECT * FROM students WHERE id = ?`).get(id);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
})

app.put('/students/:id', (req, res) => {
    const id = req.params.id;
    const { name, specialty, score } = req.body;
    const result = db.prepare(`UPDATE students SET name = ?, specialty = ?, score = ? WHERE id = ?`).run(name, specialty, score, id);
    if (result.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
    } else {
        res.json({ message: 'Data updated successfully!' });
    }
});

app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    const result = db.prepare(`DELETE FROM students WHERE id = ?`).run(id);
    if (result.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'All records cleared' });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});