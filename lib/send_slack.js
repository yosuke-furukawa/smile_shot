const WebClient = require('@slack/client').WebClient;
const fs = require('fs');

class Sender {
  constructor(token, channels) {
    this.webClient = new WebClient(token);
    this.channels = channels;
  }

  upload(image_path, message) {
    return this.webClient.files.upload(image_path, {
      file: fs.createReadStream(image_path),
      initial_comment: message,
      channels: this.channels
    });
  }

  postMessage(message, channel) {
    return this.webClient.chat.postMessage(channel, message);
  }
}

module.exports = Sender;
