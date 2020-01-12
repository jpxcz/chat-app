const rabbit = require('amqplib');

class Consumer {
  constructor(emitter) {
    this.channel = null;
    this.startConsumer();
    this.emitter = emitter;

  }

  /** 
   * start the rabbitMQ exchange
  */
  async startConsumer() {
    console.log("starting consumer");
    try {
      const connection = await rabbit.connect('amqp://rabbit', {
        username: 'guest',
        password: 'guest',
      });

      this.channel = await connection.createChannel();
      this.channel.assertExchange('messages', 'direct', { durable: false });
      console.log("Channel messages succesfully created")
    } catch (err) {
      console.warn("error starting the consumer");
      console.warn(err);
    }
  }

  async consumeQueue(queue) {
    if (!this.channel) return Error("consumer cannot consume queues. RabbitMQ not working");

    try {
      const q = await this.channel.assertQueue(queue, {
        exclusive: true
      });
      this.channel.bindQueue(q.queue, 'messages', queue);
      this.channel.consume(q.queue, (msg) => {
        this.emitter.emit('message', msg);
      })
    } catch (err) {
      console.warn("error creating consumable queue", queue);
      console.warn(err);
      this.emitter.emit('error', err);
    }
  }
}


module.exports = Consumer;