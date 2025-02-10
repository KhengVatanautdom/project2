const express = require("express");
const bodyParser = require("body-parser");
const db = require("./dbconnect");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// 1. Student Registration
app.post("/register", (req, res) => {
    const { sname, semail, spass } = req.body;
    if (!sname || !semail || !spass) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const query = "INSERT INTO students (sname, semail, spass) VALUES (?, ?, ?)";
    db.query(query, [sname, semail, spass], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered successfully", id: result.insertId });
    });
});

// 2. Student Login
app.post("/login", (req, res) => {
    const { sid, spass } = req.body;
    const query = "SELECT * FROM students WHERE sid = ? AND spass = ?";
    db.query(query, [sid, spass], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: "Invalid ID or password" });
        res.json({ message: "Login successful", student: results[0] });
    });
});

// 3. Search Student
app.get("/search", (req, res) => {
    const { sid } = req.query;
    const query = "SELECT * FROM students WHERE sid = ?";
    db.query(query, [sid], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Student not found" });
        res.json(results[0]);
    });
});

// 4. Profile Update
app.put("/update", (req, res) => {
    const { sid, sname, semail } = req.body;
    const query = "UPDATE students SET sname = ?, semail = ? WHERE sid = ?";
    db.query(query, [sname, semail, sid], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profile updated successfully" });
    });
});

// 5. Delete Student
app.delete("/delete", (req, res) => {
    const { sid } = req.body;
    const query = "DELETE FROM students WHERE sid = ?";
    db.query(query, [sid], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted successfully" });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
