import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TimelineComponent } from './components/timeline/timeline.component';
import { WorkOrderFormPanelComponent } from './components/work-order-form-panel/work-order-form-panel.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-root',
  imports: [CommonModule, TimelineComponent, WorkOrderFormPanelComponent, FormsModule, NgSelectModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  timescale: 'day' | 'week' | 'month' = 'day';

  onTimescaleChange(newTimescale: 'day' | 'week' | 'month') {
    this.timescale = newTimescale;
  }
  
}
