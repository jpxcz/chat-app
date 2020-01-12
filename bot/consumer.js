const getCsv = require('get-csv');
const rabbit = require('amqplib');
const fetch = require('node-fetch');

class Consumer {
  constructor() {
    this.id = "bot";
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
      this.channel.assertExchange('messages', 'topic', { durable: false });
      console.log("Channel messages succesfully created");
      this.consumeQueue();
    } catch (err) {
      console.warn("error starting the consumer");
      console.warn(err);
      setTimeout(() => this.startConsumer(), 10000);

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
          "x-max-length": 5,
        }
      });
      this.channel.bindQueue(q.queue, 'messages', `*.${this.id}`);
      console.log("Consumer binded to queue", this.id);
      this.channel.consume(q.queue, async (data) => {
        const message = JSON.parse(data.content.toString());
        const chat = data.fields.routingKey.split(".")[0];
        console.log(chat)
        const username = message.username;
        const quote = await getQuote(message.text);
        sendQuote({ username, quote }, chat);

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

function getQuote(msg) {
  return new Promise((resolve, reject) => {
    const splitted = msg.split('/stock=');
    const stock = splitted[1];
    getCsv(`https://stooq.com/q/l/?s=${stock.toLowerCase()}&f=sd2t2ohlcv&h&e=csv`, { headers: false }).then(rows => {
      resolve(`“stock ${stock.toUpperCase()} quote is $${rows[1][6]} per share”.`);
    }).catch((err) => {
      console.warn(err);
      reject();
    })
  })
}

async function sendQuote(msg, chat) {
  try {
    const response = await fetch('http://api:5000/message', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId: chat, message: { username: msg.username, text: msg.quote } })
    });

    if (!response.ok && response.status !== 200) {
      console.warn('Unauthorized');
      return;
    }

  } catch (err) {
    console.warn("Something went wrong on sending the quote");
    console.warn(err)
  }

}

module.exports = Consumer;