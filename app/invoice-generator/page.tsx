'use client';
import { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Table, Button, Accordion, Modal, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Country, State, City } from 'country-state-city';
import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json';
import ISO31662 from 'iso-3166-2';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrintPreview } from './components/InvoicePrintPreview';
import { ClassicTemplate } from './templates/classic';
import { ModernTemplate } from './templates/modern';
import { MinimalistTemplate } from './templates/minimalist';
import { PlusCircle } from 'react-bootstrap-icons';

// Inicializar el paquete de países con el idioma español
countries.registerLocale(es);

interface Item {
  id: number;
  concept: string;
  description: string;
  quantity: number;
  price: number;
  taxAmount: number;
  discount: number;
  editingPrice: string;
  editingTotal: string;
}

interface InvoiceData {
  series: string;
  number: string;
  issueDate: string;
  operationDate: string;
  dueDate: string;
  dueDays: number;
}

interface Address {
  name: string;
  nif: string;
  email: string;
  address: string;
  city: string;
  province: string;
  countryCode: string;
  zipCode: string;
}

interface TaxBreakdown {
  [key: string]: {
    base: number;
    amount: number;
  };
}

interface InvoiceCalculations {
  subtotalWithoutDiscount: number;
  productDiscountAmount: number;
  globalDiscountAmount: number;
  subtotal: number;
  taxBreakdown: TaxBreakdown;
  totalTaxes: number;
  total: number;
}

export default function InvoiceGenerator() {
  const [company, setCompany] = useState<Address>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('companyData');
      return saved ? JSON.parse(saved) : {
        name: '',
        nif: '',
        email: '',
        address: '',
        city: '',
        province: 'Madrid',
        countryCode: 'ES',
        zipCode: ''
      };
    }
    return {
      name: '',
      nif: '',
      email: '',
      address: '',
      city: '',
      province: 'Madrid',
      countryCode: 'ES',
      zipCode: ''
    };
  });

  const [customer, setCustomer] = useState<Address>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customerData');
      return saved ? JSON.parse(saved) : {
        name: '',
        nif: '',
        email: '',
        address: '',
        city: '',
        province: 'Madrid',
        countryCode: 'ES',
        zipCode: ''
      };
    }
    return {
      name: '',
      nif: '',
      email: '',
      address: '',
      city: '',
      province: 'Madrid',
      countryCode: 'ES',
      zipCode: ''
    };
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('invoiceData');
      return saved ? JSON.parse(saved) : {
        series: '',
        number: '',
        issueDate: new Date().toISOString().split('T')[0],
        operationDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        dueDays: 0
      };
    }
    return {
      series: '',
      number: '',
      issueDate: new Date().toISOString().split('T')[0],
      operationDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      dueDays: 0
    };
  });

  const [items, setItems] = useState<Item[]>([createEmptyItem(1)]);
  const [showLineDiscounts, setShowLineDiscounts] = useState(false);
  const [showGlobalDiscount, setShowGlobalDiscount] = useState(false);
  const [showHeaderText, setShowHeaderText] = useState(true);
  const [showFooterText, setShowFooterText] = useState(true);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [discount, setDiscount] = useState({
    amount: 0,
    type: 'fixed' as 'fixed' | 'percentage',
    showInDocument: true
  });

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'minimalist'>('classic');
  const [sendToSender, setSendToSender] = useState(true);
  const [sendToReceiver, setSendToReceiver] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => {
      // setShowTemplateModal(false);
    },
    onPrintError: (error) => {
      console.error('Error printing:', error);
      alert('Error al imprimir. Por favor, inténtelo de nuevo.');
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
      localStorage.setItem('companyData', JSON.stringify(company));
      localStorage.setItem('customerData', JSON.stringify(customer));
    }
  }, [invoiceData, company, customer]);

  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    const savedData = localStorage.getItem('invoiceGeneratorData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setInvoiceData(data.invoiceData);
      setCompany(data.company);
      setCustomer(data.customer);
      setItems(data.items);
      setDiscount(data.discount);
      setShowLineDiscounts(data.showLineDiscounts);
      setShowHeaderText(data.showHeaderText);
      setShowFooterText(data.showFooterText);
      setHeaderText(data.headerText || '');
      setFooterText(data.footerText || '');
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      invoiceData,
      company,
      customer,
      items,
      discount,
      showLineDiscounts,
      showHeaderText,
      showFooterText,
      headerText,
      footerText
    };
    localStorage.setItem('invoiceGeneratorData', JSON.stringify(dataToSave));
  }, [invoiceData, company, customer, items, discount, showLineDiscounts, showHeaderText, showFooterText, headerText, footerText]);

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      // Clear only the customer and invoice data
      localStorage.removeItem('customerData');
      localStorage.removeItem('invoiceData');
    }
    
    setInvoiceData({
      series: '',
      number: '',
      issueDate: new Date().toISOString().split('T')[0],
      operationDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      dueDays: 0
    });

    setCustomer({
      name: '',
      nif: '',
      email: '',
      address: '',
      city: '',
      province: 'Madrid',
      countryCode: 'ES',
      zipCode: ''
    });

    setItems([]);
    setShowGlobalDiscount(false);
    setDiscount({ type: 'fixed', amount: 0, showInDocument: true });
    setShowHeaderText(false);
    setHeaderText('');
    setShowFooterText(false);
    setFooterText('');
  };

  const handleResetAll = () => {
    if (typeof window !== 'undefined') {
      // Clear all data including company data
      localStorage.removeItem('customerData');
      localStorage.removeItem('invoiceData');
      localStorage.removeItem('companyData');
    }
    
    handleReset(); // Reset invoice and customer data

    setCompany({
      name: '',
      nif: '',
      email: '',
      address: '',
      city: '',
      province: 'Madrid',
      countryCode: 'ES',
      zipCode: ''
    });
  };

  function createEmptyItem(id: number): Item {
    return {
      id,
      concept: '',
      description: '',
      quantity: 1,
      price: 0,
      taxAmount: 21,
      discount: 0,
      editingPrice: '0',
      editingTotal: '0'
    };
  }

  const calculateInvoiceData = (items: Item[]): InvoiceCalculations => {
    // 1. Calcular subtotal sin descuento (suma de precio * cantidad de cada línea)
    const subtotalWithoutDiscount = items.reduce((acc, item) => 
      acc + (item.quantity * item.price), 0
    );

    // 2. Calcular descuento por producto (suma de los descuentos individuales)
    const productDiscountAmount = items.reduce((acc, item) => {
      const lineSubtotal = item.quantity * item.price;
      return acc + (lineSubtotal * (item.discount / 100));
    }, 0);

    // 3. Calcular descuento global (solo si está activo)
    const baseForGlobalDiscount = subtotalWithoutDiscount - productDiscountAmount;
    let globalDiscountAmount = 0;
    
    if (showGlobalDiscount && discount) {
      if (discount.type === 'fixed') {
        // Si es fijo, no puede superar la base
        globalDiscountAmount = Math.min(discount.amount, baseForGlobalDiscount);
      } else {
        // Si es porcentaje, calculamos sobre la base
        globalDiscountAmount = baseForGlobalDiscount * (discount.amount / 100);
      }
    }

    // 4. Calcular subtotal final
    const subtotal = subtotalWithoutDiscount - productDiscountAmount - globalDiscountAmount;

    // 5. Calcular IVA por tipos
    const taxBreakdown: TaxBreakdown = {};
    const totalAfterDiscounts = subtotal;
    const discountRatio = totalAfterDiscounts / (subtotalWithoutDiscount || 1);

    items.forEach(item => {
      const lineSubtotal = item.quantity * item.price;
      const lineSubtotalAfterDiscount = lineSubtotal * discountRatio;
      const taxRate = item.taxAmount.toString();

      if (!taxBreakdown[taxRate]) {
        taxBreakdown[taxRate] = { base: 0, amount: 0 };
      }

      taxBreakdown[taxRate].base += lineSubtotalAfterDiscount;
      taxBreakdown[taxRate].amount += lineSubtotalAfterDiscount * (item.taxAmount / 100);
    });

    // 6. Calcular total de impuestos
    const totalTaxes = Object.values(taxBreakdown).reduce((acc, tax) => 
      acc + tax.amount, 0
    );

    // 7. Calcular total final
    const total = subtotal + totalTaxes;

    return {
      subtotalWithoutDiscount,
      productDiscountAmount,
      globalDiscountAmount,
      subtotal,
      taxBreakdown,
      totalTaxes,
      total
    };
  };

  const [calculations, setCalculations] = useState<InvoiceCalculations>(calculateInvoiceData(items));

  useEffect(() => {
    const newCalculations = calculateInvoiceData(items);
    setCalculations(newCalculations);
  }, [items, discount]);

  const countryList = Country.getAllCountries().map(country => ({
    isoCode: country.isoCode,
    name: countries.getName(country.isoCode, 'es') || country.name
  })).sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const getProvinces = (countryCode: string) => {
    const provinces = State.getStatesOfCountry(countryCode);
    if (!provinces || provinces.length === 0) return [];
    
    return provinces
      .map(state => {
        if (!state) return null;
        const subdivisionCode = `${countryCode}-${state.isoCode}`;
        const subdivision = ISO31662.subdivision(subdivisionCode);
        return {
          isoCode: state.isoCode || '',
          name: (subdivision?.name || state.name || '').trim()
        };
      })
      .filter((item): item is { isoCode: string; name: string } => 
        item !== null && typeof item.name === 'string' && item.name !== '')
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  };

  const handleShowLineDiscountsChange = (checked: boolean) => {
    setShowLineDiscounts(checked);
    if (!checked) {
      setItems(items.map(item => {
        const newTotal = calculateLineTotal(item.quantity, item.price, item.taxAmount, 0);
        return {
          ...item,
          discount: 0,
          editingTotal: newTotal.toFixed(2)
        };
      }));
    }
  };

  const handleShowGlobalDiscountChange = (checked: boolean) => {
    setShowGlobalDiscount(checked);
    if (!checked) {
      // Reset discount values when unchecking
      setDiscount({
        type: 'percentage',
        amount: 0,
        showInDocument: true
      });
    }
  };

  function calculateLineTotal(quantity: number, price: number, taxAmount: number, discount: number = 0): number {
    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    const taxableAmount = subtotal - discountAmount;
    return taxableAmount * (1 + taxAmount / 100);
  }

  const handleFieldBlur = (id: number, field: 'price' | 'total') => {
    setItems(items.map(item => {
      if (item.id === id) {
        const value = parseFloat(item.editingPrice) || 0;
        const newTotal = calculateLineTotal(item.quantity, value, item.taxAmount, item.discount);

        return {
          ...item,
          price: value,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = parseFloat(value) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        const newTotal = calculateLineTotal(quantity, item.price, item.taxAmount, item.discount);
        return {
          ...item,
          quantity,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const handleTaxChange = (id: number, value: string) => {
    const taxAmount = parseInt(value);
    setItems(items.map(item => {
      if (item.id === id) {
        const newTotal = calculateLineTotal(item.quantity, item.price, taxAmount, item.discount);
        return {
          ...item,
          taxAmount,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const handleDiscountChange = (id: number, value: string) => {
    const discountValue = parseFloat(value) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        const newTotal = calculateLineTotal(item.quantity, item.price, item.taxAmount, discountValue);
        return {
          ...item,
          discount: discountValue,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const handlePriceChange = (id: number, value: string) => {
    const price = parseFloat(value) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        const newTotal = calculateLineTotal(item.quantity, price, item.taxAmount, item.discount);
        return {
          ...item,
          editingPrice: value,
          price: price,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, createEmptyItem(items.length + 1)]);
  };

  const deleteItem = (id: number) => {
    // Si es el primer item (id === 1), solo limpiamos sus campos
    if (id === 1) {
      setItems(items.map(item => 
        item.id === 1 ? {
          ...item,
          concept: '',
          description: '',
          quantity: 1,
          price: 0,
          taxAmount: 21,
          discount: 0,
          editingPrice: '0',
          editingTotal: '0'
        } : item
      ));
    } else {
      // Si no es el primer item, lo eliminamos
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <Container fluid className="p-4">
      <h1 className="text-center mb-4">Generador de Facturas</h1>

      <Row className="mb-4">
        <Col md={12}>
          <Card className='hover-card'>
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
                      onChange={(e) => setInvoiceData({ ...invoiceData, series: e.target.value })}
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
                      onChange={(e) => setInvoiceData({ ...invoiceData, number: e.target.value })}
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
                      onChange={(e) => setInvoiceData({ ...invoiceData, issueDate: e.target.value })}
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
                      onChange={(e) => setInvoiceData({ ...invoiceData, operationDate: e.target.value })}
                    />
                    <label htmlFor="operationDate">Fecha de operación</label>
                  </Form.Floating>
                </Col>
                <Col md={2} className='d-none'>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="date"
                      id="dueDate"
                      placeholder="Fecha de vencimiento"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                    />
                    <label htmlFor="dueDate">Fecha de vencimiento</label>
                  </Form.Floating>
                </Col>
                <Col md={2}>
                  <Form.Floating className="mb-3">
                    <Form.Select
                      id="dueDays"
                      value={invoiceData.dueDays}
                      onChange={(e) => setInvoiceData({ ...invoiceData, dueDays: parseInt(e.target.value) })}
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
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Datos del Emisor</h5>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="companyName"
                      placeholder="Nombre/Razón Social"
                      value={company.name}
                      onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    />
                    <label htmlFor="companyName">Nombre/Razón Social</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="companyNif"
                      placeholder="NIF/CIF"
                      value={company.nif}
                      onChange={(e) => setCompany({ ...company, nif: e.target.value })}
                    />
                    <label htmlFor="companyNif">NIF/CIF</label>
                  </Form.Floating>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="email"
                      id="companyEmail"
                      placeholder="Email"
                      value={company.email}
                      onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    />
                    <label htmlFor="companyEmail">Email</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="companyAddress"
                      placeholder="Dirección"
                      value={company.address}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    />
                    <label htmlFor="companyAddress">Dirección</label>
                  </Form.Floating>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="companyCity"
                      placeholder="Ciudad"
                      value={company.city}
                      onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    />
                    <label htmlFor="companyCity">Ciudad</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="companyProvince"
                      placeholder="Provincia"
                      value={company.province}
                      onChange={(e) => setCompany({ ...company, province: e.target.value })}
                    />
                    <label htmlFor="companyProvince">Provincia</label>
                  </Form.Floating>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Select
                      id="companyCountry"
                      value={company.countryCode}
                      onChange={(e) => setCompany({ ...company, countryCode: e.target.value })}
                    >
                      <option value="">Seleccionar país</option>
                      {Object.entries(countries.getNames('es')).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </Form.Select>
                    <label htmlFor="companyCountry">País</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="companyZipCode"
                      placeholder="Código Postal"
                      value={company.zipCode}
                      onChange={(e) => setCompany({ ...company, zipCode: e.target.value })}
                    />
                    <label htmlFor="companyZipCode">Código Postal</label>
                  </Form.Floating>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Datos del Receptor</h5>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="customerName"
                      placeholder="Nombre/Razón Social"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />
                    <label htmlFor="customerName">Nombre/Razón Social</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="customerNif"
                      placeholder="NIF/CIF"
                      value={customer.nif}
                      onChange={(e) => setCustomer({ ...customer, nif: e.target.value })}
                    />
                    <label htmlFor="customerNif">NIF/CIF</label>
                  </Form.Floating>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="email"
                      id="customerEmail"
                      placeholder="Email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                    <label htmlFor="customerEmail">Email</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="customerAddress"
                      placeholder="Dirección"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    />
                    <label htmlFor="customerAddress">Dirección</label>
                  </Form.Floating>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="customerCity"
                      placeholder="Ciudad"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    />
                    <label htmlFor="customerCity">Ciudad</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="customerProvince"
                      placeholder="Provincia"
                      value={customer.province}
                      onChange={(e) => setCustomer({ ...customer, province: e.target.value })}
                    />
                    <label htmlFor="customerProvince">Provincia</label>
                  </Form.Floating>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Select
                      id="customerCountry"
                      value={customer.countryCode}
                      onChange={(e) => setCustomer({ ...customer, countryCode: e.target.value })}
                    >
                      <option value="">Seleccionar país</option>
                      {Object.entries(countries.getNames('es')).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </Form.Select>
                    <label htmlFor="customerCountry">País</label>
                  </Form.Floating>
                </Col>
                <Col md={6}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      type="text"
                      id="customerZipCode"
                      placeholder="Código Postal"
                      value={customer.zipCode}
                      onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                    />
                    <label htmlFor="customerZipCode">Código Postal</label>
                  </Form.Floating>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Conceptos */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Conceptos</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th className="col-3">Concepto</th>
                  <th className="col-2">Descripción</th>
                  <th className="col-1 text-end">Cantidad</th>
                  <th className="col-2 text-end">Precio</th>
                  <th className="col-1 text-end">IVA</th>
                  {showLineDiscounts && (
                    <th className="col-1 text-end">Desc. %</th>
                  )}
                  <th className="col-2 text-end">Total</th>
                  <th className="col-1"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.concept}
                        onChange={(e) => setItems(items.map(i => 
                          i.id === item.id ? { ...i, concept: e.target.value } : i
                        ))}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.description}
                        onChange={(e) => setItems(items.map(i => 
                          i.id === item.id ? { ...i, description: e.target.value } : i
                        ))}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        className="text-end"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        step="1"
                        min="1"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        className="text-end"
                        value={item.editingPrice}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        onBlur={() => handleFieldBlur(item.id, 'price')}
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td>
                      <Form.Select
                        className="text-end"
                        value={item.taxAmount}
                        onChange={(e) => handleTaxChange(item.id, e.target.value)}
                      >
                        <option value="0">0%</option>
                        <option value="4">4%</option>
                        <option value="10">10%</option>
                        <option value="21">21%</option>
                      </Form.Select>
                    </td>
                    {showLineDiscounts && (
                      <td>
                        <Form.Control
                          type="number"
                          className="text-end"
                          value={item.discount}
                          onChange={(e) => handleDiscountChange(item.id, e.target.value)}
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </td>
                    )}
                    <td>
                      <Form.Control
                        type="text"
                        className="text-end"
                        value={item.editingTotal}
                        readOnly
                      />
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-start mb-3">
            <Button
              variant="link"
              className="text-decoration-none d-flex align-items-center ps-0"
              onClick={addItem}
            >
              <PlusCircle className="me-1" />
              Añadir línea
            </Button>
          </div>

          <div className="mt-4">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    id="header-text-checkbox"
                    type="checkbox"
                    label="Añadir texto en la cabecera"
                    checked={showHeaderText}
                    onChange={(e) => setShowHeaderText(e.target.checked)}
                  />
                  {showHeaderText && (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={headerText}
                      onChange={(e) => setHeaderText(e.target.value)}
                      placeholder="Texto para la cabecera de la factura"
                      className="mt-2"
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    id="footer-text-checkbox"
                    type="checkbox"
                    label="Añadir texto en el pie"
                    checked={showFooterText}
                    onChange={(e) => setShowFooterText(e.target.checked)}
                  />
                  {showFooterText && (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      placeholder="Texto para el pie de la factura"
                      className="mt-2"
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Table borderless>
                  <tbody>
                    <tr>
                      <th>Subtotal sin descuento:</th>
                      <td className="text-end">{calculations.subtotalWithoutDiscount.toFixed(2)}€</td>
                    </tr>
                    <tr>
                      <th>
                        <Form.Check
                          id="line-discounts-checkbox"
                          type="checkbox"
                          label="Descuento por línea"
                          checked={showLineDiscounts}
                          onChange={(e) => handleShowLineDiscountsChange(e.target.checked)}
                        />
                      </th>
                      <td className="text-end">
                        {calculations.productDiscountAmount > 0 ? 
                          `-${calculations.productDiscountAmount.toFixed(2)}€` : 
                          '0,00€'
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Check
                            id="global-discount-checkbox"
                            type="checkbox"
                            label="Descuento global"
                            checked={showGlobalDiscount}
                            onChange={(e) => handleShowGlobalDiscountChange(e.target.checked)}
                          />
                          {showGlobalDiscount && (
                            <>
                              <Form.Control
                                type="number"
                                value={discount.amount}
                                onChange={(e) => setDiscount({
                                  ...discount,
                                  amount: parseFloat(e.target.value) || 0
                                })}
                                min="0"
                                step="0.01"
                                size="sm"
                                style={{ width: '80px' }}
                              />
                              <Form.Select
                                value={discount.type}
                                onChange={(e) => setDiscount({
                                  ...discount,
                                  type: e.target.value as 'fixed' | 'percentage'
                                })}
                                size="sm"
                                style={{ width: '60px' }}
                              >
                                <option value="percentage">%</option>
                                <option value="fixed">€</option>
                              </Form.Select>
                            </>
                          )}
                        </div>
                      </th>
                      <td className="text-end">
                        {showGlobalDiscount && calculations.globalDiscountAmount > 0 && 
                          `-${calculations.globalDiscountAmount.toFixed(2)}€`
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Subtotal:</th>
                      <td className="text-end">{calculations.subtotal.toFixed(2)}€</td>
                    </tr>
                    {Object.entries(calculations.taxBreakdown).map(([taxRate, tax]) => (
                      <tr key={taxRate}>
                        <th>IVA ({taxRate}%):</th>
                        <td className="text-end">{tax.amount.toFixed(2)}€</td>
                      </tr>
                    ))}
                    <tr className="fw-bold">
                      <th>Total:</th>
                      <td className="text-end">{calculations.total.toFixed(2)}€</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>

      {/* Botones de acción */}
      <div className="d-flex gap-3 mb-4">
        <Button 
          variant="primary" 
          size="lg" 
          className="flex-grow-1"
          onClick={() => setShowTemplateModal(true)}
        >
          Generar factura
        </Button>
        <ButtonGroup size="lg">
          <Button 
            variant="outline-secondary" 
            onClick={handleReset}
          >
            Nueva Factura
          </Button>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle 
              split 
              variant="outline-secondary"
              id="dropdown-split-basic"
            />
            <Dropdown.Menu align="end">
              <Dropdown.Item 
                onClick={handleResetAll}
                className="text-danger"
              >
                Reiniciar todo el formulario
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
      </div>

      {/* Modal de previsualización */}
      <Modal 
        show={showTemplateModal} 
        onHide={() => setShowTemplateModal(false)}
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
            backgroundColor: '#f8f9fa',
            height: '75vh',
            overflowY: 'auto'
          }}
        >
          <div className="mb-3">
            <Form.Group>
              <Form.Label>Plantilla</Form.Label>
              <Form.Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as 'classic' | 'modern' | 'minimalist')}
                className="mb-3"
              >
                <option value="classic">Clásica</option>
                <option value="modern">Moderna</option>
                <option value="minimalist">Minimalista</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Preview container with white background and shadow */}
          <div 
            ref={printRef}
            className="bg-white shadow-sm mx-auto p-4" 
            style={{ 
              maxWidth: '210mm',  // A4 width
              minHeight: '297mm', // A4 height
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
          <Button variant="outline-secondary" onClick={() => setShowTemplateModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => handlePrint()}>
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
