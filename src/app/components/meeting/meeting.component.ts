import { Component, OnInit } from '@angular/core';
import { DeviceManagerService } from '../../services/DeviceManager/deviceManager.service';

@Component({
  selector: 'pwui-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  constructor(public readonly deviceManager: DeviceManagerService) {}

  ngOnInit(): void {}
}
