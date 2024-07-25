import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebcamComponent } from './components/webcam/webcam.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WebcamComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'webcam-app';
}
