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
    let total = subtotal;
    
    if (showGlobalDiscount && typeof globalDiscount === 'number') {
      total = total - globalDiscount;
    }
    
    total += taxes;
    return total;
  };

  return (
    <div className="minimalist-template invoice-template py-5" style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {showHeaderText && headerText && (
        <div className="header-text mb-5" style={{ 
          whiteSpace: 'pre-line',
          color: '#6B7280',
          fontSize: '0.875rem'
        }}>
          {headerText}
        </div>
      )}

      <div className="mb-5 d-flex justify-content-between align-items-start">
        <div>
          <div className="mb-4" style={{ color: '#111827' }}>
            <span style={{ 
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#6B7280'
            }}>Factura Nº</span>
            <div className="mt-1" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              {invoiceData.series}-{invoiceData.number}
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            <div className="mb-1">Emisión: {invoiceData.issueDate}</div>
            {invoiceData.operationDate && (
              <div className="mb-1">Operación: {invoiceData.operationDate}</div>
            )}
            <div>Vencimiento: {invoiceData.dueDate}</div>
          </div>
        </div>

        <div style={{ textAlign: 'right', color: '#111827' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {company.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {company.address}<br />
            {company.city}, {company.province}<br />
            {company.zipCode}<br />
            <span style={{ color: '#111827' }}>NIF: {company.nif}</span>
          </div>
        </div>
      </div>

      <div className="mb-5" style={{ 
        padding: '1.5rem',
        background: '#F9FAFB',
        borderRadius: '0.375rem'
      }}>
        <div style={{ 
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#6B7280',
          marginBottom: '0.75rem'
        }}>Cliente</div>
        
        <div className="row">
          <div className="col-md-6">
            <div style={{ fontSize: '1rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>
              {customer.name}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              {customer.address}<br />
              {customer.city}, {customer.province}<br />
              {customer.zipCode}
            </div>
          </div>
          <div className="col-md-6" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              <div style={{ color: '#111827', marginBottom: '0.25rem' }}>NIF: {customer.nif}</div>
              {customer.email}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <table className="w-100" style={{ borderSpacing: '0', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ 
                textAlign: 'left',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>Concepto</th>
              <th style={{ 
                textAlign: 'left',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>Descripción</th>
              <th style={{ 
                textAlign: 'right',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>Cantidad</th>
              <th style={{ 
                textAlign: 'right',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>Precio</th>
              <th style={{ 
                textAlign: 'right',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>IVA</th>
              <th style={{ 
                textAlign: 'right',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const subtotal = item.quantity * item.price;
              const tax = subtotal * (item.tax / 100);
              const total = subtotal + tax;

              return (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white'
                }}>
                  <td style={{ padding: '1rem 0', color: '#111827' }}>{item.concept}</td>
                  <td style={{ padding: '1rem 0', color: '#6B7280', fontSize: '0.875rem' }}>{item.description}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>{item.price.toFixed(2)} €</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>{item.tax}%</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 500 }}>{total.toFixed(2)} €</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ 
        marginLeft: 'auto',
        width: '100%',
        maxWidth: '300px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#6B7280' }}>Base imponible</span>
          <span style={{ color: '#111827' }}>{calculateSubtotal().toFixed(2)} €</span>
        </div>

        {showGlobalDiscount && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: '#6B7280' }}>Descuento global</span>
            <span style={{ color: '#DC2626' }}>-{(globalDiscount ?? 0).toFixed(2)} €</span>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#6B7280' }}>IVA</span>
          <span style={{ color: '#111827' }}>{calculateTaxes().toFixed(2)} €</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '2px solid #E5E7EB',
          fontSize: '1rem',
          fontWeight: 600
        }}>
          <span>Total</span>
          <span>{calculateTotal().toFixed(2)} €</span>
        </div>
      </div>

      {showFooterText && footerText && (
        <div style={{ 
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #E5E7EB',
          color: '#6B7280',
          fontSize: '0.875rem',
          whiteSpace: 'pre-line'
        }}>
          {footerText}
        </div>
      )}
    </div>
  );
};
