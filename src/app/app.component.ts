import { Component, OnInit, VERSION } from '@angular/core';
import * as cornerstone from 'cornerstone-core';
// @ts-ignore
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'testMicro';
  imageId =
    'wadouri:https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323563.dcm';

  ngOnInit(): void {
    var element = document.getElementById('element');

    // Configure WADO Image Loader with dicomParser
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: false,
      taskConfiguration: {
        decodeTask: {
          initializeCodecsOnStartup: true,
          strict: false,
        },
      },
    });

    cornerstone.enable(element!);

    // Load & Display
    cornerstone.loadImage(this.imageId).then(function (image: cornerstone.Image) {

      cornerstone.displayImage(element!, image);

      var viewport = {
        invert: false,
        pixelReplication: false,
        voi: {
          windowWidth: 300,
          windowCenter: 100,
        },
        scale: 1.4,
        translation: {
          x: 0,
          y: 0,
        },
      };

      cornerstone.setViewport(element!, viewport);
      cornerstone.updateImage(element!);
    });
  }

}
