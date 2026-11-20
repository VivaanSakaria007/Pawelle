import React, { useState } from 'react';
import { dbStore } from '../../services/store';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, Package, X } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => dbStore.getProducts());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(25);
  const [stock, setStock] = useState(50);
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('Coat & Bath Botanicals');
  const [imageUrl, setImageUrl] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku(`PWL-${Math.floor(100 + Math.random() * 900)}`);
    setPrice(28);
    setStock(40);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1608248597359-00965e64805e?auto=format&fit=crop&w=600&q=80');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setPrice(p.price);
    setStock(p.stock_quantity);
    setDescription(p.description);
    setImageUrl(p.image_url);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingProduct) {
      dbStore.updateProduct(editingProduct.id, {
        name: name.trim(),
        sku: sku.trim(),
        price: Number(price),
        stock_quantity: Number(stock),
        description: description.trim(),
        image_url: imageUrl
      });
      showToast(`Updated product: ${name}`);
    } else {
      dbStore.createProduct({
        name: name.trim(),
        slug,
        category_id: 'pcat-1',
        category_name: categoryName,
        sku: sku.trim(),
        price: Number(price),
        stock_quantity: Number(stock),
        description: description.trim(),
        image_url: imageUrl,
        is_active: true
      });
      showToast(`Added product: ${name}`);
    }

    setProducts(dbStore.getProducts());
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    dbStore.deleteProduct(id);
    setProducts(dbStore.getProducts());
    showToast('Product removed from catalog.');
  };

  const handleQuickStockUpdate = (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock_quantity + delta);
    dbStore.updateProduct(p.id, { stock_quantity: newStock });
    setProducts(dbStore.getProducts());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Apothecary Inventory &amp; Products</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Manage botanical wash SKUs, retail pricing, inventory limits, and warehouse stocks.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {toastMsg && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Table */}
      <div className="card-surface" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Product</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>SKU</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Retail Price</th>
              <th style={{ padding: '14px 20px', textAlign: 'start' }}>Current Stock</th>
              <th style={{ padding: '14px 20px', textAlign: 'end' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={p.image_url} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{p.category_name}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace' }}>{p.sku}</td>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--color-forest)' }}>
                  £{p.price}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleQuickStockUpdate(p, -5)}
                      style={{ padding: '2px 8px', border: '1px solid var(--color-border)', background: 'none', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                    >
                      -5
                    </button>
                    <span style={{ fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>{p.stock_quantity}</span>
                    <button
                      onClick={() => handleQuickStockUpdate(p, 5)}
                      style={{ padding: '2px 8px', border: '1px solid var(--color-border)', background: 'none', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
                    >
                      +5
                    </button>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'end' }}>
                  <button onClick={() => handleOpenEdit(p)} className="btn btn-secondary btn-sm" style={{ marginInlineEnd: '8px' }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(20, 25, 22, 0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card-surface" style={{ maxWidth: '520px', width: '100%', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add Apothecary Item'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Price (£)</label>
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Initial Stock Units</label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
