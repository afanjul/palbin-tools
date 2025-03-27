import React from 'react';
import { InvoiceTemplateProps } from './types';
import Image from 'next/image';

export const MinimalistTemplate: React.FC<InvoiceTemplateProps> = ({
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
          {companyLogo && (
            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
              <Image 
                src={companyLogo} 
                alt={`Logo de ${company.name}`} 
                width={180}
                height={60}
                style={{ 
                  maxHeight: '60px', 
                  maxWidth: '180px',
                  display: 'inline-block',
                  objectFit: 'contain'
                }} 
              />
            </div>
          )}
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
              }}>Cantidad</th>
              <th style={{ 
                textAlign: 'left',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>Precio</th>
              <th style={{ 
                textAlign: 'left',
                padding: '0.75rem 0',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6B7280'
              }}>IVA</th>
              {showLineDiscounts && (
                <th style={{ 
                  textAlign: 'left',
                  padding: '0.75rem 0',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B7280'
                }}>Descuento</th>
              )}
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
              const lineSubtotal = item.quantity * item.price;
              const lineDiscount = lineSubtotal * (item.discount / 100);
              const lineTaxableAmount = lineSubtotal - lineDiscount;
              const lineTaxAmount = lineTaxableAmount * (item.taxAmount / 100);
              const lineTotal = lineTaxableAmount + lineTaxAmount;

              return (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50/50' : ''}>
                  <td className="p-4">{item.concept}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">{item.price.toFixed(2)}€</td>
                  <td className="p-4">{item.taxAmount}%</td>
                  {showLineDiscounts && (
                    <td className="p-4">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                  )}
                  <td className="p-4 text-right font-medium">{lineTotal.toFixed(2)}€</td>
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
        <div className="flex justify-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: '#6B7280' }}>Base imponible:</span>
          <span style={{ fontWeight: 500 }}>{calculations.subtotalWithoutDiscount.toFixed(2)}€</span>
        </div>

        {calculations.productDiscountAmount > 0 && (
          <div className="flex justify-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6B7280' }}>Descuento por líneas:</span>
            <span style={{ fontWeight: 500, color: '#DC2626' }}>
              -{calculations.productDiscountAmount.toFixed(2)}€
            </span>
          </div>
        )}

        {showGlobalDiscount && calculations.globalDiscountAmount > 0 && (
          <div className="flex justify-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6B7280' }}>Descuento global:</span>
            <span style={{ fontWeight: 500, color: '#DC2626' }}>
              -{calculations.globalDiscountAmount.toFixed(2)}€
            </span>
          </div>
        )}

        <div className="flex justify-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: '#6B7280' }}>Subtotal:</span>
          <span style={{ fontWeight: 500 }}>{calculations.subtotal.toFixed(2)}€</span>
        </div>

        {Object.entries(calculations.taxBreakdown).map(([rate, tax]) => (
          <div key={rate} className="flex justify-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#6B7280' }}>IVA ({rate}%):</span>
            <span style={{ fontWeight: 500 }}>{tax.amount.toFixed(2)}€</span>
          </div>
        ))}

        <div className="flex justify-between pt-3" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          paddingTop: '0.75rem',
          borderTop: '1px solid #E5E7EB'
        }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563EB' }}>
            {calculations.total.toFixed(2)}€
          </span>
        </div>
      </div>

      {showFooterText && footerText && (
        <div className="footer-text mt-5" style={{ 
          whiteSpace: 'pre-line',
          color: '#6B7280',
          fontSize: '0.875rem'
        }}>
          {footerText}
        </div>
      )}
    </div>
  );
};
