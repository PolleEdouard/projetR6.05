const amqp = require('amqplib');
const MailService = require('./Mail');

async function consumeMessages(server) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('csv_exports');

    channel.consume('csv_exports', async (msg) => {
        if (msg !== null) {
            const { filePath, email } = JSON.parse(msg.content.toString());
            const mailService = server.services().mailService;

            await mailService.sendEmailWithAttachment(email, filePath);
            console.log(`E-mail envoyé à ${email} avec le fichier ${filePath}`);

            channel.ack(msg);
        }
    });
}

module.exports = consumeMessages;