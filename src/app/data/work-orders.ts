import { WorkOrderDocument } from '../models/work-order.model';

export const WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Order A',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2026-02-17',
      endDate: '2026-02-20'
    }
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Order B',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2026-02-25',
      endDate: '2026-03-12'
    }
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Order C',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: '2026-02-18',
      endDate: '2026-03-02'
    }
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Order D',
      workCenterId: 'wc-3',
      status: 'blocked',
      startDate: '2026-02-22',
      endDate: '2026-03-01'
    }
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Order E',
      workCenterId: 'wc-4',
      status: 'open',
      startDate: '2026-02-16',
      endDate: '2026-02-18'
    }
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Order F',
      workCenterId: 'wc-4',
      status: 'complete',
      startDate: '2026-02-19',
      endDate: '2026-02-23'
    }
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Order G',
      workCenterId: 'wc-5',
      status: 'in-progress',
      startDate: '2026-02-20',
      endDate: '2026-02-26'
    }
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Order H',
      workCenterId: 'wc-5',
      status: 'blocked',
      startDate: '2026-03-01',
      endDate: '2026-03-10'
    }
  }
];
