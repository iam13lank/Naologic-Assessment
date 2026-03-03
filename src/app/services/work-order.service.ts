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
  
  getworkOrdersByStatus(status: WorkOrderStatus): WorkOrderDocument[] {
    return this.ordersSubject.value.filter(order => order.data.status === status);
  }



  getAll(): WorkOrderDocument[] {
    return this.ordersSubject.value;
  }
}