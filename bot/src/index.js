const http = require('http');
const Bot = require('./consumer');
const { BOT_PORT } = require('./config')

const bot = new Bot()

http.createServer(function (req, res) {
  res.write("Bot has started");
  res.end();
}).listen(BOT_PORT);
