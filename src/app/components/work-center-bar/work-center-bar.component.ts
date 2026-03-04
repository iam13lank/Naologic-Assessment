import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WorkCenterService } from '../../services/work-center.service';

@Component({
  selector: 'app-work-center-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-center-bar.component.html',
  styleUrls: ['./work-center-bar.component.scss']
})
export class WorkCenterBarComponent {
  workCenters: any[] = [];

  constructor(private workCenterService: WorkCenterService) {}
  ngOnInit() {
    this.workCenters = this.workCenterService.getAll();
  }
}