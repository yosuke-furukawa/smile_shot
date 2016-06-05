'use strict';
const opencv = require('opencv');
const EventEmitter = require('events');

const greenColor = [0, 255, 0];
const blueColor = [255, 0, 0];
const rectThickness = 2;
const faceClassifier = new opencv.CascadeClassifier(opencv.FACE_CASCADE);
const smileClassifier = new opencv.CascadeClassifier('./data/haarcascade_smile.xml');
const defaultFaceScale = 1.05;
const defaultFaceNeighbor = 8;
const defaultSmileScale = 1.7;
const defaultSmileNeighbor = 22;

class SmileFaceDetector extends EventEmitter {

  constructor (image, faceScale, faceNeighbor, smileScale, smileNeighbor) {
    super();
    this.image = image;
    this.faceScale = faceScale || defaultFaceScale;
    this.faceNeighbor = faceNeighbor || defaultFaceNeighbor;
    this.smileScale = smileScale || defaultSmileScale;
    this.smileNeighbor = smileNeighbor || defaultSmileNeighbor;
  }

  detect() {
    faceClassifier.detectMultiScale(this.image, (err, faces) => {
      if (err) this.emit('err', err);
      faces.forEach((face, faceIndex) => {
        const halfHeight = parseInt(face.height / 2);
        const faceImage = this.image.roi(face.x, face.y + halfHeight, face.width, halfHeight);
        faceImage.convertGrayscale();
        faceImage.equalizeHist();
        if (faces && faces.length) {
          this.emit('face', faces);
        }
        smileClassifier.detectMultiScale(faceImage, (err, smiles) => {
          if (err) {
            this.emit('error', err);
          }
          if (smiles && smiles.length) {
            this.emit('smile', smiles);
          }
        }, this.smileScale, this.smileNeighbor, face.width/4, face.height/4);
      });
    }, this.faceScale, this.faceNeighbor);
  }

  drawRectangle(rects, color) {
    const rectangles = !Array.isArray(rects) ? [rects] : rects;
    rectangles.forEach((rect) => {
      this.image.rectangle([rect.x, rect.y], [rect.width, rect.height], color, rectThickness);
    });
  }

  getImage() {
    return this.image;
  }
}

SmileFaceDetector.green = greenColor;
SmileFaceDetector.blue = blueColor;

module.exports = SmileFaceDetector;
