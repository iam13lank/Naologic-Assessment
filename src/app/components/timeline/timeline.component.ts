import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
// This component will be responsible for displaying the timeline of work orders and their associated work centers. 
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent{
    @Input() timescale: 'day' | 'week' | 'month' = 'day';

}