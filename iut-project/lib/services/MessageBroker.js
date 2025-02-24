const amqp = require('amqplib');

module.exports = class MessageBroker {
    static async sendMessage(queue, message) {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message envoyé : ${JSON.stringify(message)}`);
    }
};