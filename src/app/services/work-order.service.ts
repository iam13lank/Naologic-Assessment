import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkOrderDocument } from '../models/work-order.model';
import { WORK_ORDERS } from '../data/work-orders';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  private readonly STORAGE_KEY = 'workOrders';

  private ordersSubject = new BehaviorSubject<WorkOrderDocument[]>(this.loadInitial());
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.orders$.subscribe(list => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    });
  }

  private loadInitial(): WorkOrderDocument[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [...WORK_ORDERS];
      }
    }
    return [...WORK_ORDERS];
  }

  getAll(): WorkOrderDocument[] {
    return this.ordersSubject.value;
  }

  create(order: WorkOrderDocument) {
    const updated = [...this.ordersSubject.value, order];
    this.ordersSubject.next(updated);
  }

  update(order: WorkOrderDocument) {
    const updated = this.ordersSubject.value.map(o =>
      o.docId === order.docId ? order : o
    );
    this.ordersSubject.next(updated);
  }

  delete(docId: string) {
    const updated = this.ordersSubject.value.filter(o => o.docId !== docId);
    this.ordersSubject.next(updated);
  }
}
