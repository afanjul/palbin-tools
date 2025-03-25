import { Form, Row, Col, Card } from 'react-bootstrap';
import { InvoiceData } from '../types';

interface InvoiceHeaderProps {
  invoiceData: InvoiceData;
  onInvoiceDataChange: (data: InvoiceData) => void;
}

export function InvoiceHeader({ invoiceData, onInvoiceDataChange }: InvoiceHeaderProps) {
  return (
    <Card className="hover-card">
      <Card.Body>
        <h5 className="mb-3">Datos de la Factura</h5>
        <Row>
          <Col md={2}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="series"
                placeholder="Serie"
                value={invoiceData.series}
                onChange={(e) =>
                  onInvoiceDataChange({
                    ...invoiceData,
                    series: e.target.value,
                  })
                }
              />
              <label htmlFor="series">Serie</label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id="number"
                placeholder="Número"
                value={invoiceData.number}
                onChange={(e) =>
                  onInvoiceDataChange({
                    ...invoiceData,
                    number: e.target.value,
                  })
                }
              />
              <label htmlFor="number">Número</label>
            </Form.Floating>
          </Col>
          <Col md={3}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="date"
                id="issueDate"
                placeholder="Fecha de emisión"
                value={invoiceData.issueDate}
                onChange={(e) =>
                  onInvoiceDataChange({
                    ...invoiceData,
                    issueDate: e.target.value,
                  })
                }
              />
              <label htmlFor="issueDate">Fecha de emisión</label>
            </Form.Floating>
          </Col>
          <Col md={3}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="date"
                id="operationDate"
                placeholder="Fecha de operación"
                value={invoiceData.operationDate}
                onChange={(e) =>
                  onInvoiceDataChange({
                    ...invoiceData,
                    operationDate: e.target.value,
                  })
                }
              />
              <label htmlFor="operationDate">Fecha de operación</label>
            </Form.Floating>
          </Col>
          <Col md={2}>
            <Form.Floating className="mb-3">
              <Form.Select
                id="dueDays"
                value={invoiceData.dueDays}
                onChange={(e) =>
                  onInvoiceDataChange({
                    ...invoiceData,
                    dueDays: parseInt(e.target.value),
                  })
                }
              >
                <option value="15">15 días</option>
                <option value="30">30 días</option>
                <option value="90">90 días</option>
                <option value="120">120 días</option>
              </Form.Select>
              <label htmlFor="dueDays">Vencimiento</label>
            </Form.Floating>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
} 