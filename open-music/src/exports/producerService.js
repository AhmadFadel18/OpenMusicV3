const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    let connection;
    let channel;

    try {
      connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
      console.error('Gagal mengirim pesan ke queue:', error.message);
      throw error;
    } finally {
      setTimeout(() => {
        if (channel) channel.close().catch(() => { });
        if (connection) connection.close().catch(() => { });
      }, 1000);
    }
  },
};

module.exports = ProducerService;