const Session = require('./session');

class SessionManager {
  constructor() {
    this.sessions = {};
  }

  /**
   * creates a new session to keep track on the session manager
   * @param {string} username - session identifier
   */
  createNewSession(username) {
    return new Promise((resolve, reject) => {
      if (!this.sessions[username]) this.sessions[username] = new Session(username);
      resolve();
    })
  }

  /**
   * attaches a socket.io  to the client to send msgs as websocket
   * @param {SocketIO.socket} socket
   * @param {string} username - session identifier
   */
  attachSocket(socket, username) {
    return new Promise((resolve, reject) => {
      if (!this.sessions[username]) reject(`User ${username} not logged in. Cant attach socket`);
      else {
        this.sessions[username].socket = socket;
        resolve();
      }
    });
  }

  /**
   * request to check a chat
   * @param {string} username - session identifier
   * @param {string} chatId - chat identifier
   */
  checkChat(username, chatId) {
    return new Promise((resolve, reject) => {
      if (!this.sessions[username]) reject(`User ${username} not logged in. Cant access chat ${chatId}`);
      else {
        console.log(`Starting to consume chat ${chatId}`);
        this.sessions[username].consumeChat(chatId);
        resolve();
      }
    });
  }
}

module.exports = SessionManager;