import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
// This component will be responsible for displaying the work centers in a bar format.
@Component({
  selector: 'app-work-center-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-center-bar.component.html',
  styleUrls: ['./work-center-bar.component.scss']
})
export class WorkCenterBarComponent {


}