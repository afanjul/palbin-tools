import React from 'react';
import { InvoiceTemplateProps } from './types';
import Image from 'next/image';

export const ClassicTemplate: React.FC<InvoiceTemplateProps> = ({
  invoiceData,
  company,
  customer,
  items,
  calculations,
  showLineDiscounts,
  showGlobalDiscount,
  headerText,
  showHeaderText,
  footerText,
  showFooterText,
  companyLogo,
}) => {
  return (
    <div className="classic-template invoice-template p-4">
      {showHeaderText && headerText && (
        <div className="header-text mb-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
          {headerText}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-start mb-5">
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
          {companyLogo && (
            <div className="mb-3">
              <Image 
                src={companyLogo} 
                alt={`Logo de ${company.name}`} 
                width={200}
                height={80}
                style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain' }} 
              />
            </div>
          )}
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

      <table className="table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Descripción</th>
            <th className="text-end">Cantidad</th>
            <th className="text-end">Precio</th>
            <th className="text-end">IVA</th>
            {showLineDiscounts && <th className="text-end">Dto.</th>}
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const lineSubtotal = item.quantity * item.price;
            const lineDiscount = lineSubtotal * (item.discount / 100);
            const lineTaxableAmount = lineSubtotal - lineDiscount;
            const lineTaxAmount = lineTaxableAmount * (item.taxAmount / 100);
            const lineTotal = lineTaxableAmount + lineTaxAmount;

            return (
              <tr key={item.id}>
                <td>{item.concept}</td>
                <td>{item.description}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{item.price.toFixed(2)}€</td>
                <td className="text-end">{item.taxAmount}%</td>
                {showLineDiscounts && (
                  <td className="text-end">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                )}
                <td className="text-end">{lineTotal.toFixed(2)}€</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="row justify-content-end">
        <div className="col-md-6">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Base imponible:</th>
                <td className="text-end">{calculations.subtotalWithoutDiscount.toFixed(2)}€</td>
              </tr>
              {calculations.productDiscountAmount > 0 && (
                <tr>
                  <th>Descuento por líneas:</th>
                  <td className="text-end">-{calculations.productDiscountAmount.toFixed(2)}€</td>
                </tr>
              )}
              {showGlobalDiscount && calculations.globalDiscountAmount > 0 && (
                <tr>
                  <th>Descuento global:</th>
                  <td className="text-end">-{calculations.globalDiscountAmount.toFixed(2)}€</td>
                </tr>
              )}
              <tr>
                <th>Subtotal:</th>
                <td className="text-end">{calculations.subtotal.toFixed(2)}€</td>
              </tr>
              {Object.entries(calculations.taxBreakdown).map(([rate, tax]) => (
                <tr key={rate}>
                  <th>IVA ({rate}%):</th>
                  <td className="text-end">{tax.amount.toFixed(2)}€</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <th>Total:</th>
                <td className="text-end">{calculations.total.toFixed(2)}€</td>
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
