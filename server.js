const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes to serve HTML pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "adminview.html"));
});

app.get("/userdetails", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "userdetails.html"));
});

app.get("/account-summary", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "account-summary.html"));
});

// New endpoint to connect to a free server
app.get('/api/connect', (req, res) => {
    res.json({ message: "Connected to the free server successfully!" });
});

// New endpoint to share a link
app.get('/api/share-link', (req, res) => {
    res.json({ link: "https://travelller.com/shared-link" });
});

// New endpoint to search for a link
app.get('/api/search-link', (req, res) => {
    const searchQuery = req.query.q;
    if (searchQuery === "travelller") {
        res.json({ link: "https://travelller.com/shared-link" });
    } else {
        res.status(404).json({ message: "Link not found" });
    }
});

// New endpoint to register users
app.post('/api/register', (req, res) => {
    const { name, email, phone, nic, vehicleModel, vehicle, password } = req.body;
    const user = { name, email, phone, nic, vehicleModel, vehicle, password };
    users.push(user);
    res.json({ message: "User registered successfully!", user });
});

// New endpoint to view HTML files by search query
app.get('/api/view-html', (req, res) => {
    const searchQuery = req.query.q;
    const fileMap = {
        "index": "index.html",
        "register": "register.html",
        "login": "login.html",
        "admin": "adminview.html",
        "userdetails": "userdetails.html",
        "account-summary": "account-summary.html"
    };
    const fileName = fileMap[searchQuery.toLowerCase()];
    if (fileName) {
        res.sendFile(path.join(__dirname, "public", fileName));
    } else {
        res.status(404).json({ message: "HTML file not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${5500}`);
});
