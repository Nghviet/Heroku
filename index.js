const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(express.static(path.join(__dirname, 'client/build')));


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var server = app.listen(port,() => {
    console.log("Listening on " + port);
});
const io = require('socket.io')(server);
app.set('socket',io);
const api = require('./api');

app.use('/API',api);
app.get('/',(req,res) => {
    res.send("Listening on " + port);
})

app.post('/socketConnect')

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === 'production')
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });

