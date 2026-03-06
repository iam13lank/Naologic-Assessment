import { WorkOrderDocument } from '../models/work-order.model';

export const WORK_ORDERS: WorkOrderDocument[] = [
  // -------------------------
  // WORK CENTER wc-1
  // -------------------------
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Sysco Foods Distribution Prep',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2025-06-10',
      endDate: '2025-06-15'
    }
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'C.H. Robinson Freight Consolidation',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2025-06-16',
      endDate: '2025-06-30'
    }
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'FedEx Ground Routing Prep',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2025-07-01',
      endDate: '2025-07-12'
    }
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'PepsiCo Beverage Loadout',
      workCenterId: 'wc-1',
      status: 'blocked',
      startDate: '2026-02-01',
      endDate: '2026-02-10'
    }
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Lowe’s Distribution Outbound Prep',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2026-02-11',
      endDate: '2026-02-20'
    }
  },

  // -------------------------
  // WORK CENTER wc-2
  // -------------------------
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'McKesson Pharma Repack',
      workCenterId: 'wc-2',
      status: 'complete',
      startDate: '2025-08-01',
      endDate: '2025-08-10'
    }
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'UPS Freight Dock Staging',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: '2025-12-20',
      endDate: '2026-01-05'
    }
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Coca-Cola Bottlers Shipment Prep',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2026-02-05',
      endDate: '2026-02-12'
    }
  },
  {
    docId: 'wo-9',
    docType: 'workOrder',
    data: {
      name: 'Best Buy Regional Sorting',
      workCenterId: 'wc-2',
      status: 'blocked',
      startDate: '2026-02-13',
      endDate: '2026-03-01'
    }
  },
  {
    docId: 'wo-10',
    docType: 'workOrder',
    data: {
      name: 'Procter & Gamble Outbound Wave',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2026-03-05',
      endDate: '2026-03-12'
    }
  },

  // -------------------------
  // WORK CENTER wc-3
  // -------------------------
  {
    docId: 'wo-11',
    docType: 'workOrder',
    data: {
      name: 'Cardinal Health Cold Chain Prep',
      workCenterId: 'wc-3',
      status: 'blocked',
      startDate: '2025-09-01',
      endDate: '2025-09-20'
    }
  },
  {
    docId: 'wo-12',
    docType: 'workOrder',
    data: {
      name: 'Ryder Logistics Inventory Audit',
      workCenterId: 'wc-3',
      status: 'complete',
      startDate: '2026-01-05',
      endDate: '2026-01-12'
    }
  },
  {
    docId: 'wo-13',
    docType: 'workOrder',
    data: {
      name: 'Kroger Distribution Slotting',
      workCenterId: 'wc-3',
      status: 'complete',
      startDate: '2026-02-01',
      endDate: '2026-02-07'
    }
  },
  {
    docId: 'wo-14',
    docType: 'workOrder',
    data: {
      name: 'Walgreens Distribution Cycle',
      workCenterId: 'wc-3',
      status: 'open',
      startDate: '2026-02-08',
      endDate: '2026-02-15'
    }
  },
  {
    docId: 'wo-15',
    docType: 'workOrder',
    data: {
      name: 'Unilever Distribution Batch 12',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2026-03-01',
      endDate: '2026-03-20'
    }
  },

  // -------------------------
  // WORK CENTER wc-4
  // -------------------------
  {
    docId: 'wo-16',
    docType: 'workOrder',
    data: {
      name: 'Amazon Fulfillment Batch 42',
      workCenterId: 'wc-4',
      status: 'open',
      startDate: '2025-10-01',
      endDate: '2025-10-05'
    }
  },
  {
    docId: 'wo-17',
    docType: 'workOrder',
    data: {
      name: 'Walmart Distribution Cycle Count',
      workCenterId: 'wc-4',
      status: 'complete',
      startDate: '2025-10-06',
      endDate: '2025-10-15'
    }
  },
  {
    docId: 'wo-18',
    docType: 'workOrder',
    data: {
      name: 'XPO Logistics Cross-Dock',
      workCenterId: 'wc-4',
      status: 'open',
      startDate: '2026-01-10',
      endDate: '2026-01-20'
    }
  },
  {
    docId: 'wo-19',
    docType: 'workOrder',
    data: {
      name: 'Albertsons Warehouse Replenishment',
      workCenterId: 'wc-4',
      status: 'in-progress',
      startDate: '2026-02-01',
      endDate: '2026-02-15'
    }
  },
  {
    docId: 'wo-20',
    docType: 'workOrder',
    data: {
      name: 'CVS Health Warehouse Prep',
      workCenterId: 'wc-4',
      status: 'in-progress',
      startDate: '2026-02-16',
      endDate: '2026-03-05'
    }
  },

  // -------------------------
  // WORK CENTER wc-5
  // -------------------------
  {
    docId: 'wo-21',
    docType: 'workOrder',
    data: {
      name: 'Target Regional Sorting',
      workCenterId: 'wc-5',
      status: 'in-progress',
      startDate: '2025-11-01',
      endDate: '2025-11-18'
    }
  },
  {
    docId: 'wo-22',
    docType: 'workOrder',
    data: {
      name: 'Costco Wholesale Pallet Build',
      workCenterId: 'wc-5',
      status: 'blocked',
      startDate: '2025-11-19',
      endDate: '2025-12-05'
    }
  },
  {
    docId: 'wo-23',
    docType: 'workOrder',
    data: {
      name: 'DHL Supply Chain Pick Wave 7',
      workCenterId: 'wc-5',
      status: 'in-progress',
      startDate: '2026-01-20',
      endDate: '2026-02-02'
    }
  },
  {
    docId: 'wo-24',
    docType: 'workOrder',
    data: {
      name: 'Home Depot Freight Consolidation',
      workCenterId: 'wc-5',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-12'
    }
  },
  {
    docId: 'wo-25',
    docType: 'workOrder',
    data: {
      name: 'Nestlé Distribution Load Plan',
      workCenterId: 'wc-5',
      status: 'complete',
      startDate: '2026-02-13',
      endDate: '2026-02-20'
    }
  }
];
