import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';
import { ReactiveFormsModule } from '@angular/forms';

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

  private today = new Date();
  private nextMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate());

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('Acme Inc.'),
      status: new FormControl('blocked'),
      start: new FormControl(this.formatDate(this.today)),
      end: new FormControl(this.formatDate(this.nextMonth))
    });
  }
  private formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  submit() {
    console.log(this.form.value);
  }

  close() {
    console.log('close form');
  }
}