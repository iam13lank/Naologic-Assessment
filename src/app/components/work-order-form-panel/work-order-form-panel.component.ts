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
  todayPlaceholder = '';
  nextWeekPlaceholder = '';


  private today = new Date();
  private selectedWorkCenterId: string | null = null;
  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    this.todayPlaceholder = today.toISOString().split('T')[0];
    this.nextWeekPlaceholder = nextWeek.toISOString().split('T')[0];

    this.form = new FormGroup({
      name: new FormControl(''),
      status: new FormControl('open'),
      start: new FormControl(this.toStruct(today)),
      end: new FormControl(this.toStruct(nextWeek))
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
  openCreatePanel(event: { date: Date; workCenterId: string | null }) {
    this.selectedWorkCenterId = event.workCenterId;
    this.workOrderForm = null;
    this.form.reset({
      name: '',
      status: 'open',
      start: '',
      end: ''
    });
    this.panelOpen = true;
  }
  /** OPEN PANEL FOR EDIT */
  openEditPanel(order: WorkOrderDocument) {
    console.log('Editing order:', order);
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

  submit() {
    const raw = this.form.value;
    const payload: WorkOrderDocument = {
      docId: this.workOrderForm?.docId ?? crypto.randomUUID(), // look at this later
      docType: 'workOrder',
      data: {
        name: raw.name,
        status: raw.status,
        workCenterId: this.workOrderForm?.data.workCenterId ?? this.selectedWorkCenterId!,
        startDate: this.toDate(raw.start).toISOString(),
        endDate: this.toDate(raw.end).toISOString()
      }
    };

    if (this.workOrderForm) {
      this.workOrderService.update(payload);
    } else {
      this.workOrderService.create(payload);
    }

    this.panelOpen = false;
  }

}
