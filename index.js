//Setup
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');

server.listen(69);

app.all('/dist/:val', (req, res) => {
  let val = req.params.val;
  if (!isNaN(val)) io.compress(false).emit('data', val);
  console.log(val);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

io.on('connection', function(socket) {
  socket.emit('connect');
});
