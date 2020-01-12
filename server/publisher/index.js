//const Buffer = require('buffer');
const rabbit = require('amqplib');

class Publisher {
  constructor() {
    this.channel = null;
    this.startPublisher();

  }

  /** 
   * start the rabbitMQ exchange
  */
  async startPublisher() {
    console.log("Starting Publisher");
    try {
      const connection = await rabbit.connect('amqp://rabbit', {
        username: 'admin',
        password: 'nimda',
        port: '15672'
      });

      this.channel = await connection.createChannel();
      this.channel.assertExchange('messages', 'direct', { durable: false });
      console.log("Channel messages succesfully created")
    } catch (err) {
      console.warn("error starting the publisher");
      console.warn(err);
      setTimeout(() => this.startPublisher(), 10000);
    }
  }

  /**
   * sends the message to rabbitMQ exchange with the
   * right routing
   * @param {Object} message - Full message to publish
   * @param {string} message.chatId - chat route
   * @param {string} message.message - message to send
   */
  sendMessage(message) {
    return new Promise(async (resolve, reject) => {
      if (!this.channel) reject("RabbitMQ not working");
      console.log(`Publishing to ${message.chatId} message`, message.message)
      const published = await this.channel.publish('messages', message.chatId, Buffer.from(JSON.stringify(message.message)));

      if (published) resolve();
      else reject("Message could not be published");
    });
  }
}


module.exports = Publisher;