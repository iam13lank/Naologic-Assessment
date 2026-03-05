import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderDocument } from '../../models/work-order.model';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-order-bar.component.html',
  styleUrls: ['./work-order-bar.component.scss']
})
export class WorkOrderBarComponent {

  @Input() order!: WorkOrderDocument;
  @Input() visibleCells!: { date: Date; label: string }[];
  @Input() timescale!: 'day' | 'week' | 'month';

  @Output() edit = new EventEmitter<WorkOrderDocument>();
  @Output() delete = new EventEmitter<WorkOrderDocument>();

  menuOpen = false;

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = false;
    this.edit.emit(this.order);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = false;
    this.delete.emit(this.order);
  }
  getBarStyle() {
    const start = new Date(this.order.data.startDate);
    const end = new Date(this.order.data.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    let startIndex = this.findCellIndex(start);
    let endIndex = this.findCellIndex(end);

    const maxIndex = this.visibleCells.length - 1;
    if (startIndex === -1 && endIndex === -1) {
      return {display:'none'}
    }
    if (startIndex === -1 && start < this.visibleCells[0].date) {
      startIndex = 0;
    }

    if (endIndex === -1 && end > this.visibleCells[maxIndex].date) {
      endIndex = maxIndex;
    }

    if (startIndex === -1 || endIndex === -1) return {};

    const cellWidth = this.getCellWidth();

    return {
      left: `${startIndex * cellWidth}px`,
      width: `${(endIndex - startIndex + 1) * cellWidth}px`,
      '--bar-bg': this.getStatusBackground(this.order.data.status),
      '--bar-color': this.getStatusColor(this.order.data.status),
      display: 'flex'
    };
  }
  findCellIndex(date: Date): number {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (this.timescale === 'day') {
      return this.visibleCells.findIndex(c => {
        const d = new Date(c.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === target.getTime();
      });
    }

    if (this.timescale === 'week') {
      const targetWeek = this.getWeekNumber(target);
      const targetYear = target.getFullYear();

      return this.visibleCells.findIndex(c => {
        const d = new Date(c.date);
        const week = this.getWeekNumber(d);
        return week === targetWeek && d.getFullYear() === targetYear;
      });
    }

    if (this.timescale === 'month') {
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
  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
  }
   // -------------------------------
  // STATUS COLORS
  // -------------------------------

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.workorder-bar');
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }

}
