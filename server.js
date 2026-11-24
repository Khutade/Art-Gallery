/*
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');

const app = express();

// simple request logger (temporary)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

const USERS_FILE = path.join(__dirname, 'users.json');
const P1_FILE_PATH = path.join(__dirname, 'p1.html');
const LOGIN_FILE_PATH = path.join(__dirname, 'login.html'); // Define login path explicitly

app.use(cors());
app.use(express.json());

// basic in-memory session (dev only)
app.use(session({
  secret: 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// CRITICAL FIX: Explicitly define the route for the root path (/) to serve p1.html.
app.get('/', (req, res) => {
  // Use the absolute path defined above
  res.sendFile(P1_FILE_PATH);
});

// Serve the login page directly via its route defined in p1.html (href="/login.html")
// Note: We remove the explicit app.get('/register') because the client-side link 
// in p1.html is '/login.html', and the static middleware handles /login.html.
// We add an explicit route for /login.html to be robust.
app.get('/login.html', (req, res) => {
    res.sendFile(LOGIN_FILE_PATH);
});

// Serve static frontend files (CSS, JS, images, and other HTML files)
app.use(express.static(__dirname));

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ message: 'Username and password (min 6 chars) required.' });
  }

  const users = await readUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ message: 'Username already taken.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), username, password: hashed });
  await writeUsers(users);

  return res.status(201).json({ message: 'Registration successful' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await readUsers();
  const user = users.find(u => u.username.toLowerCase() === (username || '').toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.user = { username: user.username };
  return res.json({ message: 'Login successful', username: user.username });
});

// session endpoints for frontend
app.get('/api/session', (req, res) => {
  res.json({ user: req.session.user || null });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
*/