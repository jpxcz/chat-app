const rabbit = require('amqplib');

class Consumer {
  constructor(chatId) {
    this.id = chatId;
    this.channel = null;
    this.emitters = [];
    this.startConsumer();
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
      console.log("Channel messages succesfully created");
      this.consumeQueue();
    } catch (err) {
      console.warn("error starting the consumer");
      console.warn(err);
    }
  }

  addEmitter(emitter) {
    if(this.emitters.includes(emitter)) {
      console.log("Emitter already exists!")
      return;
    }
    else {
      this.emitters.push(emitter);
    }
  }

  /**
   *  Consumes the queue wanted
   * @param {string} queue - queue wanted
   */
  async consumeQueue() {
    if (!this.channel) return Error("consumer cannot consume queues. RabbitMQ not working");

    try {
      const q = await this.channel.assertQueue(this.id, {
        exclusive: true
      });
      this.channel.bindQueue(q.queue, 'messages', this.id);
      console.log("Consumer binded to queue", this.id);
      this.channel.consume(q.queue, (msg) => {
        this.emitters.forEach(e => {
          e.emit('message', msg);
        });
      })
    } catch (err) {
      console.warn("error creating consumable queue", this.id);
      console.warn(err);
      this.emitters.forEach(e => {
        e.emit('error', err)
      });
    }
  }
}


module.exports = Consumer;