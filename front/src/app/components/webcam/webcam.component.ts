import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
  standalone: true,
  imports: [WebcamModule, MatButtonModule, MatIconModule],
})
export class WebcamComponent implements OnInit, OnDestroy {
  private socket!: Socket;
  public trigger: Subject<void> = new Subject<void>();
  public triggerObservable: Observable<void> = this.trigger.asObservable();

  public videoOptions: MediaTrackConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  ngOnInit() {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('videoStream', (data: any) => {
      try {
        const video = document.getElementById('live-video') as HTMLVideoElement;
        if (video) {
          const blob = new Blob([data], { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          video.src = url;
        }
      } catch (error) {
        console.error('Error processing video stream:', error);
      }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    console.log('Received webcam image', webcamImage);
    const imageAsBase64 = webcamImage.imageAsBase64;
    this.socket.emit('videoStream', imageAsBase64);
  }
}
