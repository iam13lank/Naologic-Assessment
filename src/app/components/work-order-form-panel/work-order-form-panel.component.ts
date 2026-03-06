import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkOrderDocument, WorkOrderStatus } from '../../models/work-order.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-work-order-form-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, NgSelectModule],
  templateUrl: './work-order-form-panel.component.html',
  styleUrls: ['./work-order-form-panel.component.scss'],
})
export class WorkOrderFormPanelComponent implements OnInit {
  @Input() workOrderForm: WorkOrderDocument | null = null;

  form!: FormGroup;
  statusOptions: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  panelOpen = false;
  selectedPlaceholder = '';
  nextWeekPlaceholder = '';

  private selectedWorkCenterId: string | null = null;
  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit() {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    this.selectedPlaceholder = today.toISOString().split('T')[0];
    this.nextWeekPlaceholder = nextWeek.toISOString().split('T')[0];

    this.form = new FormGroup(
      {
        name: new FormControl('', { validators: [Validators.required] }),
        status: new FormControl('open', { nonNullable: true }),
        start: new FormControl(null as NgbDateStruct | null, { validators: [Validators.required] }),
        end: new FormControl(null as NgbDateStruct | null, { validators: [Validators.required] }),
      },
      {
        validators: [this.dateRangeValidator.bind(this), this.overlapValidator.bind(this)],
      },
    );
  }
  private dateRangeValidator(control: AbstractControl) {
    const form = control as FormGroup;
    const start = form.get('start')?.value;
    const end = form.get('end')?.value;

    if (!start || !end) return { invalidRange: true }; // force error

    const startDate = this.toDate(start);
    const endDate = this.toDate(end);

    return endDate < startDate ? { invalidRange: true } : null;
  }

  private overlapValidator(control: AbstractControl) {
    if (!this.selectedWorkCenterId) return null;
    const form = control as FormGroup;
    const start = form.get('start')?.value;
    const end = form.get('end')?.value;

    if (!start || !end) return null;

    const startDate = this.toDate(start);
    const endDate = this.toDate(end);

    const allOrders = this.workOrderService.getAll();

    const overlapping = allOrders.some((order) => {
      if (order.data.workCenterId !== this.selectedWorkCenterId) return false;

      // Skip the order being edited
      if (this.workOrderForm && order.docId === this.workOrderForm.docId) return false;

      const oStart = new Date(order.data.startDate);
      const oEnd = new Date(order.data.endDate);

      return startDate <= oEnd && endDate >= oStart;
    });

    return overlapping ? { overlap: true } : null;
  }

  /** Convert JS Date → NgbDateStruct */
  private toStruct(d: Date) {
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }

  /** Convert NgbDateStruct → JS Date */
  private toDate(struct: any): Date {
    return new Date(struct.year, struct.month - 1, struct.day);
  }

  openCreatePanel(event: { date: Date; workCenterId: string | null }) {
    this.selectedWorkCenterId = event.workCenterId;
    this.workOrderForm = null;

    const clicked = new Date(event.date);
    const nextWeek = new Date(clicked);
    nextWeek.setDate(clicked.getDate() + 7);

    // Set placeholders based on clicked date
    this.selectedPlaceholder = clicked.toISOString().split('T')[0];
    this.nextWeekPlaceholder = nextWeek.toISOString().split('T')[0];

    // Reset form with empty values (required validators will handle empties)
    this.form.reset({
      name: '',
      status: 'open',
      start: null,
      end: null,
    });
    this.panelOpen = true;
    // Re-run validators now that workCenterId is known
    this.form.updateValueAndValidity();
  }

  /** OPEN PANEL FOR EDIT */
  openEditPanel(order: WorkOrderDocument) {
    console.log(order)
    this.workOrderForm = order;
    this.form.setValue({
      name: order.data.name,
      status: order.data.status,
      start: this.toStruct(new Date(order.data.startDate)),
      end: this.toStruct(new Date(order.data.endDate)),
    });

    this.panelOpen = true;
  }


  /** CLOSE PANEL */
  close() {
    this.panelOpen = false;
  }
  formatStruct(date: NgbDateStruct | null): string {
    if (!date) return '';
    const y = date.year;
    const m = String(date.month).padStart(2, '0');
    const d = String(date.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  submit() {
    // Auto-fill start date if empty
    if (!this.form.value.start) {
      this.form.patchValue({
        start: this.toStruct(new Date(this.selectedPlaceholder)),
      });
    }

    if (!this.form.value.end) {
      this.form.patchValue({
        end: this.toStruct(new Date(this.nextWeekPlaceholder)),
      });
    }


    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const payload: WorkOrderDocument = {
      docId: this.workOrderForm?.docId ?? crypto.randomUUID(),
      docType: 'workOrder',
      data: {
        name: raw.name,
        status: raw.status,
        workCenterId: this.workOrderForm?.data.workCenterId ?? this.selectedWorkCenterId!,
        startDate: this.formatStruct(raw.start),
        endDate: this.formatStruct(raw.end),
      }
    };

    if (this.workOrderForm) {
      this.workOrderService.update(payload);
    } else {
      this.workOrderService.create(payload);
    }

    this.panelOpen = false;
  }
  






  //PANEL CONTROLS
  startOpen = false;
  endOpen = false;
  openStart() {
    this.startOpen = !this.startOpen;
    this.endOpen = false;
  }

  openEnd() {
    this.endOpen = !this.endOpen;
    this.startOpen = false;
  }

  onStartSelect(date: NgbDateStruct) {
    this.form.patchValue({ start: date });
    this.startOpen = false;
  }

  onEndSelect(date: NgbDateStruct) {
    this.form.patchValue({ end: date });
    this.endOpen = false;
  }

  @HostListener('document:click')
  closeAll() {
    this.startOpen = false;
    this.endOpen = false;
  }
}
