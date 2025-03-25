"use client";
import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { InvoiceHeader } from "./components/InvoiceHeader";
import { AddressForm } from "./components/AddressForm";
import { ItemsTable } from "./components/ItemsTable";
import { InvoicePreview } from "./components/InvoicePreview";
import { InvoiceData, Address, Item, InvoiceCalculations, Discount } from "./types";
import { createEmptyItem, calculateInvoiceData } from "./utils";

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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => {
      // setShowTemplateModal(false);
    },
    onPrintError: (error) => {
      console.error("Error printing:", error);
      alert("Error al imprimir. Por favor, inténtelo de nuevo.");
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
      localStorage.setItem("companyData", JSON.stringify(company));
      localStorage.setItem("customerData", JSON.stringify(customer));
    }
  }, [invoiceData, company, customer]);

  useEffect(() => {
    const savedData = localStorage.getItem("invoiceGeneratorData");
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
      setHeaderText(data.headerText || "");
      setFooterText(data.footerText || "");
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
      footerText,
    };
    localStorage.setItem("invoiceGeneratorData", JSON.stringify(dataToSave));
  }, [
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
  ]);

  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customerData");
      localStorage.removeItem("invoiceData");
    }

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

    setItems([]);
    setShowGlobalDiscount(false);
    setDiscount({ type: "fixed", amount: 0, showInDocument: true });
    setShowHeaderText(false);
    setHeaderText("");
    setShowFooterText(false);
    setFooterText("");
  };

  const handleResetAll = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customerData");
      localStorage.removeItem("invoiceData");
      localStorage.removeItem("companyData");
    }

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
        <h1 className="text-center mb-4">Crear facturas online gratis</h1>
        <p className="lead">
          Con el generador de facturas online de Palbin puedes <strong>emitir tus propias facturas online</strong> sin necesidad de descargar ni instalar ningún programa.
        </p>
        <Row className="mb-4">
          <Col md={12}>
            <InvoiceHeader invoiceData={invoiceData} onInvoiceDataChange={setInvoiceData} />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6}>
            <AddressForm title="Datos del Emisor" address={company} onAddressChange={setCompany} />
          </Col>
          <Col md={6}>
            <AddressForm title="Datos del Receptor" address={customer} onAddressChange={setCustomer} />
          </Col>
        </Row>
        <ItemsTable items={items} onItemsChange={setItems} showLineDiscounts={showLineDiscounts} onShowLineDiscountsChange={setShowLineDiscounts} showGlobalDiscount={showGlobalDiscount} onShowGlobalDiscountChange={setShowGlobalDiscount} discount={discount} onDiscountChange={setDiscount} calculations={calculations} showHeaderText={showHeaderText} onShowHeaderTextChange={setShowHeaderText} headerText={headerText} onHeaderTextChange={setHeaderText} showFooterText={showFooterText} onShowFooterTextChange={setShowFooterText} footerText={footerText} onFooterTextChange={setFooterText} />
        <div className="d-flex gap-3 mb-4">
          <Button variant="primary" size="lg" className="flex-grow-1" onClick={() => setShowTemplateModal(true)}>
            Generar factura
          </Button>
          <ButtonGroup size="lg">
            <Button variant="outline-secondary" onClick={handleReset}>
              Nueva Factura
            </Button>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic" />
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={handleResetAll} className="text-danger">
                  Reiniciar todo el formulario
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        </div>
        <InvoicePreview show={showTemplateModal} onHide={() => setShowTemplateModal(false)} onPrint={handlePrint} selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} invoiceData={invoiceData} company={company} customer={customer} items={items} showLineDiscounts={showLineDiscounts} showGlobalDiscount={showGlobalDiscount} headerText={headerText} showHeaderText={showHeaderText} footerText={footerText} showFooterText={showFooterText} calculations={calculations} printRef={printRef} />
      </Container>
      <div className="tool-description bg-light py-5 mt-5">
        <Container>
          <h2 className="h4 mt-4">Generador de facturas</h2>
          <p>
            Con el generador de facturas online de Palbin puedes <strong>emitir tus propias facturas online</strong> sin necesidad de descargar ni instalar ningún programa. Si estabas buscando una app para crear facturas gratis, puedes guardarnos en favoritos, ya que con esta herramienta podrás generarlas fácilmente.
          </p>
          <h2 className="h4 mt-4">¿Cómo emitir facturas online?</h2>
          <p>
            Utilizar nuestra herramienta para emitir facturas gratis es muy sencillo. Tan solo necesitas <strong>rellenar los campos con la información correspondiente</strong>, clicar en el botón “generar factura” y escoger una plantilla de visualización para poder descargar e imprimir tu factura.
          </p>
          <h2 className="h4 mt-4">¿Puedo generar facturas online sin ser autónomo?</h2>
          <p>
            Puedes generar y emitir facturas sin necesidad de estar dado de alta como autónomo. Para ello, necesitas <strong>estar dado de alta en el registro de actividades económicas</strong>, rellenando el modelo 036 o 037. Eso sí, ten en cuenta que esta actividad tiene que ser ocasional y no puede ser tu fuente de ingresos principal.
          </p>
        </Container>
      </div>
    </div>
  );
}
