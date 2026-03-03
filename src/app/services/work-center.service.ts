import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WorkCenterDocument } from '../models/work-center.model';
import { WORK_CENTERS } from '../data/work-centers';

@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {
  private centersSubject = new BehaviorSubject<WorkCenterDocument[]>(WORK_CENTERS);
  centers$ = this.centersSubject.asObservable();

  getAll(): WorkCenterDocument[] {
    return this.centersSubject.value;
  }
}