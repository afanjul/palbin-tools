import React from 'react';
import { ClassicTemplate } from '../templates/classic';
import { ModernTemplate } from '../templates/modern';
import { MinimalistTemplate } from '../templates/minimalist';
import { InvoiceTemplateProps } from '../templates/types';

interface PrintPreviewProps extends InvoiceTemplateProps {
  template: 'classic' | 'modern' | 'minimalist';
}

export const InvoicePrintPreview: React.FC<PrintPreviewProps> = (props) => {
  const { template, ...templateProps } = props;

  const getTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      case 'minimalist':
        return <MinimalistTemplate {...templateProps} />;
      default:
        return <ClassicTemplate {...templateProps} />;
    }
  };

  return getTemplate();
};
