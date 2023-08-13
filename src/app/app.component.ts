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

import { Image, readImageArrayBuffer } from 'itk-wasm'
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild("vtkContainer", { static: true })
  vtkContainer!: ElementRef

  @ViewChild("vtkContainer2", { static: true })
  vtkContainer2!: ElementRef

  @ViewChild("vtkContainer3", { static: true })
  vtkContainer3!: ElementRef


  //example1
  height = 1
  cone = vtkConeSource.newInstance({ height: this.height })
  interactor = vtkRenderWindowInteractor.newInstance()

  //ImageVisualization -- One time for Image
  renderWindow = vtkRenderWindow.newInstance()
  renderer = vtkRenderer.newInstance()
  openGlRenderWindow = vtkOpenGLRenderWindow.newInstance()
  actor = vtkImageSlice.newInstance()
  mapper = vtkImageMapper.newInstance()

  ngOnInit(): void {
    this.example1()
    this.example2()
  }

  example1() {
    const renderWindow = vtkRenderWindow.newInstance()
    const renderer = vtkRenderer.newInstance()
    renderWindow.addRenderer(renderer)

    const openGlRenderWindow = vtkOpenGLRenderWindow.newInstance()
    openGlRenderWindow.setContainer(this.vtkContainer.nativeElement)
    //openGlRenderWindow.setSize(300, 300)
    renderWindow.addView(openGlRenderWindow)


    this.interactor.setView(openGlRenderWindow)
    this.interactor.initialize()
    this.interactor.bindEvents(this.vtkContainer.nativeElement)

    const trackball = vtkInteractorStyleTrackballCamera.newInstance()
    this.interactor.setInteractorStyle(trackball)


    const actor = vtkActor.newInstance()
    const mapper = vtkMapper.newInstance()

    actor.setMapper(mapper)
    mapper.setInputConnection(this.cone.getOutputPort())
    renderer.addActor(actor)

    renderer.resetCamera()
    renderWindow.render()
  }

  updateCone() {
    this.cone.setHeight(this.height / 100)
    this.interactor.render()
  }

  example2() {
    const renderWindow = vtkRenderWindow.newInstance()
    const renderer = vtkRenderer.newInstance()
    renderWindow.addRenderer(renderer)

    const openGlRenderWindow = vtkOpenGLRenderWindow.newInstance()
    openGlRenderWindow.setContainer(this.vtkContainer2.nativeElement)
    //openGlRenderWindow.setSize(300, 300)
    renderWindow.addView(openGlRenderWindow)

    const interactor = vtkRenderWindowInteractor.newInstance()
    interactor.setView(openGlRenderWindow)
    interactor.initialize()
    interactor.bindEvents(this.vtkContainer2.nativeElement)

    const trackball = vtkInteractorStyleTrackballCamera.newInstance()
    interactor.setInteractorStyle(trackball)


    const ball = vtkSphereSource.newInstance()

    const actor = vtkActor.newInstance()
    const mapper = vtkMapper.newInstance()
    actor.setMapper(mapper)

    mapper.setInputConnection(ball.getOutputPort())

    renderer.addActor(actor)


    const outlineActor = vtkActor.newInstance()
    const outlineMapper = vtkMapper.newInstance()
    outlineActor.setMapper(outlineMapper)

    const filter = vtkOutlineFilter.newInstance()

    filter.setInputConnection(ball.getOutputPort())

    outlineMapper.setInputConnection(filter.getOutputPort())


    renderer.addActor(outlineActor)

    renderer.resetCamera()
    renderWindow.render()

    setInterval(() => {
      const camera = renderer.getActiveCamera()
      camera.azimuth(1)
      interactor.render()
    }, 10)
  }

  imageVisualization(image: vtkImageData) {

    this.renderWindow.addRenderer(this.renderer)

    this.openGlRenderWindow.setContainer(this.vtkContainer3.nativeElement)
    this.openGlRenderWindow.setSize(400, 400)
    this.renderWindow.addView(this.openGlRenderWindow)


    this.actor.setMapper(this.mapper)
    this.renderer.addActor(this.actor)
    this.mapper.setInputData(image)

    // Interactors
    const style = vtkInteractorStyleManipulator.newInstance();
    const interactor = vtkRenderWindowInteractor.newInstance()
    interactor.setView(this.openGlRenderWindow)
    interactor.initialize()
    interactor.bindEvents(this.vtkContainer3.nativeElement)
    interactor.setInteractorStyle(style)

    const styleImage = vtkInteractorStyleImage.newInstance();
    const imageInteractor = vtkRenderWindowInteractor.newInstance();
    imageInteractor.setView(this.openGlRenderWindow);
    imageInteractor.initialize();
    imageInteractor.bindEvents(this.vtkContainer3.nativeElement);
    imageInteractor.setInteractorStyle(styleImage);


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




    const camera = this.renderer.getActiveCamera();
    camera.setParallelProjection(true)
    camera.setOrientationWXYZ(180, 1, 0, 0)
    camera.setPosition(0, 0, 1);

    camera.modified()

    this.renderer.resetCamera(image.getBounds())
    this.renderWindow.render()


  }

  onUpload(event: any) {
    const file: File = event.target.files[0]
    const reader = new FileReader
    reader.onload = async (iEvent: any) => {
      const arrayBuffer = iEvent.target.result;
      const array = new Uint8Array(arrayBuffer);

      const { image: itkImage, webWorker } = await readImageArrayBuffer(null, array.buffer, file.name, file.type)
      webWorker.terminate()
      const imageData = vtkITKHelper.convertItkToVtkImage(itkImage)
      this.imageVisualization(imageData)
    }
    reader.readAsArrayBuffer(file)
  }

}
