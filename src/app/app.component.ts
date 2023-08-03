import { ViewChild, ElementRef, Component } from '@angular/core';

import '@kitware/vtk.js/Rendering/Profiles/Geometry'
import '@kitware/vtk.js/Rendering/Profiles/Volume'
import vtkRenderWindowInteractor from "@kitware/vtk.js/Rendering/Core/RenderWindowInteractor";
import vtkInteractorStyleTrackballCamera from "@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera";
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkOpenGLRenderWindow from "@kitware/vtk.js/Rendering/OpenGL/RenderWindow";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';

  @ViewChild('content', { read: ElementRef }) content!: ElementRef;

  vtkRenderWindow: vtkRenderWindow | undefined;
  openglRenderWindow: vtkOpenGLRenderWindow | undefined;
  

  ngAfterViewInit(): void {
    const container = this.content.nativeElement

    this.vtkRenderWindow = vtkRenderWindow.newInstance();
    this.openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    this.openglRenderWindow.setContainer(container);
    this.openglRenderWindow.setSize(100, 100);
    this.vtkRenderWindow.addView(this.openglRenderWindow);
    const coneSource = vtkConeSource.newInstance();
    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();
    actor.setMapper(mapper);
    mapper.setInputConnection(coneSource.getOutputPort());
    const renderer = vtkRenderer.newInstance();
    this.vtkRenderWindow.addRenderer(renderer);
    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setInteractorStyle(
        vtkInteractorStyleTrackballCamera.newInstance()
    );
    interactor.setView(this.openglRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);
    renderer.addActor(actor);
    renderer.resetCamera();
    this.vtkRenderWindow.render();


  }
}