import React from 'react';
import { InvoiceTemplateProps } from './types';

export const ModernTemplate: React.FC<InvoiceTemplateProps> = (props) => {
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
    <div className="modern-template invoice-template bg-white">
      <div className="bg-blue-600 text-white p-8">
        {showHeaderText && headerText && (
          <div className="header-text mb-6 text-blue-100" style={{ whiteSpace: 'pre-line' }}>
            {headerText}
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="company-info">
            <h1 className="text-4xl font-bold mb-6">INVOICE</h1>
            <div>
              <p className="text-xl font-semibold">{company.name}</p>
              <p className="text-blue-100">{company.nif}</p>
              <p className="text-blue-100">{company.address}</p>
              <p className="text-blue-100">{company.city}, {company.province} {company.zipCode}</p>
              <p className="text-blue-100">{company.countryCode}</p>
            </div>
          </div>
          <div className="invoice-info text-right">
            <div className="bg-blue-700 p-4 rounded-lg inline-block">
              <p className="text-2xl font-bold mb-2">#{invoiceData.series}-{invoiceData.number}</p>
              <p className="text-blue-100">Issue Date: {invoiceData.issueDate}</p>
              <p className="text-blue-100">Due Date: {invoiceData.dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="customer-info mb-12 bg-gray-50 p-6 rounded-lg">
          <p className="text-sm uppercase tracking-wider text-gray-600 mb-3">Bill To:</p>
          <div>
            <p className="text-xl font-semibold">{customer.name}</p>
            <p className="text-gray-600">{customer.nif}</p>
            <p className="text-gray-600">{customer.address}</p>
            <p className="text-gray-600">{customer.city}, {customer.province} {customer.zipCode}</p>
            <p className="text-gray-600">{customer.countryCode}</p>
          </div>
        </div>

        <div className="mb-12 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-4 rounded-l-lg">Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Price</th>
                <th className="p-4">Tax</th>
                <th className="p-4">Discount</th>
                <th className="p-4 rounded-r-lg text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const subtotal = item.quantity * item.price;
                const discount = subtotal * (item.discount / 100);
                const total = subtotal - discount;
                return (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50/50' : ''}>
                    <td className="p-4">{item.concept}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{item.price.toFixed(2)}€</td>
                    <td className="p-4">{item.tax}%</td>
                    <td className="p-4">{item.discount}%</td>
                    <td className="p-4 text-right font-medium">{total.toFixed(2)}€</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-1/3 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{calculateSubtotal().toFixed(2)}€</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Taxes:</span>
              <span className="font-medium">{calculateTaxes().toFixed(2)}€</span>
            </div>
            {showGlobalDiscount && (
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Global Discount ({globalDiscount}%):</span>
                <span className="font-medium text-red-600">
                  -{(calculateSubtotal() * (globalDiscount ?? 0) / 100).toFixed(2)}€
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-xl font-bold text-blue-600">{calculateTotal().toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {showFooterText && footerText && (
          <div className="footer-text mt-12 pt-6 border-t text-gray-600" style={{ whiteSpace: 'pre-line' }}>
            {footerText}
          </div>
        )}
      </div>
    </div>
  );
};
