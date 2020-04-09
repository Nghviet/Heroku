const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'client/build')));

app.io = require('socket.io')();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const api = require('./api')(app.io);

app.use('/API',api);
app.get('/',(req,res) => {
    res.send("Listening on " + port);
})
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port,() => {
    console.log("Listening on " + port);
});