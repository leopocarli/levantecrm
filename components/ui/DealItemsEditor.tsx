import React, { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { DealItem, Product } from '@/types';
import { formatInputCurrency, parseCurrencyInput } from '@/lib/utils';

interface DealItemsEditorProps {
  items: DealItem[];
  onChange: (items: DealItem[]) => void;
  products: Product[];
}

export const DealItemsEditor: React.FC<DealItemsEditorProps> = ({ items, onChange, products }) => {
  const [showAdd, setShowAdd] = useState(false);

  const activeProducts = products.filter(p => p.active !== false);

  const addFromCatalog = (product: Product) => {
    const newItem: DealItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
    };
    onChange([...items, newItem]);
    setShowAdd(false);
  };

  const addCustomItem = () => {
    const newItem: DealItem = {
      id: crypto.randomUUID(),
      productId: '',
      name: '',
      quantity: 1,
      price: 0,
    };
    onChange([...items, newItem]);
    setShowAdd(false);
  };

  const updateItem = (id: string, updates: Partial<DealItem>) => {
    onChange(items.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
          <Package size={14} />
          Produtos / Serviços
        </label>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1"
        >
          <Plus size={14} />
          Adicionar
        </button>
      </div>

      {showAdd && (
        <div className="mb-3 p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          {activeProducts.length > 0 && (
            <>
              <p className="text-xs font-medium text-slate-500">Do catálogo:</p>
              <div className="flex flex-wrap gap-1.5">
                {activeProducts.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addFromCatalog(p)}
                    className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 transition-colors"
                  >
                    {p.name} – R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
            </>
          )}
          <button
            type="button"
            onClick={addCustomItem}
            className="text-xs text-primary-600 hover:text-primary-500 font-medium"
          >
            + Item personalizado
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Nome"
                value={item.name}
                onChange={e => updateItem(item.id, { name: e.target.value })}
                className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateItem(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                className="w-14 text-sm text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-1 py-1 outline-none text-slate-900 dark:text-white"
                title="Quantidade"
              />
              <span className="text-xs text-slate-400">×</span>
              <input
                type="text"
                inputMode="numeric"
                value={formatInputCurrency(String(Math.round(item.price * 100)))}
                onChange={e => updateItem(item.id, { price: parseCurrencyInput(formatInputCurrency(e.target.value)) })}
                className="w-24 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 outline-none text-slate-900 dark:text-white"
                title="Preço unitário"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
};
