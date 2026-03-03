import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { WorkOrderService, } from '../../services/work-order.service';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';
import { ReactiveFormsModule } from '@angular/forms';

// This component will be responsible for displaying the form panel for creating or editing work orders.
@Component({
  selector: 'app-work-order-form-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-order-form-panel.component.html',
  styleUrls: ['./work-order-form-panel.component.scss']
})
export class WorkOrderFormPanelComponent {
  @Input() workOrderForm: WorkOrderDocument | null = null;
  form!: FormGroup;
  statusOptions: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  constructor(private workOrderService: WorkOrderService) {}
  date = new Date().getDate()
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('Acme Inc.'),
      status: new FormControl('blocked'),
      start: new FormControl(this.date),
      end: new FormControl(this.date)
    });
  }
  submit() {
    console.log(this.form.value);
  }
  close() { 
    console.log('close form');
  }

}