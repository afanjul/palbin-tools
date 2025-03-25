import { Item, InvoiceCalculations, TaxBreakdown } from './types';

export function createEmptyItem(id: number): Item {
  return {
    id,
    concept: "",
    description: "",
    quantity: 1,
    price: 0,
    taxAmount: 21,
    discount: 0,
    editingPrice: "0",
    editingTotal: "0",
  };
}

export function calculateLineTotal(
  quantity: number,
  price: number,
  taxAmount: number,
  discount: number = 0
): number {
  const subtotal = quantity * price;
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  return taxableAmount * (1 + taxAmount / 100);
}

export function calculateInvoiceData(items: Item[], discount?: { amount: number; type: 'fixed' | 'percentage' }): InvoiceCalculations {
  // 1. Calculate subtotal without discount
  const subtotalWithoutDiscount = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  // 2. Calculate product discount
  const productDiscountAmount = items.reduce((acc, item) => {
    const lineSubtotal = item.quantity * item.price;
    return acc + lineSubtotal * (item.discount / 100);
  }, 0);

  // 3. Calculate global discount
  const baseForGlobalDiscount = subtotalWithoutDiscount - productDiscountAmount;
  let globalDiscountAmount = 0;
  
  if (discount && discount.amount > 0) {
    if (discount.type === 'fixed') {
      globalDiscountAmount = discount.amount;
    } else if (discount.type === 'percentage') {
      globalDiscountAmount = baseForGlobalDiscount * (discount.amount / 100);
    }
  }

  // 4. Calculate final subtotal
  const subtotal = subtotalWithoutDiscount - productDiscountAmount - globalDiscountAmount;

  // 5. Calculate tax breakdown
  const taxBreakdown: TaxBreakdown = {};
  const totalAfterDiscounts = subtotal;
  const discountRatio = totalAfterDiscounts / (subtotalWithoutDiscount || 1);

  items.forEach((item) => {
    const lineSubtotal = item.quantity * item.price;
    const lineSubtotalAfterDiscount = lineSubtotal * discountRatio;
    const taxRate = item.taxAmount.toString();

    if (!taxBreakdown[taxRate]) {
      taxBreakdown[taxRate] = { base: 0, amount: 0 };
    }

    taxBreakdown[taxRate].base += lineSubtotalAfterDiscount;
    taxBreakdown[taxRate].amount += lineSubtotalAfterDiscount * (item.taxAmount / 100);
  });

  // 6. Calculate total taxes
  const totalTaxes = Object.values(taxBreakdown).reduce(
    (acc, tax) => acc + tax.amount,
    0
  );

  // 7. Calculate final total
  const total = subtotal + totalTaxes;

  return {
    subtotalWithoutDiscount,
    productDiscountAmount,
    globalDiscountAmount,
    subtotal,
    taxBreakdown,
    totalTaxes,
    total,
  };
} 