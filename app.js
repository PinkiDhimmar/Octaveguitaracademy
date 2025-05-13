const express = require('express'); 
const app = express(); 
 
app.use('/public', express.static('public'));

app.set('view engine','ejs');
app.get('/', function (req, res){
  res.render("homepage");
 });
 app.get('/login', (req, res) => {
  res.render('login');
})  



 
//app.get('/about', (req, res) => { 
 // res.send('<h2>About This Project</h2><p>This is a sample Express app.</p>'); 
//}); 
 
app.listen(3000, () => { 
  console.log('Server is running on http://localhost:3000'); 
}); 