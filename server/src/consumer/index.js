const Consumer = require('./consumer');

class Consumers {
  constructor() {
    if (Consumers.exists) {
      return Consumers.instance
    }
    this.queues = {};
    Consumers.instance = this;
    Consumers.exists = true;
    return this
  }

  /**
   * 
   * @param {string} queue - chat Id we want
   * @returns {Consumer} consumer - consumer of RabbitMQ 
   */
  getConsumer(queue) {
    if(this.queues[queue]) return this.queues[queue];
    else {
      this.queues[queue] = new Consumer(queue);
      return this.queues[queue];
    }
  }
}

module.exports = Consumers;