const mysql= require('mysql');
const conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'octaveguitaracademy'
});
conn.connect(function(err){
  if(err) throw err;
  console.log('Connected to database');
});
module.exports=conn;