const test = require('eater/runner').test;
const assert = require('power-assert');
const Analyzer = require('../../lib/analyze_photo');
const mustCall = require('must-call');

test('analyze', (done, fail) => {
  const analyzer = new Analyzer({
    projectId: 'api-project-1039011175000',
    keyFilename: './foo.js'
  });
  analyzer.gcloud = {
    vision: mustCall(function mock() {
      return {
        detect: mustCall(function mock(image_path, types) {
          assert(image_path === '/tmp/photo.png');
          assert.deepEqual(types, ["faces", "labels", "text"]);
          done();
        })
      }
    })
  };
  analyzer.analyze('/tmp/photo.png')
});
