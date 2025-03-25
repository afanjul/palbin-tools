import { Form, Row, Col, Card } from 'react-bootstrap';
import { Address } from '../types';
import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json';

// Initialize countries with Spanish locale
countries.registerLocale(es);

interface AddressFormProps {
  title: string;
  address: Address;
  onAddressChange: (address: Address) => void;
}

export function AddressForm({ title, address, onAddressChange }: AddressFormProps) {
  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">{title}</h5>
        <Row>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id={`${title.toLowerCase()}Name`}
                placeholder="Nombre/Razón Social"
                value={address.name}
                onChange={(e) =>
                  onAddressChange({ ...address, name: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}Name`}>Nombre/Razón Social</label>
            </Form.Floating>
          </Col>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id={`${title.toLowerCase()}Nif`}
                placeholder="NIF/CIF"
                value={address.nif}
                onChange={(e) =>
                  onAddressChange({ ...address, nif: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}Nif`}>NIF/CIF</label>
            </Form.Floating>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="email"
                id={`${title.toLowerCase()}Email`}
                placeholder="Email"
                value={address.email}
                onChange={(e) =>
                  onAddressChange({ ...address, email: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}Email`}>Email</label>
            </Form.Floating>
          </Col>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id={`${title.toLowerCase()}Address`}
                placeholder="Dirección"
                value={address.address}
                onChange={(e) =>
                  onAddressChange({ ...address, address: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}Address`}>Dirección</label>
            </Form.Floating>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id={`${title.toLowerCase()}City`}
                placeholder="Ciudad"
                value={address.city}
                onChange={(e) =>
                  onAddressChange({ ...address, city: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}City`}>Ciudad</label>
            </Form.Floating>
          </Col>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id={`${title.toLowerCase()}Province`}
                placeholder="Provincia"
                value={address.province}
                onChange={(e) =>
                  onAddressChange({ ...address, province: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}Province`}>Provincia</label>
            </Form.Floating>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Select
                id={`${title.toLowerCase()}Country`}
                value={address.countryCode}
                onChange={(e) =>
                  onAddressChange({ ...address, countryCode: e.target.value })
                }
              >
                <option value="">Seleccionar país</option>
                {Object.entries(countries.getNames("es")).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor={`${title.toLowerCase()}Country`}>País</label>
            </Form.Floating>
          </Col>
          <Col md={6}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                id={`${title.toLowerCase()}ZipCode`}
                placeholder="Código Postal"
                value={address.zipCode}
                onChange={(e) =>
                  onAddressChange({ ...address, zipCode: e.target.value })
                }
              />
              <label htmlFor={`${title.toLowerCase()}ZipCode`}>Código Postal</label>
            </Form.Floating>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
} 