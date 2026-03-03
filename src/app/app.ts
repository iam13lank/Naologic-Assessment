import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component';
import { WorkCenterBarComponent } from './components/work-center-bar/work-center-bar.component';
import { WorkOrderFormPanelComponent } from './components/work-order-form-panel/work-order-form-panel.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TimelineComponent, WorkCenterBarComponent, WorkOrderFormPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  timescale: 'day' | 'week' | 'month' = 'day';

  onTimescaleChange(newTimescale: 'day' | 'week' | 'month') {
    this.timescale = newTimescale;
  }
  
}
