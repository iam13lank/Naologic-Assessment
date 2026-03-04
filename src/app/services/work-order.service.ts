import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkOrderDocument,WorkOrderStatus} from '../models/work-order.model';
import { WORK_ORDERS } from '../data/work-orders';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private ordersSubject = new BehaviorSubject<WorkOrderDocument[]>(WORK_ORDERS);
  orders$ = this.ordersSubject.asObservable();
  
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
