'use strict';
const gcloud = require('gcloud');

class Analyzer {
  constructor(opts) {
    this.gcloud = gcloud(opts);
  }

  analyze(image_path, types) {
    const vision = this.gcloud.vision();
    const typeList = types || ['faces', 'labels', 'text'];
    
    return new Promise((resolve, reject) => {
      vision.detect(image_path, typeList, (err, labels) => {
        if (err) {
          return reject(err);
        }
        return resolve(labels);
      });
    });
  }

}

module.exports = Analyzer;
