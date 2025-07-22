const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ibnesina',
    database: 'todo_db'
});

db.connect((err) => {
    if (err) {
        console.error('error connecting to the database:', err);
        return;
    }
    console.log('connected to the MySQL database');
});

app.get('/tasks', (req, res) => {
    const query = 'select * from tasks';
    db.query(query, (err, results) => {
        if (err) {
            console.error('error fetching tasks:', err);
            return res.status(500).json({error: 'database error'});
        }
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { text, completed } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Task text is required' });
    }
    const query = 'INSERT INTO tasks (text, completed) VALUES (?, ?)';
    db.query(query, [text, completed || false], (err, result) => {
        if (err) {
            console.error('Error adding task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: result.insertId, text, completed: completed || false });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    if (!text && completed === undefined) {
        return res.status(400).json({ error: 'Text or completed status required' });
    }
    const query = 'UPDATE tasks SET text = COALESCE(?, text), completed = COALESCE(?, completed) WHERE id = ?';
    db.query(query, [text || null, completed !== undefined ? completed : null, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

app.get('/', (req, res) => {
    res.send('to do list backend server is running');
});

app.listen(port, () => {
    console.log('server running at http://localhost:' + port);
});