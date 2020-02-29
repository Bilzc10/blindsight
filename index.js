//Setup
const express = require('express');
const app = express();
const server = require('http').Server(app);
const fs = require('fs');
const path = require('path');

server.listen(80);

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));
