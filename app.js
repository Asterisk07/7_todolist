const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1';
const port = 3131;
const express = require('express');
const app = express();
const path = require("path");
const fs = require("fs");
// const path = require('path'); // Import the path module

app.set('view engine', 'pug');


app.use(express.urlencoded())
app.set('views', path.join(__dirname, 'views'))
app.use(express.json());



app.use('/public/css', express.static('public/css'))
app.use('/public/js', express.static('public/js'));

let db=new sqlite3.Database("todolist.db");

// function unique(user){
//   q="select * from users where user=(?)"
  
//   db.all(q,[user],(err,rows)=>{
//     if (err) {
          
//       console.log("error during login");
//     }
//   })
// }
app.get("/view",(req,res)=>{
    // res.render('add',);
    // const q="select id,name,priority,time,date from todo ";
    const q="select id,name,priority,time,strftime('%d-%m-%Y', date) as date  from todo order by priority asc ,date asc,time asc";
    // const q="select id,name,priority,strftime('%H:%M:%S %p',time) as time,strftime('%d-%m-%Y', date) as date  from todo order by priority asc ,date asc,time asc";
    // const q="select * from todo ";
      db.all(q, [], (err, rows) => {
        if (err) {
          
          console.log("error during view");
        }
        // console.log(rows);
        // res.render('add',{rows});
        res.render('add',{rows});
      });
    
});

app.get("/",(req,res)=>{
  res.redirect('/view');
  // res.render("home");
})
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY, name TEXT)');
  });

app.post('/add', (req, res) => {
    // console.log(req);
    // const bod=req.body;
    // console.log(bod);
    const name = req.body.name;
    const date = req.body.date;
    const time = req.body.time;
    const priority = req.body.priority;
    
    // console.log(priority); 
    console.log(time); 
    console.log(date); 
    // console.log('Received name:', name); 

    db.run(
      'INSERT INTO todo (name,date,time,priority) VALUES (?,?,?,?)',
      [name,date,time,priority]
    );
    res.redirect('/view');
    // res.send('Data received');
  });

app.post('/del', (req, res) => {
    // console.log(req);
    // const bod=req.body;
    // console.log(bod);
    const idd = req.body.num;
    // console.log("eere");
    // console.log('Received id for deletion:', idd); TK
    db.run(
      'delete from todo where id=(?)',[idd]);

    
    res.redirect('/view');
    // res.send('Data received');
  });


  
const server=app.listen(port,()=>{
    // backticks must here:
    console.log(`my app is live at http://${hostname}:${port}`);
});