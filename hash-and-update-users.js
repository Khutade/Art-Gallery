const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

(async () => {
  const USERS_FILE = path.join(__dirname, 'users.json');
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  const users = JSON.parse(raw || '[]');

  let updated = false;
  for (const user of users) {
    if (!user.password || typeof user.password !== 'string') continue;
    // skip already-hashed bcrypt passwords
    if (user.password.startsWith('$2')) continue;
    user.password = await bcrypt.hash(user.password, 10);
    updated = true;
  }

  if (updated) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    console.log('users.json updated — plaintext passwords replaced with bcrypt hashes.');
  } else {
    console.log('No plaintext passwords found. No changes made.');
  }
})();