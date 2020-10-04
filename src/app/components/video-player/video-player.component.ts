import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pwui-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() videoStream: MediaStream;
  constructor() {}

  async ngOnInit(): Promise<void> {}
}
