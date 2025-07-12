const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Non-SSL untuk dev/testing, ubah ke true di production jika port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, playlist) {
    const result = await this._transporter.sendMail({
      from: process.env.SMTP_USER,
      to: targetEmail,
      subject: 'Ekspor Playlist',
      text: 'Berikut hasil ekspor playlist Anda',
      attachments: [
        {
          filename: 'playlist.json',
          content: JSON.stringify({ playlist }, null, 2),
        },
      ],
    });

    return result;
  }
}

module.exports = MailSender;
