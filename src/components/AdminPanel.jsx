import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../utils/api'; // 🆕 Axios instance import kiya

function AdminPanel() {
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', originalPrice: '', unit: '', image: '', tag: '', stock: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products'); // 🆕 api use kiya
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock) || 0
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload); // 🆕 api use kiya
      } else {
        await api.post('/products', payload); // 🆕 api use kiya
      }
      
      setMessage(editingId ? '✅ Product updated successfully!' : '✅ Product added successfully!');
      setFormData({ name: '', category: '', price: '', originalPrice: '', unit: '', image: '', tag: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setMessage('❌ Unauthorized! Admin access required.');
      } else {
        setMessage('❌ Operation failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Pakka is product ko delete karna hai?')) return;
    try {
      await api.delete(`/products/${id}`); // 🆕 api use kiya
      setProducts(prev => prev.filter(p => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: '', category: '', price: '', originalPrice: '', unit: '', image: '', tag: '', stock: '' });
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('Unauthorized! Admin access required.');
      } else {
        alert('Delete failed!');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ Kya aap pakka SAARE products delete karna chahte hain? Ye action undo nahi ho sakta!')) return;
    setIsSubmitting(true);
    try {
      await Promise.all(products.map(async (product) => {
        await api.delete(`/products/${product.id}`); // 🆕 api use kiya
      }));
      setProducts([]);
      alert('✅ Saare products successfully delete ho gaye!');
    } catch (error) {
      console.error(error);
      alert('❌ Kuch products delete nahi ho paye. Server error!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      unit: product.unit,
      image: product.image,
      tag: product.tag || '',
      stock: product.stock || 0
    });
    setEditingId(product.id);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: '', originalPrice: '', unit: '', image: '', tag: '', stock: '' });
    setMessage('');
  };

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      alert('Please paste JSON data first.');
      return;
    }
    setIsSubmitting(true);
    try {
      const parsedData = JSON.parse(bulkData);
      if (!Array.isArray(parsedData)) {
        alert('Data ek array ( [ ] ) format me hona chahiye!');
        setIsSubmitting(false);
        return;
      }
      
      await api.post('/products/bulk', parsedData); // 🆕 api use kiya
      
      alert('✅ Bulk products added successfully!');
      setBulkData('');
      fetchProducts();
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert('❌ Unauthorized! Admin access required.');
      } else if (err instanceof SyntaxError) {
        alert('❌ Invalid JSON format!');
      } else {
        alert('❌ Failed to add bulk products.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Add, edit and manage your store products.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: Add/Edit Form + Bulk */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:underline">Cancel</button>
              )}
            </div>

            {message && (
              <div className={`p-3 mb-4 text-sm rounded-lg font-medium ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="Organic Mango" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="Fruits" />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="150" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} step="0.01" min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="200" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit *</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="1 kg" />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL *</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tag (Optional)</label>
                <input type="text" name="tag" value={formData.tag} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]" placeholder="Fresh" />
              </div>
              <button type="submit" disabled={isSubmitting}
                className={`w-full text-white font-bold px-4 py-2.5 rounded-lg transition disabled:opacity-50 mt-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#0e2a1c] hover:bg-[#1a5c38]'}`}>
                {isSubmitting ? 'Processing...' : (editingId ? 'Update Product' : '+ Add Product')}
              </button>
            </form>

            {/* Bulk Upload */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Bulk Upload Products</h2>
              <p className="text-xs text-gray-500 mb-3">Paste JSON array of products here.</p>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-[#245b3b]/20 focus:border-[#245b3b]"
                placeholder='[{"name":"Apple","category":"Fruits","price":100,"unit":"1 kg","stock":50,"image":"url"}]'
              ></textarea>
              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading...' : 'Upload Bulk Products'}
              </button>
            </div>
          </div>

          {/* Right: Products List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">All Products ({products.length})</h2>
              {products.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  disabled={isSubmitting}
                  className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-1.5 rounded-lg text-sm font-bold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : '🗑️ Delete All'}
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products found. Add one from the left!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                      <th className="p-3 font-medium">Product</th>
                      <th className="p-3 font-medium">Category</th>
                      <th className="p-3 font-medium">Price</th>
                      <th className="p-3 font-medium">Stock</th>
                      <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className={`border-b hover:bg-gray-50 transition ${editingId === product.id ? 'bg-blue-50' : ''}`}>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border" />
                            <span className="font-medium text-sm text-gray-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{product.category}</td>
                        <td className="p-3 text-sm">
                          <div className="font-semibold text-gray-800">₹{product.price}</div>
                          {product.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">₹{product.originalPrice}</div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {product.stock > 0 ? (
                            <span className="text-green-600 font-bold">{product.stock}</span>
                          ) : (
                            <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Out of Stock</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded text-xs font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-xs font-bold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPanel;