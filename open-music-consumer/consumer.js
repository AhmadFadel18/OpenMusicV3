require('dotenv').config();

const amqp = require('amqplib');
const MailSender = require('./src/mailSender');

const init = async () => {
  const mailSender = new MailSender();
  const queue = 'export:playlist';

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.consume(queue, async (message) => {
    const { targetEmail, playlist } = JSON.parse(message.content.toString());

    console.log(`Target email: ${targetEmail}`);
    console.log('Playlist yang diterima:');
    console.log(JSON.stringify(playlist, null, 2));

    try {
      await mailSender.sendEmail(targetEmail, playlist);
      console.log(`Berhasil mengirim playlist ke ${targetEmail}`);
      channel.ack(message);
    } catch (error) {
      console.error('Gagal mengirim email:', error);
    }
  });

};

init();
