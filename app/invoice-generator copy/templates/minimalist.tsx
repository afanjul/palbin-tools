import React from 'react';
import { InvoiceTemplateProps } from './types';

export const MinimalistTemplate: React.FC<InvoiceTemplateProps> = (props) => {
  const {
    invoiceData,
    company,
    customer,
    items,
    showGlobalDiscount,
    globalDiscount,
    showHeaderText,
    headerText,
    showFooterText,
    footerText
  } = props;

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const lineSubtotal = item.quantity * item.price;
      const lineDiscount = lineSubtotal * (item.discount / 100);
      return acc + (lineSubtotal - lineDiscount);
    }, 0);
  };

  const calculateTaxes = () => {
    return items.reduce((acc, item) => {
      const lineSubtotal = item.quantity * item.price;
      const lineDiscount = lineSubtotal * (item.discount / 100);
      const baseTaxable = lineSubtotal - lineDiscount;
      return acc + (baseTaxable * (item.tax / 100));
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxes = calculateTaxes();
    let total = subtotal + taxes;
    
    if (showGlobalDiscount) {
      total = total * (1 - (globalDiscount ?? 0) / 100);
    }
    
    return total;
  };

  return (
    <div className="minimalist-template invoice-template p-8 font-light">
      {showHeaderText && headerText && (
        <div className="header-text mb-6 text-gray-500" style={{ whiteSpace: 'pre-line' }}>
          {headerText}
        </div>
      )}

      <div className="flex justify-between items-start mb-12">
        <div className="company-info">
          <h1 className="text-3xl font-thin mb-6">INVOICE</h1>
          <div className="text-sm">
            <p className="font-medium">{company.name}</p>
            <p>{company.nif}</p>
            <p>{company.address}</p>
            <p>{company.city}, {company.province} {company.zipCode}</p>
            <p>{company.countryCode}</p>
          </div>
        </div>
        <div className="invoice-info text-right">
          <p className="text-xl mb-2">#{invoiceData.series}-{invoiceData.number}</p>
          <p className="text-sm text-gray-600">Issue Date: {invoiceData.issueDate}</p>
          <p className="text-sm text-gray-600">Due Date: {invoiceData.dueDate}</p>
        </div>
      </div>

      <div className="customer-info mb-12">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Bill To:</p>
        <div className="text-sm">
          <p className="font-medium">{customer.name}</p>
          <p>{customer.nif}</p>
          <p>{customer.address}</p>
          <p>{customer.city}, {customer.province} {customer.zipCode}</p>
          <p>{customer.countryCode}</p>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b text-left text-sm">
            <th className="pb-2">Item</th>
            <th className="pb-2">Quantity</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Tax</th>
            <th className="pb-2">Discount</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const subtotal = item.quantity * item.price;
            const discount = subtotal * (item.discount / 100);
            const total = subtotal - discount;
            return (
              <tr key={item.id} className="text-sm">
                <td className="py-3">{item.concept}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3">{item.price.toFixed(2)}€</td>
                <td className="py-3">{item.tax}%</td>
                <td className="py-3">{item.discount}%</td>
                <td className="py-3 text-right">{total.toFixed(2)}€</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal:</span>
            <span>{calculateSubtotal().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Taxes:</span>
            <span>{calculateTaxes().toFixed(2)}€</span>
          </div>
          {showGlobalDiscount && (
            <div className="flex justify-between text-sm mb-2">
              <span>Global Discount ({globalDiscount}%):</span>
              <span>-{(calculateSubtotal() * (globalDiscount ?? 0) / 100).toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-lg pt-2 border-t">
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {showFooterText && footerText && (
        <div className="footer-text mt-12 pt-6 border-t text-sm text-gray-500" style={{ whiteSpace: 'pre-line' }}>
          {footerText}
        </div>
      )}
    </div>
  );
};
