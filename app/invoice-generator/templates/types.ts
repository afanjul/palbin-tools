export interface TaxBreakdown {
  [key: string]: {
    base: number;
    amount: number;
  };
}

export interface InvoiceData {
  series: string;
  number: string;
  issueDate: string;
  operationDate: string;
  dueDate: string;
  dueDays: number;
}

export interface Address {
  name: string;
  nif: string;
  email: string;
  address: string;
  city: string;
  province: string;
  countryCode: string;
  zipCode: string;
}

export interface InvoiceCalculations {
  subtotalWithoutDiscount: number;
  productDiscountAmount: number;
  globalDiscountAmount: number;
  subtotal: number;
  taxBreakdown: TaxBreakdown;
  totalTaxes: number;
  total: number;
}

export interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
  company: Address;
  customer: Address;
  items: Array<{
    id: number;
    concept: string;
    description: string;
    quantity: number;
    price: number;
    taxAmount: number;
    discount: number;
  }>;
  calculations: InvoiceCalculations;
  showLineDiscounts: boolean;
  showGlobalDiscount: boolean;
  headerText?: string;
  showHeaderText?: boolean;
  footerText?: string;
  showFooterText?: boolean;
  companyLogo?: string | null;
}
