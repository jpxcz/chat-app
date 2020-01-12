const express = require('express');
const bodyParser = require('body-parser');
const Publisher = require('./publisher')
const SessionManager = require('./session');

const app = express();
app.use(bodyParser());

const sessionManager = new SessionManager();
const publisher = new Publisher();

// gets the channel wanted to start consuming
app.post('/get-channel', (req, res) => {
  const { username, chatId } = req.body;
  console.log(`${username} wants to connect to chat ${chatId}`);
  sessionManager.checkChat(username, chatId).then(() => {
    res.status(200);
    res.json({ msg: `Connected to chat ${chatId}` })
  }).catch((reason) => {
    res.status(400);
    res.json({ error: `Could not connect to chat` })
  })
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`User ${username} asking for login`);
  sessionManager.createNewSession(username, password).then(() => {
    console.log(`User ${username} successfully logged in`);
    res.sendStatus(200);
  }).catch((err) => {
    console.warn("Could not login user", username);
    res.sendStatus(400);
  });
});

// post a new message for the publisher to send
app.post('/message', async (req, res) => {
  publisher.sendMessage(req.body).then(() => {
    res.sendStatus(200);
  }).catch((reason) => {
    res.sendStatus(400);
  });
});

const server = app.listen(5000, () => {
  console.log("Listenting on port 5000")
});

const io = require('socket.io')(server, {
  path: '/ws',
}).listen(server);

io.sockets.on('connect', (socket) => {
  socket.on('attach-socket', (username) => {
    console.log("Starting attach socket", username)
    sessionManager.attachSocket(socket, username)
  })
})
