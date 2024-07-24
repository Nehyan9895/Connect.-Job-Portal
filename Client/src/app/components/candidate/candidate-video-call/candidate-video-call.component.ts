import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io,Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

declare const Peer: new (arg0: string, arg1: { host: string; port: number; }) => any;

interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}


@Component({
  selector: 'app-candidate-video-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-video-call.component.html',
  styleUrl: './candidate-video-call.component.scss'
})
export class CandidateVideoCallComponent implements OnInit {
  currentUserId: string = uuidv4();
  videos: VideoElement[] = [];

  constructor(
    private route: ActivatedRoute,
    private socket: Socket
  ) { }

  ngOnInit() {
    this.initializePeerConnection();
  }

  initializePeerConnection() {
    const myPeer = new Peer(this.currentUserId, {
      host: '/',
      port: 3001
    });

    this.route.params.subscribe((params) => {
      myPeer.on('open', (userId: any) => {
        this.socket.emit('join-room', params['roomId'], userId);
      });
    });

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(stream => {
      this.addMyVideo(stream);

      myPeer.on('call', (call: { answer: (arg0: MediaStream) => void; on: (arg0: string, arg1: (otherUserVideoStream: any) => void) => void; metadata: { userId: string; }; }) => {
        call.answer(stream);
        call.on('stream', (otherUserVideoStream: MediaStream) => {
          this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
        });
      });

      this.socket.on('user-connected', userId => {
        setTimeout(() => {
          const call = myPeer.call(userId, stream, {
            metadata: { userId: this.currentUserId }
          });
          call.on('stream', (otherUserVideoStream: MediaStream) => {
            this.addOtherUserVideo(userId, otherUserVideoStream);
          });
          call.on('close', () => {
            this.videos = this.videos.filter(video => video.userId !== userId);
          });
        }, 1000);
      });
    });

    this.socket.on('user-disconnected', userId => {
      this.videos = this.videos.filter(video => video.userId !== userId);
    });
  }

  addMyVideo(stream: MediaStream) {
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.currentUserId
    });
  }

  addOtherUserVideo(userId: string, stream: MediaStream) {
    if (!this.videos.some(video => video.userId === userId)) {
      this.videos.push({
        muted: false,
        srcObject: stream,
        userId
      });
    }
  }

  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }
}
