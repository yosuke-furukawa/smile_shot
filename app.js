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
      analyzer.analyze(imagePath).then((data) => {
        console.log('analyze ... ' + JSON.stringify(data));
        const faces = data.faces;
        const labels = data.labels;
        const emo = faces.map((face) => {
        return `
          happy: ${face.happy},
          dark: ${face.dark},
          sad: ${face.sad},
          surprised: ${face.surprised},
          blurry: ${face.blurry},
          mad: ${face.mad},
          hat: ${face.hat},
        `;
        });
        const message = `${emo}, labels: ${labels}`;
        return sender.upload(imagePath, message);
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
