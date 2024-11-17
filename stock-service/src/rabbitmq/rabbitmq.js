import amqplib from 'amqplib'

class MessageBroker {
  isReady = this.init();

  async init() {
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
    let isConnected = false;
    while (!isConnected) {
      try {
        this.connection = await amqplib.connect('amqp://rabbitmq');
        this.channel = await this.connection.createChannel()
        this.isConnected = true;
        console.log("RabbitMQ connected")
        return Promise.resolve()
      } catch (e) {
        console.error(e)
        await timeout(3000)
      }
    }
  }

  async send(queue, message) {
    try {
      await this.isReady
      await this.channel.assertQueue(queue);
      return this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
    } catch (e) {
      console.error("RabbitMQ sending message error")
      console.error(e)
    }
  }
}

export default new MessageBroker()