"use client";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, ButtonGroup, Dropdown, Accordion } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { InvoiceHeader } from "./components/InvoiceHeader";
import { AddressForm } from "./components/AddressForm";
import { ItemsTable } from "./components/ItemsTable";
import { InvoicePreview } from "./components/InvoicePreview";
import { LogoUpload } from "./components/LogoUpload";
import { InvoiceData, Address, Item, InvoiceCalculations, Discount } from "./types";
import { createEmptyItem, calculateInvoiceData } from "./utils";
import { 
  saveAddressToHistory, 
  getAddressesHistory
} from './services/addressesHistory';

export default function InvoiceGenerator() {
  const [company, setCompany] = useState<Address>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("companyData");
      return saved
        ? JSON.parse(saved)
        : {
            name: "",
            nif: "",
            email: "",
            address: "",
            city: "",
            province: "Madrid",
            countryCode: "ES",
            zipCode: "",
          };
    }
    return {
      name: "",
      nif: "",
      email: "",
      address: "",
      city: "",
      province: "Madrid",
      countryCode: "ES",
      zipCode: "",
    };
  });

  const [customer, setCustomer] = useState<Address>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customerData");
      return saved
        ? JSON.parse(saved)
        : {
            name: "",
            nif: "",
            email: "",
            address: "",
            city: "",
            province: "Madrid",
            countryCode: "ES",
            zipCode: "",
          };
    }
    return {
      name: "",
      nif: "",
      email: "",
      address: "",
      city: "",
      province: "Madrid",
      countryCode: "ES",
      zipCode: "",
    };
  });

  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("invoiceData");
      return saved
        ? JSON.parse(saved)
        : {
            series: "",
            number: "",
            issueDate: new Date().toISOString().split("T")[0],
            operationDate: new Date().toISOString().split("T")[0],
            dueDate: new Date().toISOString().split("T")[0],
            dueDays: 0,
          };
    }
    return {
      series: "",
      number: "",
      issueDate: new Date().toISOString().split("T")[0],
      operationDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      dueDays: 0,
    };
  });

  const [items, setItems] = useState<Item[]>([createEmptyItem(1)]);
  const [showLineDiscounts, setShowLineDiscounts] = useState(false);
  const [showGlobalDiscount, setShowGlobalDiscount] = useState(false);
  const [showHeaderText, setShowHeaderText] = useState(true);
  const [showFooterText, setShowFooterText] = useState(true);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [discount, setDiscount] = useState<Discount>({
    amount: 0,
    type: "fixed",
    showInDocument: true,
  });

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    "classic" | "modern" | "minimalist"
  >("classic");
  const printRef = useRef<HTMLDivElement>(null);

  const [companyLogo, setCompanyLogo] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("invoiceGeneratorData");
      if (savedData) {
        const data = JSON.parse(savedData);
        return data.companyLogo || null;
      }
    }
    return null;
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => {
      // Guardar tanto el emisor como el receptor en el historial después de imprimir
      if (company.name.trim()) {
        saveAddressToHistory(company, 'emitter');
      }
      if (customer.name.trim()) {
        saveAddressToHistory(customer, 'customer');
      }
    },
    onPrintError: (error) => {
      console.error("Error printing:", error);
      alert("Error al imprimir. Por favor, inténtelo de nuevo.");
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("invoiceGeneratorData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setInvoiceData(data.invoiceData);
      setCompany(data.company);
      setCustomer(data.customer);
      setItems(data.items || [createEmptyItem(1)]);
      setDiscount(data.discount || {
        amount: 0,
        type: "fixed",
        showInDocument: true,
      });
      setShowLineDiscounts(data.showLineDiscounts || false);
      setShowHeaderText(data.showHeaderText || false);
      setShowFooterText(data.showFooterText || false);
      setHeaderText(data.headerText || "");
      setFooterText(data.footerText || "");
      setCompanyLogo(data.companyLogo || null);
    }
  }, []);

  // Asegurar que se inicializan los historiales de direcciones
  useEffect(() => {
    // Inicializar ambos historiales
    getAddressesHistory('emitter');
    getAddressesHistory('customer');
  }, []);

  const saveAllData = () => {
    if (typeof window !== "undefined") {
      // Guardar datos individuales
      localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
      localStorage.setItem("companyData", JSON.stringify(company));
      localStorage.setItem("customerData", JSON.stringify(customer));

      // Guardar todos los datos juntos
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
        footerText,
        companyLogo,
      };
      localStorage.setItem("invoiceGeneratorData", JSON.stringify(dataToSave));
    }
  };

  const handleGenerateInvoice = () => {
    // Guardar todos los datos
    saveAllData();
    
    // Guardar tanto el emisor como el receptor en el historial
    if (company.name.trim()) {
      saveAddressToHistory(company, 'emitter');
    }
    if (customer.name.trim()) {
      saveAddressToHistory(customer, 'customer');
    }
    
    // Mostrar el modal de plantillas
    setShowTemplateModal(true);
  };

  const handleReset = () => {
    // No borrar nada del localStorage, solo resetear el estado
    setInvoiceData({
      series: "",
      number: "",
      issueDate: new Date().toISOString().split("T")[0],
      operationDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      dueDays: 0,
    });

    setCustomer({
      name: "",
      nif: "",
      email: "",
      address: "",
      city: "",
      province: "Madrid",
      countryCode: "ES",
      zipCode: "",
    });

    setItems([createEmptyItem(1)]);
    setShowGlobalDiscount(false);
    setDiscount({ type: "fixed", amount: 0, showInDocument: true });
    setShowHeaderText(false);
    setHeaderText("");
    setShowFooterText(false);
    setFooterText("");
    // Do not reset the logo as it belongs to the company
  };

  const handleResetAll = () => {
    handleReset();

    setCompany({
      name: "",
      nif: "",
      email: "",
      address: "",
      city: "",
      province: "Madrid",
      countryCode: "ES",
      zipCode: "",
    });
    
    // Reset the logo when doing a full reset
    setCompanyLogo(null);
  };

  const handleFullReset = () => {
    // Realizar el reset de memoria
    handleResetAll();
    
    // Borrar también el localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("customerData");
      localStorage.removeItem("invoiceData");
      localStorage.removeItem("companyData");
      localStorage.removeItem("invoiceGeneratorData");
    }
  };

  const [calculations, setCalculations] = useState<InvoiceCalculations>(
    calculateInvoiceData(items)
  );

  useEffect(() => {
    const newCalculations = calculateInvoiceData(
      items,
      showGlobalDiscount ? discount : undefined
    );
    setCalculations(newCalculations);
  }, [items, discount, showGlobalDiscount]);

  return (
    <div className="wrapper">
      <Container>
        <h1 className="text-center mb-4">Crear factura online gratis</h1>
        <p className="lead mb-5">
          Con el generador de facturas online de Palbin puedes <strong>emitir tus propias facturas online</strong> sin necesidad de descargar ni instalar ningún programa.
        </p>
        <Row className="mb-4">
          <Col md={12}>
            <InvoiceHeader 
              invoiceData={invoiceData} 
              onInvoiceDataChange={setInvoiceData} 
              logo={companyLogo}
              onLogoChange={setCompanyLogo}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <AddressForm 
              title="Datos del Emisor" 
              address={company} 
              onAddressChange={setCompany} 
            />
          </Col>
          <Col md={6}>
            <AddressForm title="Datos del Receptor" address={customer} onAddressChange={setCustomer} />
          </Col>
        </Row>
        <ItemsTable items={items} onItemsChange={setItems} showLineDiscounts={showLineDiscounts} onShowLineDiscountsChange={setShowLineDiscounts} showGlobalDiscount={showGlobalDiscount} onShowGlobalDiscountChange={setShowGlobalDiscount} discount={discount} onDiscountChange={setDiscount} calculations={calculations} showHeaderText={showHeaderText} onShowHeaderTextChange={setShowHeaderText} headerText={headerText} onHeaderTextChange={setHeaderText} showFooterText={showFooterText} onShowFooterTextChange={setShowFooterText} footerText={footerText} onFooterTextChange={setFooterText} />
        <div className="d-flex gap-3 mb-4">
          <ButtonGroup size="lg">
            <Button variant="outline-secondary" onClick={handleReset}>
              Nueva Factura
            </Button>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic" />
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={handleFullReset} className="text-danger">
                  Reiniciar todo el formulario
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
          <Button variant="primary" size="lg" className="flex-grow-1" onClick={handleGenerateInvoice}>
            Generar factura
          </Button>
        </div>
        <InvoicePreview show={showTemplateModal} onHide={() => setShowTemplateModal(false)} onPrint={handlePrint} selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} invoiceData={invoiceData} company={company} customer={customer} items={items} showLineDiscounts={showLineDiscounts} showGlobalDiscount={showGlobalDiscount} headerText={headerText} showHeaderText={showHeaderText} footerText={footerText} showFooterText={showFooterText} calculations={calculations} printRef={printRef} companyLogo={companyLogo} />
      </Container>

      {/* Sección de reviews - separador */}
      <div className="reviews-section mt-7 py-5 bg-light border-top border-bottom">
        <Container className="text-center">
          <h2 className="mb-4">¡Únete a miles de usuarios que generan facturas online!</h2>
          
          <div className="stars-container mb-2">
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-half fs-3 text-warning mx-1"></i>
          </div>
          
          <p className="text-muted">4.67 / 5 promedio de 293 valoraciones</p>
        </Container>
      </div>
      
      <div className="tool-description py-5 mt-5">
        <Container>
          
          {/* Sección de características */}
          <h3 className="h4 mb-4 text-center">Características principales del generador de facturas online</h3>
          
          <Row className="row-cols-1 row-cols-md-3 g-4 mb-5">
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-file-earmark-text fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Facturas Personalizadas</h5>
                  <p className="card-text">Genera facturas profesionales con tu información de empresa y logo personalizado.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-grid-3x3 fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Múltiples Plantillas</h5>
                  <p className="card-text">Selección entre diferentes diseños de plantillas para adaptarse a tus necesidades comerciales.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-images fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Añade tu Logo</h5>
                  <p className="card-text">Incorpora fácilmente el logotipo de tu empresa para dar un aspecto más profesional a tus facturas.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-cart-plus fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Gestión de Elementos</h5>
                  <p className="card-text">Añade, edita y elimina fácilmente productos o servicios en tus facturas.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-calculator fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Cálculo Automático</h5>
                  <p className="card-text">Suma automática de subtotales, impuestos y totales finales.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-percent fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Personalización de Impuestos</h5>
                  <p className="card-text">Configura diferentes tipos de impuestos (IVA, IGIC) y porcentajes aplicables.</p>
                </div>
              </div>
            </Col>
            
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-file-earmark-text-fill fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Notas Personalizables</h5>
                  <p className="card-text">Añade información adicional, condiciones de pago o notas específicas.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-people fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Gestión de múltiples clientes</h5>
                  <p className="card-text">Almacena y gestiona información de tus clientes para futuras facturas.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-filetype-pdf fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Exportación a PDF</h5>
                  <p className="card-text">Descarga tus facturas en formato PDF de alta calidad listas para enviar.</p>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Sección de FAQs */}
          <h3 className="mt-5 mb-4 text-center">Preguntas Frecuentes</h3>
          
          <style>
            {`
              .faq-accordion .accordion-item {
                border: none;
                margin-bottom: 8px;
              }
              .faq-accordion .accordion-button {
                font-weight: bold;
                box-shadow: none;
                border-bottom: 1px solid rgba(0,0,0,0.1);
              }
              .faq-accordion .accordion-button:not(.collapsed) {
                color: inherit;
                background-color: transparent;
                box-shadow: none;
              }
              .faq-accordion .accordion-button:focus {
                box-shadow: none;
              }
            `}
          </style>
          
          <Accordion defaultActiveKey="0" className="mb-5 faq-accordion">
          <Accordion.Item eventKey="0">
              <Accordion.Header>
                ¿Cómo emitir facturas online?
              </Accordion.Header>
              <Accordion.Body>
                Utilizar nuestra herramienta para emitir facturas gratis es muy sencillo. Tan solo necesitas rellenar los campos con la información correspondiente, clicar en el botón &ldquo;generar factura&rdquo; y escoger una plantilla de visualización para poder descargar e imprimir tu factura.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                ¿Puedo generar facturas online sin ser autónomo?
              </Accordion.Header>
              <Accordion.Body>
                Puedes generar y emitir facturas sin necesidad de estar dado de alta como autónomo. Para ello, necesitas estar dado de alta en el registro de actividades económicas, rellenando el modelo 036 o 037. Eso sí, ten en cuenta que esta actividad tiene que ser ocasional y no puede ser tu fuente de ingresos principal.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>
                ¿Es completamente gratuita la herramienta de generación de facturas?
              </Accordion.Header>
              <Accordion.Body>
                Sí, nuestra herramienta de generación de facturas es completamente gratuita. Puedes crear, personalizar y descargar todas las facturas que necesites sin ningún coste oculto.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                ¿Necesito crear una cuenta para usar el generador de facturas?
              </Accordion.Header>
              <Accordion.Body>
                No es necesario crear una cuenta para utilizar la herramienta básica de generación de facturas. Sin embargo, si deseas guardar tus plantillas o acceder a características avanzadas, te recomendamos registrarte para mantener tus datos seguros.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                ¿Las facturas generadas son legalmente válidas?
              </Accordion.Header>
              <Accordion.Body>
                Sí, las facturas generadas cumplen con los requisitos fiscales básicos. Sin embargo, te recomendamos verificar la normativa específica de tu país o región, ya que los requisitos legales pueden variar.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                ¿Puedo personalizar el logotipo y los colores de mi factura?
              </Accordion.Header>
              <Accordion.Body>
                Absolutamente. Nuestra herramienta te permite subir tu propio logotipo de empresa y personalizar los colores para adaptarlos a tu marca e identidad corporativa.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                ¿Cómo puedo guardar mis facturas para futuras referencias?
              </Accordion.Header>
              <Accordion.Body>
                Puedes descargar tus facturas en formato PDF para guardarlas en tu dispositivo. Si creas una cuenta, también tendrás la opción de guardar tus plantillas y facturas en nuestro sistema para acceder a ellas posteriormente.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="8">
              <Accordion.Header>
                ¿Es posible enviar facturas directamente desde la plataforma?
              </Accordion.Header>
              <Accordion.Body>
                Actualmente, la herramienta está enfocada en la generación y descarga de facturas. Para enviarlas, puedes utilizar tu correo electrónico habitual adjuntando el PDF generado.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="9">
              <Accordion.Header>
                ¿Qué tipos de impuestos puedo incluir en mis facturas?
              </Accordion.Header>
              <Accordion.Body>
                La herramienta soporta diferentes tipos de impuestos como IVA e IGIC, con la posibilidad de configurar los porcentajes según tus necesidades. También puedes añadir impuestos personalizados específicos para tu negocio o región.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="10">
              <Accordion.Header>
                ¿Puedo generar facturas en diferentes idiomas?
              </Accordion.Header>
              <Accordion.Body>
                Sí, la herramienta permite crear facturas en varios idiomas. Puedes personalizar todos los textos y términos para adaptarlos al idioma que necesites.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="11">
              <Accordion.Header>
                ¿Hay algún límite en el número de elementos que puedo incluir en una factura?
              </Accordion.Header>
              <Accordion.Body>
                No existe un límite práctico para el número de productos o servicios que puedes incluir en una factura. La herramienta está diseñada para manejar eficientemente facturas tanto simples como complejas.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="12">
              <Accordion.Header>
                ¿Cómo puedo crear una serie de numeración específica para mis facturas?
              </Accordion.Header>
              <Accordion.Body>
                La herramienta te permite personalizar el formato y prefijos de numeración de tus facturas. Puedes establecer un sistema como &ldquo;2023-001&rdquo; o cualquier otro formato que se adapte a las necesidades de tu negocio, manteniendo una secuencia organizada y profesional.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <div className="text-center">
            <p>
              Con el generador de facturas online de Palbin puedes <strong>emitir tus propias facturas online</strong> sin necesidad de descargar ni instalar ningún programa. Si estabas buscando una app para crear facturas gratis, puedes guardarnos en favoritos, ya que con esta herramienta podrás generarlas fácilmente.
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
