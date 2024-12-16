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
    tax: number;
    discount: number;
  }>;
  showGlobalDiscount?: boolean;
  globalDiscount?: number;
  headerText?: string;
  showHeaderText?: boolean;
  footerText?: string;
  showFooterText?: boolean;
}
