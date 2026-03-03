import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges} from '@angular/core';
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
    @Input() timescale: 'day' | 'week' | 'month' = 'day';
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

      const startIndex = this.findCellIndex(start);
      const endIndex = this.findCellIndex(end);

      if (startIndex === -1 || endIndex === -1) return {};

      const cellWidth = this.getCellWidth();

      const left = startIndex * cellWidth;
      const width = (endIndex - startIndex + 1) * cellWidth;

      return {
        left: left + 'px',
        width: width + 'px',
        background: this.getStatusColor(order.data.status)
      };
    }
    findCellIndex(date: Date): number {
      return this.visibleCells.findIndex((c: { date: { toDateString: () => string; }; }) =>
        c.date.toDateString() === date.toDateString()
      );
    }

    getCellWidth() {
      if (this.timescale === 'day') return 60;
      if (this.timescale === 'week') return 100;
      if (this.timescale === 'month') return 160;
      return 80;
    }
    getStatusColor(status: string) {
      switch (status) {
        case 'open': return '#4a90e2';
        case 'in-progress': return '#007bff';
        case 'complete': return '#2ecc71';
        case 'blocked': return '#e67e22';
        default: return '#888';
      }
    }
    getWorkorderByCenterId(centerId: string) {
        return this.workOrderService.getAll().filter((wo) => wo.data.workCenterId === centerId); 
    }

}