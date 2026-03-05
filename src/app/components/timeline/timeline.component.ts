import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkCenterService } from '../../services/work-center.service';
import { WorkOrderDocument } from '../../models/work-order.model';
import { WorkOrderBarComponent } from '../work-order-bar/work-order-bar.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, WorkOrderBarComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {

  @Input() timescale: 'day' | 'week' | 'month' = 'day';

  @Output() createAtDate = new EventEmitter<{ date: Date; workCenterId: string | null }>();
  @Output() editOrder = new EventEmitter<WorkOrderDocument>();

  visibleCells: { date: Date; label: string }[] = [];
  workCenters: any;

  hoveredCellIndex: number | null = null;
  hoveredDate: Date | null = null;
  selectedWorkCenterId: string | null = null;

  constructor(
    private workOrderService: WorkOrderService,
    private workCenterService: WorkCenterService
  ) {}

  ngOnInit() {
    this.workCenters = this.workCenterService.getAll();
    this.visibleCells = this.calculateVisibleCells(this.timescale);
  }

  ngOnChanges() {
    this.visibleCells = this.calculateVisibleCells(this.timescale);
  }

  // -------------------------------
  // CELL INTERACTION
  // -------------------------------

  onCellHover(cell: { date: Date }, index: number, wc: { docId: string }) {
    this.hoveredCellIndex = index;
    this.hoveredDate = cell.date;
    this.selectedWorkCenterId = wc.docId;
  }

  onCellLeave() {
    this.hoveredCellIndex = null;
    this.hoveredDate = null;
  }

  onCellClick(cell: { date: Date }, wc: { docId: string }) {
    this.createAtDate.emit({
      date: cell.date,
      workCenterId: wc.docId
    });
  }

  // -------------------------------
  // BAR EVENTS FROM CHILD COMPONENT
  // -------------------------------

  onBarEdit(order: WorkOrderDocument) {
    this.editOrder.emit(order);
  }

  onBarDelete(order: WorkOrderDocument) {
    this.workOrderService.delete(order.docId);
  }

  // -------------------------------
  // WORK ORDER FILTERING
  // -------------------------------

  getWorkorderByCenterId(centerId: string) {
    return this.workOrderService.getAll().filter(
      wo => wo.data.workCenterId === centerId
    );
  }

  // -------------------------------
  // TIMELINE CELL CALCULATION
  // -------------------------------

  calculateVisibleCells(timescale: 'day' | 'week' | 'month') {
    const today = new Date();

    const start = new Date(today);
    const end = new Date(today);

    if (timescale === 'day') {
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() + 14);
    }

    if (timescale === 'week') {
      start.setDate(start.getDate() - 56);
      end.setDate(end.getDate() + 56);
    }

    if (timescale === 'month') {
      start.setMonth(start.getMonth() - 6);
      end.setMonth(end.getMonth() + 6);
    }

    const cells = [];
    const current = new Date(start);

    while (current <= end) {
      if (timescale === 'day') {
        cells.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        });
        current.setDate(current.getDate() + 1);
      }

      if (timescale === 'week') {
        const weekLabel = `Week ${this.getWeekNumber(current)}`;
        cells.push({
          date: new Date(current),
          label: weekLabel
        });
        current.setDate(current.getDate() + 7);
      }

      if (timescale === 'month') {
        cells.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })
        });
        current.setMonth(current.getMonth() + 1);
      }
    }

    return cells;
  }

  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
  }

  

  getCellWidth() {
    if (this.timescale === 'day') return 180;
    if (this.timescale === 'week') return 200;
    if (this.timescale === 'month') return 150;
    return 80;
  }

 

  // -------------------------------
  // CURRENT MONTH PILL
  // -------------------------------

  getCurrentMonthStyle() {
    const range = this.getCurrentMonthRange();
    if (!range) return {};

    const cellWidth = this.getCellWidth();

    return {
      left: `${range.firstIndex * cellWidth}px`,
      width: `${(range.lastIndex - range.firstIndex + 1) * cellWidth}px`
    };
  }

  getCurrentMonthRange() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const firstIndex = this.visibleCells.findIndex(
      c => c.date.getMonth() === month && c.date.getFullYear() === year
    );

    const lastIndex = [...this.visibleCells]
      .reverse()
      .findIndex(c => c.date.getMonth() === month && c.date.getFullYear() === year);

    if (firstIndex === -1 || lastIndex === -1) return null;

    const realLastIndex = this.visibleCells.length - 1 - lastIndex;

    return { firstIndex, lastIndex: realLastIndex };
  }
}
