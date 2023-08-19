import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import '@kitware/vtk.js/Rendering';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkOutlineFilter from '@kitware/vtk.js/Filters/General/OutlineFilter';

import { Image, readDICOMTags, readImageArrayBuffer, readImageDICOMFileSeries } from 'itk-wasm'
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import { RequestService } from './shared/request.service';
import { Request } from './model/request';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  @ViewChild("vtkContainer", { static: true })
  vtkContainer!: ElementRef

  @ViewChild("vtkContainer2", { static: true })
  vtkContainer2!: ElementRef

  @ViewChild("vtkContainer3", { static: true })
  vtkContainer3!: ElementRef

  constructor(private requestService: RequestService){}


  //ImageVisualization -- One time for Image
  renderWindow = vtkRenderWindow.newInstance()
  renderer = vtkRenderer.newInstance()
  openGlRenderWindow = vtkOpenGLRenderWindow.newInstance()
  actor = vtkImageSlice.newInstance()
  mapper = vtkImageMapper.newInstance()
  file: File | undefined


  executeModel(){

    this.requestService.sendRequest(new Request(100)).subscribe(image =>{
      console.log(image)
    })
    this.requestService.getComplex().subscribe(complex=>{
      console.log(complex)
    })
  }


  imageVisualization(image: vtkImageData, itkImage: Image) {


    image.setDirection([1, 0, 0, 0, 1, 0, 0, 0, 1]); // Establecer la dirección correcta de la imagen
    image.setOrigin([0, 0, 0]); // Establecer el origen correcto para la visualización

    this.renderWindow.addRenderer(this.renderer)

    this.openGlRenderWindow.setContainer(this.vtkContainer3.nativeElement)
    this.openGlRenderWindow.setSize(500, 500)
    this.renderWindow.addView(this.openGlRenderWindow)


    this.actor.setMapper(this.mapper)
    this.renderer.addActor(this.actor)
    this.mapper.setInputData(image)


    // Interactor que maneja los eventos del mouse
    const style = vtkInteractorStyleManipulator.newInstance();
    const interactor = vtkRenderWindowInteractor.newInstance()
    interactor.setView(this.openGlRenderWindow)
    interactor.initialize()
    interactor.bindEvents(this.vtkContainer3.nativeElement)
    interactor.setInteractorStyle(style)

    // Interactor que maneja el estilo de la imagen (ventaneo)
    const styleImage = vtkInteractorStyleImage.newInstance();
    const imageInteractor = vtkRenderWindowInteractor.newInstance();
    imageInteractor.setView(this.openGlRenderWindow);
    imageInteractor.initialize();
    imageInteractor.bindEvents(this.vtkContainer3.nativeElement);
    imageInteractor.setInteractorStyle(styleImage);

    //Establecer eventos en los botones del mouse

    const mousePanning =
      vtkMouseCameraTrackballPanManipulator.newInstance({
        button: 2,
      });
    style.addMouseManipulator(mousePanning);

    const mouseZooming =
      vtkMouseCameraTrackballZoomManipulator.newInstance({
        button: 3,
      });
    style.addMouseManipulator(mouseZooming);


    //Ajustar ventana y nivel para mejorar visualización de Imágenes

    const imageProperty = this.actor.getProperty();
    const scalarRange = image.getPointData().getScalars().getRange();
    const window = scalarRange[1] - scalarRange[0];
    const level = (scalarRange[0] + scalarRange[1]) / 2;

    imageProperty.setColorLevel(level);
    imageProperty.setColorWindow(window);


   // Se ajusta la camara para que las imagenes tengan la orientación adecuada

    const camera = this.renderer.getActiveCamera();
    camera.setOrientationWXYZ(180, 1, 0, 0)
    camera.zoom(1)


    this.renderer.resetCamera()
    this.renderWindow.render()

  }

  onUpload(event: any) {
    this.file = event.target.files[0]
    const reader = new FileReader
    reader.onload = async (iEvent: any) => {
      const arrayBuffer = iEvent.target.result;
      const array = new Uint8Array(arrayBuffer);

      const { image: itkImage, webWorker } = await readImageArrayBuffer(null, array.buffer, this.file!.name, this.file!.type)
      const t = await readDICOMTags(webWorker,this.file!)
      const s = await readImageDICOMFileSeries(event.target.files)
      webWorker.terminate()
      const imageData = vtkITKHelper.convertItkToVtkImage(itkImage)
      this.imageVisualization(imageData, itkImage)
    }
    reader.readAsArrayBuffer(this.file!)
  }

}
