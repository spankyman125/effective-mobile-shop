import amqplib from "amqplib";
import StockHistory from "../models/stockHistory";
import ProductHistory from "../models/productHistory";

interface Message {
  type: string;
  id: number;
  action: string;
  plu: string;
  date: Date;
}

interface MessageStock extends Message {
  shop_id: number;
  quantity_on_shelf: number;
  quantity_in_order: number;
}

interface MessageProduct extends Message {
  name: string;
}

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
          function (msgRMQ) {
            if (msgRMQ) {
              const message = JSON.parse(msgRMQ.content.toString()) as Message;
              switch (message.type) {
                case "stock":
                  console.log(message);
                  void StockHistory.create(message as MessageStock);
                  break;
                case "product":
                  console.log(message);
                  void ProductHistory.create(message as MessageProduct);
                  break;
                default:
                  console.error("Cannot parse received message");
              }
            } else {
              console.warn("Empty message received");
            }
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
