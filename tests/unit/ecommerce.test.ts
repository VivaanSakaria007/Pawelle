import { describe, it, expect } from 'vitest';
import { dbStore } from '../../src/services/store';

describe('Ecommerce & Checkout Security Verification', () => {
  it('prevents order placement when inventory is insufficient', () => {
    const products = dbStore.getProducts();
    const targetProduct = products[0];
    expect(targetProduct).toBeDefined();

    const excessiveQuantity = targetProduct.stock_quantity + 999;

    expect(() => {
      dbStore.createOrder({
        customer_id: 'usr-buyer',
        customer_name: 'Luxury Buyer',
        customer_email: 'buyer@example.com',
        subtotal: 1000,
        shipping_amount: 0,
        tax_amount: 200,
        total_amount: 1000,
        currency: 'GBP',
        order_status: 'processing',
        payment_status: 'paid',
        shipping_address: {
          full_name: 'Luxury Buyer',
          address_line1: '10 Downing Street',
          city: 'London',
          postal_code: 'SW1A 2AA',
          country: 'United Kingdom',
          phone: '+44 20 7946 0000'
        },
        items: [
          {
            id: 'oi-excess',
            order_id: '',
            product_id: targetProduct.id,
            product_name_snapshot: targetProduct.name,
            unit_price_snapshot: targetProduct.price,
            quantity: excessiveQuantity,
            line_total: targetProduct.price * excessiveQuantity
          }
        ]
      });
    }).toThrow(/Insufficient stock/);
  });

  it('atomically decrements inventory upon successful order placement', () => {
    const products = dbStore.getProducts();
    const product = products.find(p => p.stock_quantity >= 5);
    expect(product).toBeDefined();
    if (!product) return;

    const initialStock = product.stock_quantity;
    const purchaseQty = 2;

    const order = dbStore.createOrder({
      customer_id: 'usr-buyer-2',
      customer_name: 'Verified Buyer',
      customer_email: 'buyer2@example.com',
      subtotal: product.price * purchaseQty,
      shipping_amount: 0,
      tax_amount: (product.price * purchaseQty) * 0.20,
      total_amount: product.price * purchaseQty,
      currency: 'GBP',
      order_status: 'processing',
      payment_status: 'paid',
      shipping_address: {
        full_name: 'Verified Buyer',
        address_line1: 'Mayfair Suite',
        city: 'London',
        postal_code: 'W1K 2PS',
        country: 'United Kingdom',
        phone: '+44 7946 0991'
      },
      items: [
        {
          id: `oi-${Date.now()}`,
          order_id: '',
          product_id: product.id,
          product_name_snapshot: product.name,
          unit_price_snapshot: product.price,
          quantity: purchaseQty,
          line_total: product.price * purchaseQty
        }
      ]
    });

    expect(order.id).toBeDefined();

    const refreshedProduct = dbStore.getProductById(product.id);
    expect(refreshedProduct?.stock_quantity).toBe(initialStock - purchaseQty);
  });
});
