'use client';
import { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Table, Button, Accordion, Modal } from 'react-bootstrap';
import { Country, State, City } from 'country-state-city';
import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json';
import ISO31662 from 'iso-3166-2';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrintPreview } from './components/InvoicePrintPreview';
import { ClassicTemplate } from './templates/classic';
import { ModernTemplate } from './templates/modern';
import { MinimalistTemplate } from './templates/minimalist';

// Inicializar el paquete de países con el idioma español
countries.registerLocale(es);

interface Item {
  id: number;
  concept: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
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

  const [customer, setCustomer] = useState<Address>({
    name: '',
    nif: '',
    email: '',
    address: '',
    city: '',
    province: 'Madrid',
    countryCode: 'ES',
    zipCode: ''
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    series: '',
    number: '',
    issueDate: new Date().toISOString().split('T')[0],
    operationDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dueDays: 30
  });

  const [items, setItems] = useState<Item[]>([createEmptyItem(1)]);
  const [showLineDiscounts, setShowLineDiscounts] = useState(false);
  const [showGlobalDiscount, setShowGlobalDiscount] = useState(false);
  const [includeGlobalDiscount, setIncludeGlobalDiscount] = useState(false);
  const [discount, setDiscount] = useState({
    amount: 0,
    type: 'fixed' as 'fixed' | 'percentage',
    showInDocument: true
  });

  const [showHeaderText, setShowHeaderText] = useState(false);
  const [showFooterText, setShowFooterText] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'minimalist'>('classic');
  const [sendToSender, setSendToSender] = useState(true);
  const [sendToReceiver, setSendToReceiver] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => {
      setShowPreview(false);
      setShowTemplateModal(false);
    },
    onPrintError: (error) => {
      console.error('Error printing:', error);
      alert('Error al imprimir. Por favor, inténtelo de nuevo.');
    },
  });

  const handlePreviewAndPrint = () => {
    setShowPreview(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

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
      setShowGlobalDiscount(data.showGlobalDiscount);
      setIncludeGlobalDiscount(data.includeGlobalDiscount);
      setShowLineDiscounts(data.showLineDiscounts);
      setHeaderText(data.headerText);
      setFooterText(data.footerText);
      setShowHeaderText(data.showHeaderText);
      setShowFooterText(data.showFooterText);
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      invoiceData,
      company,
      customer,
      items,
      discount,
      showGlobalDiscount,
      includeGlobalDiscount,
      showLineDiscounts,
      headerText,
      footerText,
      showHeaderText,
      showFooterText
    };
    localStorage.setItem('invoiceGeneratorData', JSON.stringify(dataToSave));
  }, [invoiceData, company, customer, items, discount, showGlobalDiscount, includeGlobalDiscount, showLineDiscounts, headerText, footerText, showHeaderText, showFooterText]);

  const handleReset = () => {
    const savedCompany = { ...company };
    const savedInvoiceData = { ...invoiceData };
    
    setCustomer({
      name: '',
      nif: '',
      email: '',
      address: '',
      city: '',
      province: '',
      countryCode: 'ES',
      zipCode: ''
    });
    setItems([]);
    setDiscount({
      amount: 0,
      type: 'fixed',
      showInDocument: true
    });
    setShowGlobalDiscount(false);
    setIncludeGlobalDiscount(false);
    setShowLineDiscounts(false);
    setHeaderText('');
    setFooterText('');
    setShowHeaderText(false);
    setShowFooterText(false);
    
    setCompany(savedCompany);
    setInvoiceData(savedInvoiceData);
  };

  function createEmptyItem(id: number): Item {
    return {
      id,
      concept: '',
      description: '',
      quantity: 1,
      price: 0,
      tax: 21,
      discount: 0,
      editingPrice: '0.00',
      editingTotal: '0.00'
    };
  }

  function calculateLineTotal(quantity: number, price: number, tax: number, discount: number = 0): number {
    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    return (subtotal - discountAmount) * (1 + tax / 100);
  }

  function calculateLinePrice(total: number, quantity: number, tax: number, discount: number = 0): number {
    const subtotal = total / (1 + tax / 100);
    const discountAmount = subtotal * (discount / 100);
    return (subtotal - discountAmount) / quantity;
  }

  const calculateDueDate = (issueDate: string, days: number): string => {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleIssueDateChange = (newDate: string) => {
    setInvoiceData({
      ...invoiceData,
      issueDate: newDate,
      operationDate: newDate,
      dueDate: calculateDueDate(newDate, invoiceData.dueDays)
    });
  };

  const handleDueDaysChange = (days: number) => {
    setInvoiceData({
      ...invoiceData,
      dueDays: days,
      dueDate: calculateDueDate(invoiceData.issueDate, days)
    });
  };

  const updateItemField = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateNumericField = (
    id: number, 
    field: 'editingPrice' | 'editingTotal', 
    value: string,
    recalculateField?: 'total' | 'price'
  ) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (recalculateField) {
          const numValue = parseFloat(value) || 0;
          if (recalculateField === 'total') {
            const newTotal = calculateLineTotal(item.quantity, numValue, item.tax, item.discount);
            updatedItem.editingTotal = newTotal.toFixed(2);
          } else {
            const newPrice = calculateLinePrice(numValue, item.quantity, item.tax, item.discount);
            updatedItem.editingPrice = newPrice.toFixed(2);
          }
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleFieldBlur = (id: number, field: 'price' | 'total') => {
    setItems(items.map(item => {
      if (item.id === id) {
        const isPrice = field === 'price';
        const value = parseFloat(isPrice ? item.editingPrice : item.editingTotal) || 0;
        const newPrice = isPrice ? value : calculateLinePrice(value, item.quantity, item.tax, item.discount);
        const newTotal = isPrice ? calculateLineTotal(item.quantity, value, item.tax, item.discount) : value;

        return {
          ...item,
          price: newPrice,
          editingPrice: newPrice.toFixed(2),
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
        const newTotal = calculateLineTotal(quantity, item.price, item.tax, item.discount);
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
    const tax = parseInt(value);
    setItems(items.map(item => {
      if (item.id === id) {
        const newTotal = calculateLineTotal(item.quantity, item.price, tax, item.discount);
        return {
          ...item,
          tax,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const handleLineDiscountChange = (id: number, value: string) => {
    const discountValue = parseFloat(value) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        const newTotal = calculateLineTotal(item.quantity, item.price, item.tax, discountValue);
        return {
          ...item,
          discount: discountValue,
          editingTotal: newTotal.toFixed(2)
        };
      }
      return item;
    }));
  };

  const handleShowLineDiscountsChange = (checked: boolean) => {
    setShowLineDiscounts(checked);
    if (!checked) {
      setItems(items.map(item => {
        const newTotal = calculateLineTotal(item.quantity, item.price, item.tax, 0);
        return {
          ...item,
          discount: 0,
          editingTotal: newTotal.toFixed(2)
        };
      }));
    }
  };

  const addItem = () => {
    setItems([...items, createEmptyItem(items.length + 1)]);
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => {
      const lineSubtotal = item.quantity * item.price;
      const lineDiscount = showLineDiscounts ? (lineSubtotal * (item.discount / 100)) : 0;
      return acc + (lineSubtotal - lineDiscount);
    }, 0);

    const globalDiscountAmount = showGlobalDiscount ? (
      discount.type === 'fixed' 
        ? discount.amount 
        : (subtotal * (discount.amount / 100))
    ) : 0;

    const taxAmount = items.reduce((acc, item) => {
      const lineSubtotal = item.quantity * item.price;
      const lineDiscount = showLineDiscounts ? (lineSubtotal * (item.discount / 100)) : 0;
      return acc + ((lineSubtotal - lineDiscount) * (item.tax / 100));
    }, 0);

    const total = subtotal - globalDiscountAmount + taxAmount;

    return { 
      subtotal, 
      taxAmount, 
      total, 
      globalDiscountAmount
    };
  };

  const { subtotal, taxAmount, total, globalDiscountAmount: calculatedGlobalDiscountAmount } = calculateTotals();

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

  return (
    <Container fluid className="p-4">
      <h1 className="text-center mb-4">Generador de Facturas</h1>

      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Datos de la Factura</h5>
              <Row>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Serie</Form.Label>
                    <Form.Control
                      type="text"
                      value={invoiceData.series}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, series: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="text"
                      value={invoiceData.number}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, number: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Fecha de Emisión</Form.Label>
                    <Form.Control
                      type="date"
                      value={invoiceData.issueDate}
                      onChange={(e) => {
                        const newIssueDate = e.target.value;
                        const dueDays = invoiceData.dueDays;
                        const dueDate = new Date(newIssueDate);
                        dueDate.setDate(dueDate.getDate() + dueDays);
                        
                        setInvoiceData({
                          ...invoiceData,
                          issueDate: newIssueDate,
                          operationDate: newIssueDate,
                          dueDate: dueDate.toISOString().split('T')[0]
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Fecha de Operación</Form.Label>
                    <Form.Control
                      type="date"
                      value={invoiceData.operationDate}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, operationDate: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Días de Vencimiento</Form.Label>
                    <Form.Select
                      value={invoiceData.dueDays}
                      onChange={(e) => {
                        const dueDays = parseInt(e.target.value);
                        const dueDate = new Date(invoiceData.issueDate);
                        dueDate.setDate(dueDate.getDate() + dueDays);
                        
                        setInvoiceData({
                          ...invoiceData,
                          dueDays,
                          dueDate: dueDate.toISOString().split('T')[0]
                        });
                      }}
                    >
                      <option value={15}>15 días</option>
                      <option value={30}>30 días</option>
                      <option value={60}>60 días</option>
                      <option value={90}>90 días</option>
                      <option value={120}>120 días</option>
                    </Form.Select>
                    <Form.Control
                      type="date"
                      value={invoiceData.dueDate}
                      hidden
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Datos de la empresa</h5>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.name}
                      onChange={(e) =>
                        setCompany({ ...company, name: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>NIF</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.nif}
                      onChange={(e) =>
                        setCompany({ ...company, nif: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={company.email}
                      onChange={(e) =>
                        setCompany({ ...company, email: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.address}
                      onChange={(e) =>
                        setCompany({ ...company, address: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.city}
                      onChange={(e) =>
                        setCompany({ ...company, city: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Provincia</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.province}
                      onChange={(e) =>
                        setCompany({ ...company, province: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Código postal</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.zipCode}
                      onChange={(e) =>
                        setCompany({ ...company, zipCode: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>País</Form.Label>
                    <Form.Control
                      type="text"
                      value={company.countryCode}
                      onChange={(e) =>
                        setCompany({ ...company, countryCode: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Datos del cliente</h5>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nombre / Razón social</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>NIF</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.nif}
                      onChange={(e) => setCustomer({...customer, nif: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-3 mt-2">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({...customer, address: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="g-3 mt-2">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({...customer, city: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>País</Form.Label>
                    <Form.Select
                      value={customer.countryCode}
                      onChange={(e) => {
                        const newCountryCode = e.target.value;
                        setCustomer({
                          ...customer,
                          countryCode: newCountryCode,
                          province: getProvinces(newCountryCode)[0]?.name || ''
                        });
                      }}
                    >
                      {countryList.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Provincia</Form.Label>
                    <Form.Select
                      value={customer.province}
                      onChange={(e) => setCustomer({...customer, province: e.target.value})}
                    >
                      {getProvinces(customer.countryCode).map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Código postal</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.zipCode}
                      onChange={(e) => setCustomer({...customer, zipCode: e.target.value})}
                    />
                  </Form.Group>
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
                        onChange={(e) => updateItemField(item.id, 'concept', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
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
                        onChange={(e) => updateNumericField(item.id, 'editingPrice', e.target.value, 'total')}
                        onBlur={() => handleFieldBlur(item.id, 'price')}
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td>
                      <Form.Select
                        className="text-end"
                        value={item.tax}
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
                          onChange={(e) => handleLineDiscountChange(item.id, e.target.value)}
                          step="0.01"
                          min="0"
                          max="100"
                        />
                      </td>
                    )}
                    <td>
                      <Form.Control
                        type="number"
                        className="text-end"
                        value={item.editingTotal}
                        onChange={(e) => updateNumericField(item.id, 'editingTotal', e.target.value, 'price')}
                        onBlur={() => handleFieldBlur(item.id, 'total')}
                        step="0.01"
                        min="0"
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
          <Button variant="primary" onClick={addItem}>
            <i className="bi bi-plus me-2"></i>
            Añadir línea
          </Button>

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
                <Form.Group className="mb-3">
                  <Form.Check
                    id="line-discounts-checkbox"
                    type="checkbox"
                    label="Descuento por línea"
                    checked={showLineDiscounts}
                    onChange={(e) => handleShowLineDiscountsChange(e.target.checked)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    id="global-discount-checkbox"
                    type="checkbox"
                    label="Descuento global"
                    checked={showGlobalDiscount}
                    onChange={(e) => setShowGlobalDiscount(e.target.checked)}
                  />
                  {showGlobalDiscount && (
                    <div className="mt-2">
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Control
                          type="number"
                          value={discount.amount}
                          onChange={(e) => setDiscount({
                            ...discount,
                            amount: parseFloat(e.target.value) || 0
                          })}
                          min="0"
                          step="0.01"
                          style={{ width: '100px' }}
                        />
                        <Form.Select
                          value={discount.type}
                          onChange={(e) => setDiscount({
                            ...discount,
                            type: e.target.value as 'fixed' | 'percentage'
                          })}
                          style={{ width: '120px' }}
                        >
                          <option value="fixed">€</option>
                          <option value="percentage">%</option>
                        </Form.Select>
                      </div>
                      <Form.Check
                        id="show-in-document-checkbox"
                        type="checkbox"
                        label="Mostrar en factura"
                        checked={discount.showInDocument}
                        onChange={(e) => setDiscount({
                          ...discount,
                          showInDocument: e.target.checked
                        })}
                        className="mt-2"
                      />
                      <Form.Check
                        id="include-global-discount-checkbox"
                        type="checkbox"
                        label="Incluir en factura"
                        checked={includeGlobalDiscount}
                        onChange={(e) => setIncludeGlobalDiscount(e.target.checked)}
                        className="mt-2"
                      />
                    </div>
                  )}
                </Form.Group>
                <Table borderless>
                  <tbody>
                    <tr>
                      <th>Subtotal:</th>
                      <td className="text-end">{subtotal.toFixed(2)}€</td>
                    </tr>
                    {showGlobalDiscount && includeGlobalDiscount && discount.showInDocument && calculatedGlobalDiscountAmount > 0 && (
                      <tr>
                        <th>
                          Descuento {discount.type === 'percentage' ? `(${discount.amount}%)` : 'global'}:
                        </th>
                        <td className="text-end">-{calculatedGlobalDiscountAmount.toFixed(2)}€</td>
                      </tr>
                    )}
                    <tr>
                      <th>IVA:</th>
                      <td className="text-end">{taxAmount.toFixed(2)}€</td>
                    </tr>
                    <tr className="fw-bold">
                      <th>Total:</th>
                      <td className="text-end">{total.toFixed(2)}€</td>
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
        <Button 
          variant="outline-secondary" 
          size="lg"
          onClick={handleReset}
        >
          Reiniciar factura
        </Button>
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
              showGlobalDiscount={showGlobalDiscount && includeGlobalDiscount && discount.showInDocument}
              globalDiscount={calculatedGlobalDiscountAmount}
              headerText={headerText}
              showHeaderText={showHeaderText}
              footerText={footerText}
              showFooterText={showFooterText}
            />
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-top">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <Form.Check
                  id="send-to-sender-checkbox"
                  type="checkbox"
                  label="Enviar al remitente"
                  checked={sendToSender}
                  onChange={(e) => setSendToSender(e.target.checked)}
                  className="mb-2"
                />
                <Form.Check
                  id="send-to-receiver-checkbox"
                  type="checkbox"
                  label="Enviar al destinatario"
                  checked={sendToReceiver}
                  onChange={(e) => setSendToReceiver(e.target.checked)}
                />
              </div>
              <div className="col-auto">
                <Button 
                  variant="primary" 
                  onClick={() => handlePreviewAndPrint()}
                >
                  Generar PDF
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
