import amqplib from "amqplib";

class MessageBroker {
  isReady = this.init();
  connection: amqplib.Connection | undefined;
  channel: amqplib.Channel | undefined;

  constructor() {
    this.connection = undefined;
    this.channel = undefined;
  }

  async init() {
    const timeout = (ms: number | undefined) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    let isConnected = false;
    while (!isConnected) {
      try {
        this.connection = await amqplib.connect("amqp://rabbitmq");
        this.channel = await this.connection.createChannel();
        isConnected = true;
        console.log("RabbitMQ connected");
      } catch (e) {
        console.error(e);
        await timeout(3000);
      }
    }
  }

  async receive(queue: string) {
    try {
      await this.isReady;
      if (this.channel) {
        await this.channel.assertQueue(queue, { durable: true });
        console.log("Waiting for messages in %s", queue);
        await this.channel.consume(
          queue,
          function (msg) {
            console.log(" [x] Received %s", msg?.content.toString());
          },
          {
            noAck: true,
          }
        );
      }
    } catch (e) {
      console.error("RabbitMQ receive message error");
      console.error(e);
    }
  }
}

export default new MessageBroker();
