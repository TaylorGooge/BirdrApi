const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { geoCron } = require('./geoCron');
const { seasonCron } = require('./seasonCron');


/// cron
const cron = require('node-cron');

cron.schedule('0 0 * * *', function() {
  console.log('running geolocate');
  geoCron();

});

cron.schedule('0 0 * * *', function() {
  console.log('running season');
  seasonCron();

});

// ///use //////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.use(cors({
//   origin: ['https://birdrfrontend.taylorgooge.repl.co', 'https://birdr-app.replit.app']
// }));
app.use(cors({
  origin: ['https://birdrfrontend.taylorgooge.repl.co','https://birdr-app.replit.app', 'http://localhost'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
//Middleware to set Access-Control-Allow-Origin header
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://birdrfrontend.taylorgooge.repl.co');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   res.set('Access-Control-Expose-Headers', '*')
//   next();
// });
app.use((req, res, next) => {
  const allowedOrigins = ['https://birdrfrontend.taylorgooge.repl.co', 'https://birdr-app.replit.app', 'http://localhost'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Expose-Headers', '*');
  next();
});


// // ///api //////
const router = require('./index')
app.use(router)


// ///env //////
require('dotenv').config();

app.get('/', function(req, res, next) {
    res.send("Hello world");
});

// ///create server //////
app.listen(process.env.PORT || 3000, function(){
  console.log("App server is running on port 3000");
});

app.on('uncaughtException', function (err) {
    console.log(err);
}); 

app.on('uncaughtException', function (err) {
    console.log(err);
});

