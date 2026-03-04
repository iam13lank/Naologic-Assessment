import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-work-order-form-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, NgSelectModule],
  templateUrl: './work-order-form-panel.component.html',
  styleUrls: ['./work-order-form-panel.component.scss']
})
export class WorkOrderFormPanelComponent implements OnInit {

  @Input() workOrderForm: WorkOrderDocument | null = null;

  form!: FormGroup;
  statusOptions: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  panelOpen = false;

  private today = new Date();
  private nextMonth = new Date(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate());

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(''),
      status: new FormControl('open'),
      start: new FormControl(this.toStruct(this.today)),
      end: new FormControl(this.toStruct(this.nextMonth))
    });
  }
  

  /** Convert JS Date → NgbDateStruct */
  private toStruct(d: Date) {
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
  }

  /** Convert NgbDateStruct → JS Date */
  private toDate(struct: any): Date {
    return new Date(struct.year, struct.month - 1, struct.day);
  }

  /** OPEN PANEL FOR CREATE */
  openCreatePanel(date: Date) {
    this.workOrderForm = null;
    this.form.reset({
      name: 'Acme Inc.',
      status: 'open',
      start: this.toStruct(date),
      end: this.toStruct(new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000)) // default to 30 day duration
    });
    this.panelOpen = true;
  }
  /** OPEN PANEL FOR EDIT */
  openEditPanel(order: WorkOrderDocument) {
    this.workOrderForm = order;

    this.form.setValue({
      name: order.data.name,
      status: order.data.status,
      start: this.toStruct(new Date(order.data.startDate)),
      end: this.toStruct(new Date(order.data.endDate))
    });

    this.panelOpen = true;
  }

  /** CLOSE PANEL */
  close() {
    this.panelOpen = false;
  }

  /** SAVE / CREATE */
  submit() {
    const raw = this.form.value;

    const payload = {
      name: raw.name,
      status: raw.status,
      start: this.toDate(raw.start),
      end: this.toDate(raw.end)
    };

    if (this.workOrderForm) {
      console.log('Updating existing order:', payload);
      // this.workOrderService.update(...)
    } else {
      console.log('Creating new order:', payload);
      // this.workOrderService.create(...)
    }

    this.panelOpen = false;
  }
}
