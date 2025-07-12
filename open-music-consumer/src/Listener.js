const NotesService = require('./notesService');
const MailSender = require('./mailSender');

class Listener {
  constructor(mailSender) {
    this._notesService = new NotesService();
    this._mailSender = mailSender;
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());

      const { playlist } = await this._notesService.getSongsFromPlaylist(playlistId);

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));

      console.log(`Berhasil mengirimkan playlist ke ${targetEmail}`);
      console.log(result);
    } catch (error) {
      console.error('Gagal memproses pesan:', error);
    }
  }
}

module.exports = Listener;
