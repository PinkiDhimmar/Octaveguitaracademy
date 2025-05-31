// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../dbconfig'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send('User not found');

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Incorrect password');

    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role
    };

    if (user.role === 'admin') {
      res.redirect('/admin_dashboard');
    } else {
      res.redirect('/student_dashboard');
    }
  });
});

module.exports = router;
