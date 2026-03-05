import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';
import { WorkOrderService } from '../../services/work-order.service';
import { WorkCenterService } from '../../services/work-center.service';
import { WorkOrderDocument } from '../../models/work-order.model';
// This component will be responsible for displaying the timeline of work orders and their associated work centers. 
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnChanges {

    menuState: Record<string, boolean> = {};
    toggleMenu(id: string) {
      this.menuState[id] = !this.menuState[id];
    }

    
    @HostListener('document:click')
    closeMenus() {
      this.menuState = {};
    }


    @Input() timescale: 'day' | 'week' | 'month' = 'day';
    @Output() createAtDate = new EventEmitter<{ date: Date; workCenterId: string | null }>();
    @Output() editOrder = new EventEmitter<WorkOrderDocument>();

    visibleCells: { date: Date; label: string }[] = [];
    workCenters: any;
    
    constructor(private workOrderService: WorkOrderService, private workCenterService: WorkCenterService) {}
    ngOnInit() {
        this.workCenters = this.workCenterService.getAll();
        this.visibleCells = this.calculateVisibleCells(this.timescale);

    }
    ngOnChanges() {
      this.visibleCells = this.calculateVisibleCells(this.timescale);
      
    }
    hoveredCellIndex: number | null = null;
    hoveredDate: Date | null = null;
    selectedWorkCenterId: string | null = null;
    onCellHover(cell: { date: Date }, index: number, wc: { docId: string }) {
      this.hoveredCellIndex = index;
      this.hoveredDate = cell.date;
      this.selectedWorkCenterId = wc.docId;
    }

    onCellLeave() {
      this.hoveredCellIndex = null;
      this.hoveredDate = null;
    }

    onCellClick(cell: { date: any }, wc: { docId: any }) {
      this.createAtDate.emit({
        date: cell.date,
        workCenterId: wc.docId
      });
    }


    onBarClick(order: WorkOrderDocument) {
      this.editOrder.emit(order);
    }

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
    getBarStyle(order: WorkOrderDocument) {
      
      const start = new Date(order.data.startDate);
      const end = new Date(order.data.endDate);

      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);

      const startIndex = this.findCellIndex(start);
      const endIndex = this.findCellIndex(end);

      if (startIndex === -1 || endIndex === -1) return {};

      const cellWidth = this.getCellWidth();

      return {
        left: `${startIndex * cellWidth}px`,
        width: `${(endIndex - startIndex + 1) * cellWidth}px`,
        '--bar-bg': this.getStatusBackground(order.data.status),
        '--bar-color': this.getStatusColor(order.data.status)
      };

    }

    findCellIndex(date: Date): number {
      const target = new Date(date);
      target.setHours(0, 0, 0, 0);
      if (this.timescale === 'day') {
        // exact day match
        return this.visibleCells.findIndex(c => {
          const d = new Date(c.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === target.getTime();
        });
      }

      if (this.timescale === 'week') {
        // match by week number + year
        const targetWeek = this.getWeekNumber(target);
        const targetYear = target.getFullYear();

        return this.visibleCells.findIndex(c => {
          const d = new Date(c.date);
          const week = this.getWeekNumber(d);
          return week === targetWeek && d.getFullYear() === targetYear;
        });
      }

      if (this.timescale === 'month') {
        // match by month + year
        const targetMonth = target.getMonth();
        const targetYear = target.getFullYear();

        return this.visibleCells.findIndex(c => {
          const d = new Date(c.date);
          return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
        });
      }

      return -1;
    }
    getCellWidth() {
      if (this.timescale === 'day') return 180;
      if (this.timescale === 'week') return 200;
      if (this.timescale === 'month') return 150;
      return 80;
    }
    getStatusColor(status: string) {
      switch (status) {
        case 'open': return 'rgba(0, 176, 191, 1)';
        case 'in-progress': return 'rgba(62, 64, 219, 1)';
        case 'complete': return 'rgba(8, 162, 104, 1)';
        case 'blocked': return 'rgba(177, 54, 0, 1)';
        default: return 'rgba(136, 136, 136, 1)';
      }
    }
    getStatusBackground(status: string) {
      switch (status) {
        case 'open': return 'rgba(228, 253, 255, 1)';
        case 'in-progress': return 'rgba(214, 216, 255, 1)';
        case 'complete': return 'rgba(225, 255, 204, 1)';
        case 'blocked': return 'rgba(252, 238, 181, 1)';
        default: return 'rgba(136, 136, 136, 1)';
      }
    }

    getWorkorderByCenterId(centerId: string) {
        return this.workOrderService.getAll().filter((wo) => wo.data.workCenterId === centerId); 
    }
    deleteOrder(order: WorkOrderDocument) {
     this.workOrderService.delete(order.docId);
    }
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

      const firstIndex = this.visibleCells.findIndex(c =>
        c.date.getMonth() === month && c.date.getFullYear() === year
      );

      const lastIndex = [...this.visibleCells]
        .reverse()
        .findIndex(c =>
          c.date.getMonth() === month && c.date.getFullYear() === year
        );

      if (firstIndex === -1 || lastIndex === -1) return null;

      const realLastIndex = this.visibleCells.length - 1 - lastIndex;

      return { firstIndex, lastIndex: realLastIndex };
    }
    onMenuEdit(order: WorkOrderDocument, event: MouseEvent) {
      event.stopPropagation();
      this.menuState[order.docId] = false;
      this.onBarClick(order);
    }

    onMenuDelete(order: WorkOrderDocument, event: MouseEvent) {
      event.stopPropagation();
      this.menuState[order.docId] = false;
      this.deleteOrder(order);
    }


}