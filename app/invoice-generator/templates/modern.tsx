import React from 'react';
import { InvoiceTemplateProps } from './types';

export const ModernTemplate: React.FC<InvoiceTemplateProps> = ({
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
}) => {
  return (
    <div className="modern-template invoice-template p-2" style={{ background: '#f8f9fa' }}>
      {showHeaderText && headerText && (
        <div className="header-text mb-5 text-muted" style={{ whiteSpace: 'pre-line', borderLeft: '4px solid #007bff', paddingLeft: '1rem' }}>
          {headerText}
        </div>
      )}

      <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="text-start">
            <h1 className="display-6 mb-4" style={{ color: '#007bff' }}>FACTURA</h1>
            <div className="p-3 bg-light rounded-3">
              <div className="mb-2">
                <span className="text-muted">Nº Factura:</span>
                <span className="ms-2 fw-bold">{invoiceData.series}-{invoiceData.number}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted">Fecha emisión:</span>
                <span className="ms-2">{invoiceData.issueDate}</span>
              </div>
              {invoiceData.operationDate && (
                <div className="mb-2">
                  <span className="text-muted">Fecha operación:</span>
                  <span className="ms-2">{invoiceData.operationDate}</span>
                </div>
              )}
              <div>
                <span className="text-muted">Vencimiento:</span>
                <span className="ms-2">{invoiceData.dueDate}</span>
              </div>
            </div>
          </div>
          <div className="text-end" style={{ maxWidth: '40%' }}>
            <h3 className="mb-3">{company.name}</h3>
            <div className="text-muted">
              {company.address}<br />
              {company.city}, {company.province}<br />
              {company.zipCode}<br />
              <span className="text-dark">NIF: {company.nif}</span><br />
              <a href={`mailto:${company.email}`} className="text-primary text-decoration-none">{company.email}</a>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-light rounded-3">
          <h4 className="mb-3" style={{ color: '#007bff' }}>DATOS DEL CLIENTE</h4>
          <div className="row">
            <div className="col-md-6">
              <strong className="d-block mb-2">{customer.name}</strong>
              <div className="text-muted">
                {customer.address}<br />
                {customer.city}, {customer.province}<br />
                {customer.zipCode}
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="text-muted">
                <strong className="text-dark">NIF: {customer.nif}</strong><br />
                <a href={`mailto:${customer.email}`} className="text-primary text-decoration-none">{customer.email}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
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
                    <td className="fw-bold">{item.concept}</td>
                    <td className="text-muted">{item.description}</td>
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
        </div>

        <div className="row justify-content-end mt-4">
          <div className="col-md-5">
            <div className="bg-light p-3 rounded-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Base imponible:</span>
                <span className="fw-bold">{calculations.subtotalWithoutDiscount.toFixed(2)}€</span>
              </div>

              {calculations.productDiscountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Descuento por líneas:</span>
                  <span className="text-danger">-{calculations.productDiscountAmount.toFixed(2)}€</span>
                </div>
              )}

              {showGlobalDiscount && calculations.globalDiscountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Descuento global:</span>
                  <span className="text-danger">-{calculations.globalDiscountAmount.toFixed(2)}€</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-bold">{calculations.subtotal.toFixed(2)}€</span>
              </div>

              {Object.entries(calculations.taxBreakdown).map(([rate, tax]) => (
                <div key={rate} className="d-flex justify-content-between mb-2">
                  <span className="text-muted">IVA ({rate}%):</span>
                  <span className="fw-bold">{tax.amount.toFixed(2)}€</span>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <span className="h5 mb-0">Total:</span>
                <span className="h5 mb-0 text-primary">{calculations.total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFooterText && footerText && (
        <div className="footer-text mt-4 text-muted" style={{ whiteSpace: 'pre-line', borderLeft: '4px solid #007bff', paddingLeft: '1rem' }}>
          {footerText}
        </div>
      )}
    </div>
  );
};
