const EventEmitter = require('events');
const Consumer = require('../consumer');

class Session {
  constructor(username) {
    this.username = username;
    this.chatGroups = {};
    this.emitter = new EventEmitter();
    this.consumer = new Consumer(this.emitter);
    this.socket = null;
    this.consumerEvents = this.consumerEvents.bind(this);
    this.consumerEvents();
  }

  consumeChat(chatId) {
    this.consumer.consumeQueue(chatId);
  }

  consumerEvents() {
    this.emitter.on('message', (data) => {
      console.log("New message", data.fields.routingKey, data.content.toString())
      if (this.socket) this.socket.emit('message', {
        chatId: data.fields.routingKey,
        message: data.content.toString()
      });
    });

    this.emitter.on('error', (err) => {
      // do nothing
    });
  }
}

module.exports = Session;