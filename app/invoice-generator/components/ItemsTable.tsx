import { Form, Table, Button, Row, Col, Card } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import { Item, InvoiceCalculations, Discount } from '../types';
import { calculateLineTotal } from '../utils';

interface ItemsTableProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
  showLineDiscounts: boolean;
  onShowLineDiscountsChange: (show: boolean) => void;
  showGlobalDiscount: boolean;
  onShowGlobalDiscountChange: (show: boolean) => void;
  discount: Discount;
  onDiscountChange: (discount: Discount) => void;
  calculations: InvoiceCalculations;
  showHeaderText: boolean;
  onShowHeaderTextChange: (show: boolean) => void;
  headerText: string;
  onHeaderTextChange: (text: string) => void;
  showFooterText: boolean;
  onShowFooterTextChange: (show: boolean) => void;
  footerText: string;
  onFooterTextChange: (text: string) => void;
}

export function ItemsTable({
  items,
  onItemsChange,
  showLineDiscounts,
  onShowLineDiscountsChange,
  showGlobalDiscount,
  onShowGlobalDiscountChange,
  discount,
  onDiscountChange,
  calculations,
  showHeaderText,
  onShowHeaderTextChange,
  headerText,
  onHeaderTextChange,
  showFooterText,
  onShowFooterTextChange,
  footerText,
  onFooterTextChange,
}: ItemsTableProps) {
  const handleQuantityChange = (id: number, value: string) => {
    const quantity = parseFloat(value) || 0;
    onItemsChange(
      items.map((item) => {
        if (item.id === id) {
          const newTotal = calculateLineTotal(
            quantity,
            item.price,
            item.taxAmount,
            item.discount
          );
          return {
            ...item,
            quantity,
            editingTotal: newTotal.toFixed(2),
          };
        }
        return item;
      })
    );
  };

  const handleTaxChange = (id: number, value: string) => {
    const taxAmount = parseInt(value);
    onItemsChange(
      items.map((item) => {
        if (item.id === id) {
          const newTotal = calculateLineTotal(
            item.quantity,
            item.price,
            taxAmount,
            item.discount
          );
          return {
            ...item,
            taxAmount,
            editingTotal: newTotal.toFixed(2),
          };
        }
        return item;
      })
    );
  };

  const handleDiscountChange = (id: number, value: string) => {
    const discountValue = parseFloat(value) || 0;
    onItemsChange(
      items.map((item) => {
        if (item.id === id) {
          const newTotal = calculateLineTotal(
            item.quantity,
            item.price,
            item.taxAmount,
            discountValue
          );
          return {
            ...item,
            discount: discountValue,
            editingTotal: newTotal.toFixed(2),
          };
        }
        return item;
      })
    );
  };

  const handlePriceChange = (id: number, value: string) => {
    const price = parseFloat(value) || 0;
    onItemsChange(
      items.map((item) => {
        if (item.id === id) {
          const newTotal = calculateLineTotal(
            item.quantity,
            price,
            item.taxAmount,
            item.discount
          );
          return {
            ...item,
            editingPrice: value,
            price: price,
            editingTotal: newTotal.toFixed(2),
          };
        }
        return item;
      })
    );
  };

  const handleFieldBlur = (id: number, field: "price" | "total") => {
    onItemsChange(
      items.map((item) => {
        if (item.id === id) {
          const value = parseFloat(item.editingPrice) || 0;
          const newTotal = calculateLineTotal(
            item.quantity,
            value,
            item.taxAmount,
            item.discount
          );

          return {
            ...item,
            price: value,
            editingTotal: newTotal.toFixed(2),
          };
        }
        return item;
      })
    );
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      concept: "",
      description: "",
      quantity: 1,
      price: 0,
      taxAmount: 21,
      discount: 0,
      editingPrice: "0",
      editingTotal: "0",
    };
    onItemsChange([...items, newItem]);
  };

  const deleteItem = (id: number) => {
    if (id === 1) {
      onItemsChange(
        items.map((item) =>
          item.id === 1
            ? {
                ...item,
                concept: "",
                description: "",
                quantity: 1,
                price: 0,
                taxAmount: 21,
                discount: 0,
                editingPrice: "0",
                editingTotal: "0",
              }
            : item
        )
      );
    } else {
      onItemsChange(items.filter((item) => item.id !== id));
    }
  };

  return (
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
                {showLineDiscounts && <th className="col-1 text-end">Desc. %</th>}
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
                      onChange={(e) =>
                        onItemsChange(
                          items.map((i) =>
                            i.id === item.id
                              ? { ...i, concept: e.target.value }
                              : i
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        onItemsChange(
                          items.map((i) =>
                            i.id === item.id
                              ? { ...i, description: e.target.value }
                              : i
                          )
                        )
                      }
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
                      onBlur={() => handleFieldBlur(item.id, "price")}
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
                        onChange={(e) =>
                          handleDiscountChange(item.id, e.target.value)
                        }
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
                  onChange={(e) => onShowHeaderTextChange(e.target.checked)}
                />
                {showHeaderText && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={headerText}
                    onChange={(e) => onHeaderTextChange(e.target.value)}
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
                  onChange={(e) => onShowFooterTextChange(e.target.checked)}
                />
                {showFooterText && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={footerText}
                    onChange={(e) => onFooterTextChange(e.target.value)}
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
                    <td className="text-end">
                      {calculations.subtotalWithoutDiscount.toFixed(2)}€
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <Form.Check
                        id="line-discounts-checkbox"
                        type="checkbox"
                        label="Descuento por línea"
                        checked={showLineDiscounts}
                        onChange={(e) => onShowLineDiscountsChange(e.target.checked)}
                      />
                    </th>
                    <td className="text-end">
                      {calculations.productDiscountAmount > 0
                        ? `-${calculations.productDiscountAmount.toFixed(2)}€`
                        : "0,00€"}
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
                          onChange={(e) => onShowGlobalDiscountChange(e.target.checked)}
                        />
                        {showGlobalDiscount && (
                          <>
                            <Form.Control
                              type="number"
                              value={discount.amount}
                              onChange={(e) =>
                                onDiscountChange({
                                  ...discount,
                                  amount: parseFloat(e.target.value) || 0,
                                })
                              }
                              min="0"
                              step="0.01"
                              size="sm"
                              style={{ width: "80px" }}
                            />
                            <Form.Select
                              value={discount.type}
                              onChange={(e) =>
                                onDiscountChange({
                                  ...discount,
                                  type: e.target.value as "fixed" | "percentage",
                                })
                              }
                              size="sm"
                              style={{ width: "60px" }}
                            >
                              <option value="percentage">%</option>
                              <option value="fixed">€</option>
                            </Form.Select>
                          </>
                        )}
                      </div>
                    </th>
                    <td className="text-end">
                      {showGlobalDiscount &&
                        calculations.globalDiscountAmount > 0 &&
                        `-${calculations.globalDiscountAmount.toFixed(2)}€`}
                    </td>
                  </tr>
                  <tr>
                    <th>Subtotal:</th>
                    <td className="text-end">{calculations.subtotal.toFixed(2)}€</td>
                  </tr>
                  {Object.entries(calculations.taxBreakdown).map(
                    ([taxRate, tax]) => (
                      <tr key={taxRate}>
                        <th>IVA ({taxRate}%):</th>
                        <td className="text-end">{tax.amount.toFixed(2)}€</td>
                      </tr>
                    )
                  )}
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
  );
} 