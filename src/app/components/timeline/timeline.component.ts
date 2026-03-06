import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
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

  @Input() timescale: 'Day' | 'Week' | 'Month' = 'Day';

  @Output() createAtDate = new EventEmitter<{ date: Date; workCenterId: string | null }>();
  @Output() editOrder = new EventEmitter<WorkOrderDocument>();
  @ViewChildren('timelineCell') cellElements!: QueryList<ElementRef>;

  visibleCells: { date: Date; label: string }[] = [];
  workCenters: any;

  hoveredCellIndex: number | null = null;
  hoveredDate: Date | null = null;
  selectedWorkCenterId: string | null = null;
  hoverPopup = {
    visible: false,
    x: 0,
    y: 0
  };

  constructor(
    private workOrderService: WorkOrderService,
    private workCenterService: WorkCenterService
  ) {}

  ngOnInit() {
    this.workCenters = this.workCenterService.getAll();
    this.visibleCells = this.calculateVisibleCells(this.timescale);
  }

  ngAfterViewInit() {
    this.scrollToToday();
  }

  ngOnChanges() {
    this.visibleCells = this.calculateVisibleCells(this.timescale);
    setTimeout(() => this.scrollToToday(), 0);
  }


  // -------------------------------
  // CELL INTERACTION
  // -------------------------------

  onCellHover(cell: { date: Date }, index: number, wc: { docId: string }, event: MouseEvent, cellEl: HTMLElement) {
    this.hoveredCellIndex = index;
    this.hoveredDate = cell.date;
    this.selectedWorkCenterId = wc.docId;
    const rect = cellEl.getBoundingClientRect();
    // Show popup only if this cell has no work orders
    const hasOrders = this.getWorkorderByCenterId(wc.docId)
      .some(o => this.isDateWithinOrder(cell.date, o));

    if (!hasOrders && event) {
       this.hoverPopup.visible = true;
      this.hoverPopup.x = rect.left + rect.width / 2;  
      this.hoverPopup.y = rect.top - 10;                
    }
  }


  isDateWithinOrder(date: Date, order: WorkOrderDocument) {
    const start = new Date(order.data.startDate);
    const end = new Date(order.data.endDate);
    return date >= start && date <= end;
  }


  onCellLeave() {
    this.hoveredCellIndex = null;
    this.hoveredDate = null;
    this.hoverPopup.visible = false;
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

  calculateVisibleCells(timescale: 'Day' | 'Week' | 'Month') {
    const today = new Date();

    const start = new Date(today);
    const end = new Date(today);

    if (timescale === 'Day') {
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() + 14);
    }

    if (timescale === 'Week') {
      start.setDate(start.getDate() - 56);
      end.setDate(end.getDate() + 56);
    }

    if (timescale === 'Month') {
      start.setMonth(start.getMonth() - 6);
      end.setMonth(end.getMonth() + 6);
    }

    const cells = [];
    const current = new Date(start);

    while (current <= end) {
      if (timescale === 'Day') {
        cells.push({
          date: new Date(current),
          label: current.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        });
        current.setDate(current.getDate() + 1);
      }

      if (timescale === 'Week') {
        const weekLabel = `Week ${this.getWeekNumber(current)}`;
        cells.push({
          date: new Date(current),
          label: weekLabel
        });
        current.setDate(current.getDate() + 7);
      }

      if (timescale === 'Month') {
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
    if (this.timescale === 'Day') return 150;
    if (this.timescale === 'Week') return 150;
    if (this.timescale === 'Month') return 150;
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
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  getTodayIndex() {
  const today = new Date();
  return this.visibleCells.findIndex(c =>
    c.date.getFullYear() === today.getFullYear() &&
    c.date.getMonth() === today.getMonth() &&
    c.date.getDate() === today.getDate()
    );
  }

  scrollToToday() {
    if (!this.scrollContainer) return;

    const index = this.getTodayIndex();
    if (index === -1) return;

    const cellWidth = this.getCellWidth();
    const scrollPos = index * cellWidth - (this.scrollContainer.nativeElement.clientWidth / 2) + (cellWidth / 2);

    this.scrollContainer.nativeElement.scrollTo({
      left: scrollPos,
      behavior: 'smooth'
    });
  }

}
