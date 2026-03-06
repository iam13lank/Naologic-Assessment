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
    const today = this.todayStruct();
    const nextWeek = this.addDaysStruct(today, 7);

    this.selectedPlaceholder = this.formatStruct(today);
    this.nextWeekPlaceholder = this.formatStruct(nextWeek);

    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        status: new FormControl('open', { nonNullable: true }),
        start: new FormControl(null as NgbDateStruct | null, Validators.required),
        end: new FormControl(null as NgbDateStruct | null, Validators.required),
      },
      {
        validators: [this.dateRangeValidator.bind(this), this.overlapValidator.bind(this)],
      }
    );
  }

  // -------------------------------
  // DATE HELPERS (NO TIMEZONE EVER)
  // -------------------------------

  private todayStruct(): NgbDateStruct {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  private addDaysStruct(date: NgbDateStruct, days: number): NgbDateStruct {
    const js = new Date(date.year, date.month - 1, date.day + days);
    return { year: js.getFullYear(), month: js.getMonth() + 1, day: js.getDate() };
  }

  private parseIsoToStruct(iso: string): NgbDateStruct {
    const [y, m, d] = iso.split('-').map(Number);
    return { year: y, month: m, day: d };
  }

  formatStruct(date: NgbDateStruct | null): string {
    if (!date) return '';
    const y = date.year;
    const m = String(date.month).padStart(2, '0');
    const d = String(date.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private structToJs(date: NgbDateStruct): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  // -------------------------------
  // VALIDATORS
  // -------------------------------

  private dateRangeValidator(control: AbstractControl) {
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;

    if (!start || !end) return null;

    const s = this.structToJs(start);
    const e = this.structToJs(end);

    return e < s ? { invalidRange: true } : null;
  }

  private overlapValidator(control: AbstractControl) {
    if (!this.selectedWorkCenterId) return null;

    const start = control.get('start')?.value;
    const end = control.get('end')?.value;
    if (!start || !end) return null;

    const s = this.structToJs(start);
    const e = this.structToJs(end);

    const all = this.workOrderService.getAll();

    const overlapping = all.some(order => {
      if (order.data.workCenterId !== this.selectedWorkCenterId) return false;
      if (this.workOrderForm && order.docId === this.workOrderForm.docId) return false;

      const oStart = this.structToJs(this.parseIsoToStruct(order.data.startDate));
      const oEnd = this.structToJs(this.parseIsoToStruct(order.data.endDate));

      return s <= oEnd && e >= oStart;
    });

    return overlapping ? { overlap: true } : null;
  }

  // -------------------------------
  // PANEL OPEN/CLOSE
  // -------------------------------

  openCreatePanel(event: { date: Date; workCenterId: string | null }) {
    this.selectedWorkCenterId = event.workCenterId;
    this.workOrderForm = null;

    const clicked = {
      year: event.date.getFullYear(),
      month: event.date.getMonth() + 1,
      day: event.date.getDate()
    };

    const nextWeek = this.addDaysStruct(clicked, 7);

    this.selectedPlaceholder = this.formatStruct(clicked);
    this.nextWeekPlaceholder = this.formatStruct(nextWeek);

    this.form.reset({
      name: '',
      status: 'open',
      start: null,
      end: null,
    });

    this.panelOpen = true;
    this.form.updateValueAndValidity();
  }

  openEditPanel(order: WorkOrderDocument) {
    this.workOrderForm = order;

    this.form.setValue({
      name: order.data.name,
      status: order.data.status,
      start: this.parseIsoToStruct(order.data.startDate),
      end: this.parseIsoToStruct(order.data.endDate),
    });

    this.panelOpen = true;
  }

  close() {
    this.form.reset({
      name: '',
      status: 'open',
      start: null,
      end: null,
    });
    this.panelOpen = false;
  }

  // -------------------------------
  // SUBMIT
  // -------------------------------

  submit() {
    if (!this.form.value.start) {
      this.form.patchValue({ start: this.parseIsoToStruct(this.selectedPlaceholder) });
    }
    if (!this.form.value.end) {
      this.form.patchValue({ end: this.parseIsoToStruct(this.nextWeekPlaceholder) });
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

    if (this.workOrderForm) this.workOrderService.update(payload);
    else this.workOrderService.create(payload);
    
    this.close()
  }

  // -------------------------------
  // DATEPICKER CONTROLS
  // -------------------------------

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
