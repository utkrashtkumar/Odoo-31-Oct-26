"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ControlPanel } from "@/components/layout/ControlPanel";
import { CommandPalette } from "@/components/common/CommandPalette";
import { initialProducts } from "@/lib/data-store";
import { formatMoney } from "@/lib/utils";
import { Package, Plus, Sparkles, X } from "lucide-react";
import { Product, ProductType } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form states
  const [name, setName] = useState("");
  const [type, setType] = useState<"software_license" | "add_on" | "service">("software_license");
  const [salesPrice, setSalesPrice] = useState("120.00");
  const [costPrice, setCostPrice] = useState("35.00");
  const [variantName, setVariantName] = useState("Brand Edition");
  const [variantValue, setVariantValue] = useState("Odoo Enterprise Edition");
  const [variantSurcharge, setVariantSurcharge] = useState("560.00");
  const [notes, setNotes] = useState("");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      type,
      sales_price: parseFloat(salesPrice) || 0,
      cost_price: parseFloat(costPrice) || 0,
      notes: notes.trim() || null,
      is_active: true,
      variants: variantValue.trim()
        ? [
            {
              id: `var-${Date.now()}`,
              product_id: `prod-${Date.now()}`,
              attribute_name: variantName.trim() || "Brand",
              attribute_value: variantValue.trim(),
              price_surcharge: parseFloat(variantSurcharge) || 0,
            },
          ]
        : [],
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    setName("");
    setNotes("");
  };

  const filteredProducts = products.filter((p) => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-odoo-canvas">
      <Navbar currentApp="Products & Variants" />

      <ControlPanel
        breadcrumbs={[{ label: "Brightloop Catalog", href: "/products" }, { label: "Products & Brand Variants" }]}
        newButtonLabel="Add Product"
        onNewClick={() => setIsModalOpen(true)}
        searchPlaceholder="Search product name..."
        searchTerm={search}
        onSearchChange={setSearch}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg border border-odoo-border shadow-xs overflow-hidden">
          <div className="p-4 border-b border-odoo-border bg-gray-50/70 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Package className="w-4 h-4 text-odoo-purple" />
                <span>Product Catalog & Variant Matrix</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                PDF Requirement: Manage name, type, sales price, cost price, notes, and variants (e.g. Odoo brand adds +$560).
              </p>
            </div>
            <span className="text-xs font-semibold text-odoo-purple bg-odoo-purple-subtle px-2.5 py-1 rounded border border-odoo-purple/20">
              {products.length} Products Configured
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100/70 text-gray-600 uppercase text-[10px] font-semibold border-b border-odoo-border">
                <tr>
                  <th className="px-4 py-2.5">Product Name</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5 text-right">Base Sales Price</th>
                  <th className="px-4 py-2.5 text-right">Cost Price</th>
                  <th className="px-4 py-2.5">Configured Variants (Brand / Editions)</th>
                  <th className="px-4 py-2.5">Internal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-odoo-border">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-odoo-canvas transition">
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {prod.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prod.type === "software_license"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : prod.type === "add_on"
                          ? "bg-teal-100 text-teal-800 border border-teal-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}>
                        {prod.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 font-mono">
                      {formatMoney(prod.sales_price)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 font-mono">
                      {formatMoney(prod.cost_price || 0)}
                    </td>
                    <td className="px-4 py-3">
                      {prod.variants && prod.variants.length > 0 ? (
                        <div className="space-y-1">
                          {prod.variants.map((v) => (
                            <div key={v.id} className="inline-flex items-center space-x-1.5 bg-odoo-purple-subtle text-odoo-purple-dark text-[11px] font-semibold px-2 py-0.5 rounded border border-odoo-purple/20 mr-1.5">
                              <Sparkles className="w-3 h-3 text-odoo-purple" />
                              <span>{v.attribute_value}</span>
                              <span className="text-odoo-purple font-bold">
                                (+{formatMoney(v.price_surcharge)})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Single Edition (No variants)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {prod.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Product & Variant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-odoo-border overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-odoo-border">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-odoo-purple" />
                <span>Launch New Product / Variant (PDF Spec)</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brightloop CRM Professional"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ProductType)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple bg-white"
                  >
                    <option value="software_license">Software License</option>
                    <option value="add_on">Add-on</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sales Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple font-mono"
                  />
                </div>
              </div>

              {/* Variant Specification (PDF Rule: Odoo brand adds +560) */}
              <div className="bg-odoo-purple-subtle/50 p-3 rounded border border-odoo-purple/20 space-y-2">
                <span className="font-bold text-[11px] text-odoo-purple-dark uppercase tracking-wider block">
                  Product Variant (e.g. Brand Edition Surcharge)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Attribute (e.g. Brand)"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    className="p-1.5 border border-odoo-border rounded bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Odoo Edition)"
                    value={variantValue}
                    onChange={(e) => setVariantValue(e.target.value)}
                    className="p-1.5 border border-odoo-border rounded bg-white text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Surcharge (+$560)"
                    value={variantSurcharge}
                    onChange={(e) => setVariantSurcharge(e.target.value)}
                    className="p-1.5 border border-odoo-border rounded bg-white text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Internal notes regarding terms or server requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-odoo-border rounded focus:outline-none focus:border-odoo-purple resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-odoo-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-odoo-border rounded hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-odoo-purple hover:bg-odoo-purple-dark text-white rounded font-bold transition shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CommandPalette />
    </div>
  );
}
