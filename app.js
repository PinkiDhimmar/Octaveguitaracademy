const express = require('express'); 
const bodyParser = require('body-parser');
const app = express(); 

var session = require('express-session');
var conn=require('./dbconfig');

// Middleware
app.use(express.json());


app.use('/public', express.static('public'));
// Set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'octave-secret-key',
  resave: false,
  saveUninitialized: true
}));
// Set views directory
app.set('views', __dirname + '/views');

//const authRoutes = require('./routes/auth'); // Adjust the path as necessary
// Use routes
//app.use('/auth', authRoutes); // Use the auth routes under /auth path
//app.use(authRoutes);

// Routes

app.get('/', (req, res) => {
    
    res.render('home');
});

// login route 
 app.get('/login', (req, res) => {
  res.render('login');
}); 

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  conn.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.send('Invalid email or password');
    }

    const user = results[0];
    req.session.user = { id: user.id, role: user.role };

    if (user.role === 'admin') {
      res.redirect('/admin_dashboard');
    } else {
      res.redirect('/student_dashboard');
    }
  });
});

// Admin Dashboard
app.get('/admin_dashboard', (req, res) => {
  if (req.session.user?.role === 'admin') {
    //res.send('Welcome Admin!');
    res.render('admin_dashboard');
  } else {
    res.redirect('/');
  }
});

// Student dashboard
app.get('/student_dashboard', (req, res) => {
  if (req.session.user?.role === 'student') {
    //res.send('Welcome Student!');
    // Render the student dashboard view
    res.render('student_dashboard');
  } else {
    res.redirect('/');
  }
});

//Manage Students
app.get('/students', (req, res) => {
  if (req.session.user?.role !== 'admin') {
    return res.redirect('/');
  }
  // Fetch students from the database
  conn.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Database error');
    }

    res.render('students', { users: results });
  });
});
// Logout route
 app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
// Start the server
app.listen(3000, () => { 
  console.log('Server is running on http://localhost:3000'); 
}); 