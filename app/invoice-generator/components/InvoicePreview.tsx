import { Modal, Button, Form } from 'react-bootstrap';
import { InvoiceData, Address, Item, InvoiceCalculations } from '../types';
import { InvoicePrintPreview } from './InvoicePrintPreview';

interface InvoicePreviewProps {
  show: boolean;
  onHide: () => void;
  onPrint: () => void;
  selectedTemplate: 'classic' | 'modern' | 'minimalist';
  onTemplateChange: (template: 'classic' | 'modern' | 'minimalist') => void;
  invoiceData: InvoiceData;
  company: Address;
  customer: Address;
  items: Item[];
  showLineDiscounts: boolean;
  showGlobalDiscount: boolean;
  headerText: string;
  showHeaderText: boolean;
  footerText: string;
  showFooterText: boolean;
  calculations: InvoiceCalculations;
  printRef: React.RefObject<HTMLDivElement>;
}

export function InvoicePreview({
  show,
  onHide,
  onPrint,
  selectedTemplate,
  onTemplateChange,
  invoiceData,
  company,
  customer,
  items,
  showLineDiscounts,
  showGlobalDiscount,
  headerText,
  showHeaderText,
  footerText,
  showFooterText,
  calculations,
  printRef,
}: InvoicePreviewProps) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen="lg-down"
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>Previsualización de Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="p-4"
        style={{
          backgroundColor: "#f8f9fa",
          height: "75vh",
          overflowY: "auto",
        }}
      >
        <div className="mb-3">
          <Form.Group>
            <Form.Label>Plantilla</Form.Label>
            <Form.Select
              value={selectedTemplate}
              onChange={(e) =>
                onTemplateChange(
                  e.target.value as "classic" | "modern" | "minimalist"
                )
              }
              className="mb-3"
            >
              <option value="classic">Clásica</option>
              <option value="modern">Moderna</option>
              <option value="minimalist">Minimalista</option>
            </Form.Select>
          </Form.Group>
        </div>

        <div
          ref={printRef}
          className="bg-white shadow-sm mx-auto p-4"
          style={{
            maxWidth: "210mm", // A4 width
            minHeight: "297mm", // A4 height
          }}
        >
          <InvoicePrintPreview
            template={selectedTemplate}
            invoiceData={invoiceData}
            company={company}
            customer={customer}
            items={items}
            showLineDiscounts={showLineDiscounts}
            showGlobalDiscount={showGlobalDiscount}
            headerText={headerText}
            showHeaderText={showHeaderText}
            footerText={footerText}
            showFooterText={showFooterText}
            calculations={calculations}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={onPrint}>
          Imprimir
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 