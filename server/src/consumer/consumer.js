const rabbit = require('amqplib');
const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD } = require('../config');

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
        username: RABBITMQ_USERNAME,
        password: RABBITMQ_PASSWORD,
      });

      this.channel = await connection.createChannel();
      this.channel.assertExchange('messages', 'topic', { durable: false });
      console.log("Channel messages succesfully created");
      this.consumeQueue();
    } catch (err) {
      console.warn("error starting the consumer");
      console.warn(err);
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
        exclusive: true,
        arguments: {
          "x-max-length": 50,
        }
      });
      this.channel.bindQueue(q.queue, 'messages', `${this.id}.#`);
      console.log("Consumer binded to queue", this.id);
      this.channel.consume(q.queue, (msg) => {
        this.emitters.forEach(e => {
          e.emit('message', { chatId: this.id, data: msg });
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

  /**
   * 
   * @param {events.event} emitter - Event handler
   */
  addEmitter(emitter) {
    if (this.emitters.includes(emitter)) {
      console.log("Emitter already exists!")
      return;
    }
    else {
      this.emitters.push(emitter);
    }
  }

  /*
  async readMessages(n) {
    console.log("Getting last 50 msgs");
    if (!this.channel) return Error("consumer cannot read from queue. RabbitMQ not working");
    this.channel.prefetch(50);
    this.channel.get(this.id, )
    this.channel.get(this.id, data => {
      console.log(data)
    })
  }
  */
}


module.exports = Consumer;