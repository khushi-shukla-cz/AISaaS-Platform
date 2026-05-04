export interface ShopifyProduct {
  id: string;
  title: string;
  price: number;
  inventory: number;
}

export interface ShopifyOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
}

export class IntegrationService {
  static async getShopifyProducts(): Promise<ShopifyProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 'prod_1', title: 'Premium Headphones', price: 299.99, inventory: 45 },
      { id: 'prod_2', title: 'Wireless Mouse', price: 79.99, inventory: 120 },
      { id: 'prod_3', title: 'Mechanical Keyboard', price: 149.99, inventory: 33 },
      { id: 'prod_4', title: '4K Monitor', price: 599.99, inventory: 8 },
      { id: 'prod_5', title: 'USB-C Hub', price: 49.99, inventory: 200 },
    ];
  }

  static async getShopifyOrders(): Promise<ShopifyOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 'order_1', customerName: 'John Smith', total: 379.98, status: 'completed' },
      { id: 'order_2', customerName: 'Sarah Johnson', total: 599.99, status: 'processing' },
      { id: 'order_3', customerName: 'Mike Davis', total: 149.99, status: 'shipped' },
      { id: 'order_4', customerName: 'Emily Brown', total: 829.97, status: 'completed' },
    ];
  }

  static async getCRMLeads(): Promise<CRMLead[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 'lead_1', name: 'Acme Corp', email: 'contact@acme.com', status: 'qualified' },
      { id: 'lead_2', name: 'TechStart Inc', email: 'info@techstart.io', status: 'new' },
      { id: 'lead_3', name: 'Global Solutions', email: 'sales@globalsol.com', status: 'contacted' },
      { id: 'lead_4', name: 'Innovation Labs', email: 'hello@innovlabs.com', status: 'converted' },
    ];
  }

  static async getCRMCustomers(): Promise<CRMCustomer[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 'cust_1', name: 'Enterprise Co', email: 'billing@enterprise.com', totalSpent: 45000 },
      { id: 'cust_2', name: 'Startup XYZ', email: 'admin@startupxyz.com', totalSpent: 12000 },
      { id: 'cust_3', name: 'MegaCorp', email: 'accounts@megacorp.com', totalSpent: 78000 },
    ];
  }
}
