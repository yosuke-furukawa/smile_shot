const opencv = require('opencv');
const Sender = require('./lib/send_slack');
const SmileDetector = require('./lib/detect_smile');
const Analyzer = require('./lib/analyze_photo');
const gcloudOpts = require('./conf/gcloud.json');
const analyzer = new Analyzer(gcloudOpts);
const slackOpts = require('./conf/slack.json');
const imagePath = '/tmp/photo.jpg';
const sender = new Sender(slackOpts.api_token, slackOpts.channels);

const camera = new opencv.VideoCapture(0);
const camWidth = 640;
const camHeight = 480;
camera.setWidth(camWidth);
camera.setHeight(camHeight);
function readCam() {
  camera.read((err, image) => {
    const smileDetector = new SmileDetector(image);
    smileDetector.on('error', (error) => {
      console.log(error);
    });
    smileDetector.on('face', (faces) => {
      console.log('detect face ...');
      image.save(imagePath);
      analyzer.analyze(imagePath).then((labels) => {
        console.log('analyze ... ' + JSON.stringify(labels));
        return sender.upload(imagePath);
      }).then((res) => {
        console.log('send slack ...');
      }).catch((e) => {
        console.log(e);
      });
      smileDetector.drawRectangle(faces, SmileDetector.green);
    });
    smileDetector.on('smile', (smiles) => {
      console.log('detect smile ...');
      smileDetector.drawRectangle(smiles, SmileDetector.blue);
    });
    smileDetector.detect();
  });
}

setInterval(readCam, 2000);
