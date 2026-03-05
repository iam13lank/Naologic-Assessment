import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-order-bar.component.html',
  styleUrls: ['./work-order-bar.component.scss']
})
export class WorkOrderBarComponent {
  workCenters: any[] = [];

  constructor(private WorkOrderService: WorkOrderService) {}
  ngOnInit() {
    this.workCenters = this.WorkOrderService.getAll();
  }
}