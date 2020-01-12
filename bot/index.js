const http = require('http');
const Bot = require('./consumer');

const bot = new Bot()

http.createServer(function (req, res) {
  res.write("I'm alive!");
  res.end();
}).listen(6000);
