const EventEmitter = require('events');
const Consumers = require('../consumer');

class Session {
  constructor(username) {
    this.username = username;
    this.chatGroups = {};
    this.emitter = new EventEmitter();
    this.consumer = new Consumers();
    this.socket = null;
    this.consumerEvents = this.consumerEvents.bind(this);
    this.consumerEvents();
  }

  /**
   * start consuming the chat we want
   * @param {string} chatId 
   */
  consumeChat(chatId) {
    console.log("Session getting chat", chatId)
    const consumer = this.consumer.getConsumer(chatId);
    consumer.addEmitter(this.emitter);
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