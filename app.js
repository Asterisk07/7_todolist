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
app.get("/",(req,res)=>{
    // res.render('add',);
    const q="select * from todo order by id";
      db.all(q, [], (err, rows) => {
        if (err) {
          
          console.log("error");
        }
        // console.log(rows);
        // res.render('add',{rows});
        res.render('add2',{rows});
      });
    
});


db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY, name TEXT)');
  });

app.post('/', (req, res) => {
    // console.log(req);
    // const bod=req.body;
    // console.log(bod);
    const name = req.body.name;
    console.log("eere");
    console.log('Received name:', name);
    db.run(
      'INSERT INTO todo (name) VALUES (?)',
      [name]
    );
    res.redirect('/');
    // res.send('Data received');
  });

app.post('/del', (req, res) => {
    // console.log(req);
    // const bod=req.body;
    // console.log(bod);
    const idd = req.body.num;
    // console.log("eere");
    console.log('Received id for deletion:', idd);
    db.run(
      'delete from todo where id=(?)',[idd]);

    
    res.redirect('/');
    // res.send('Data received');
  });


  
const server=app.listen(port,()=>{
    // backticks must here:
    console.log(`my app is live at http://${hostname}:${port}`);
});