import React from 'react';
import { InvoiceTemplateProps } from './types';

export const ClassicTemplate: React.FC<InvoiceTemplateProps> = (props) => {
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
    <div className="classic-template invoice-template p-4">
      {showHeaderText && headerText && (
        <div className="header-text mb-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
          {headerText}
        </div>
      )}

      <div className="d-flex justify-content-between mb-4">
        <div>
          <h2 className="mb-4">FACTURA</h2>
          <div>
            <strong>Número:</strong> {invoiceData.series}-{invoiceData.number}<br />
            <strong>Fecha:</strong> {invoiceData.issueDate}<br />
            {invoiceData.operationDate && (
              <><strong>Fecha operación:</strong> {invoiceData.operationDate}<br /></>
            )}
            <strong>Vencimiento:</strong> {invoiceData.dueDate}
          </div>
        </div>
        <div className="text-end">
          <h3>{company.name}</h3>
          <p className="mb-0">
            {company.address}<br />
            {company.city}, {company.province}<br />
            {company.zipCode}<br />
            NIF: {company.nif}<br />
            {company.email}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4>CLIENTE</h4>
        <p className="mb-0">
          {customer.name}<br />
          {customer.address}<br />
          {customer.city}, {customer.province}<br />
          {customer.zipCode}<br />
          NIF: {customer.nif}<br />
          {customer.email}
        </p>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Descripción</th>
            <th className="text-end">Cantidad</th>
            <th className="text-end">Precio</th>
            <th className="text-end">IVA</th>
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const subtotal = item.quantity * item.price;
            const tax = subtotal * (item.tax / 100);
            const total = subtotal + tax;

            return (
              <tr key={item.id}>
                <td>{item.concept}</td>
                <td>{item.description}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{item.price.toFixed(2)} €</td>
                <td className="text-end">{item.tax}%</td>
                <td className="text-end">{total.toFixed(2)} €</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="row justify-content-end">
        <div className="col-md-4">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Base imponible</th>
                <td className="text-end">{calculateSubtotal().toFixed(2)} €</td>
              </tr>
              <tr>
                <th>IVA</th>
                <td className="text-end">{calculateTaxes().toFixed(2)} €</td>
              </tr>
              {showGlobalDiscount && (
                <tr>
                  <th>Descuento global</th>
                  <td className="text-end">
                    {(globalDiscount ?? 0).toFixed(2)} €
                  </td>
                </tr>
              )}
              <tr>
                <th>Total</th>
                <td className="text-end"><strong>{calculateTotal().toFixed(2)} €</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showFooterText && footerText && (
        <div className="footer-text mt-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
          {footerText}
        </div>
      )}
    </div>
  );
};
