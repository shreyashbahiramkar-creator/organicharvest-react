import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, PackageOpen } from 'lucide-react';

function AdminProducts() {
  const ADMIN_SECRET_KEY = 'OrganicHarvestAdmin123';
  const API_URL = 'https://organicharvest-backend.onrender.com/api/products';

  const [formData, setFormData] = useState({
    name: '', category: '', price: '', originalPrice: '', unit: '', image: '', tag: '', stock: ''
  });
  
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
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

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_SECRET_KEY 
        },
        body: JSON.stringify({ 
          ...formData, 
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock) || 0 
        }),
      });

      if (res.ok) {
        setMessage(editingId ? '✅ Product updated!' : '✅ Product added!');
        setFormData({ name: '', category: '', price: '', originalPrice: '', unit: '', image: '', tag: '', stock: '' }); 
        setEditingId(null); 
        fetchProducts(); 
      } else if (res.status === 401) {
        setMessage('❌ Unauthorized! Invalid Admin Key.');
      } else {
        setMessage('❌ Operation failed.');
      }
    } catch (error) {
      setMessage('❌ Server error!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Pakka is product ko delete karna hai?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': ADMIN_SECRET_KEY }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        if (editingId === id) handleCancelEdit();
      }
    } catch (error) {
      alert('Server error!');
    }
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name, category: product.category, price: product.price,
      originalPrice: product.originalPrice || '', unit: product.unit,
      image: product.image, tag: product.tag || '', stock: product.stock || 0 
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
    if (!bulkData.trim()) return alert('Please paste JSON data first.');
    setIsSubmitting(true);
    try {
      const parsedData = JSON.parse(bulkData);
      if (!Array.isArray(parsedData)) return alert('Data ek array [ ] format me hona chahiye!');

      const res = await fetch(`${API_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_SECRET_KEY },
        body: JSON.stringify(parsedData)
      });

      if (res.ok) {
        alert('✅ Bulk products added successfully!');
        setBulkData(''); 
        setShowBulkModal(false);
        fetchProducts(); 
      } else {
        alert('❌ Failed to add bulk products.');
      }
    } catch (err) {
      alert('❌ Invalid JSON format!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store's inventory</p>
        </div>
        <button 
          onClick={() => setShowBulkModal(true)}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Upload size={18} /> Bulk Upload
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Form */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            {editingId && (
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
          
          {message && (
            <div className={`p-3 mb-4 text-sm rounded-lg font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Organic Mango" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Fruits" />
            </div>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="150" />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Orig. Price</label>
                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} step="0.01" min="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="200" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Unit</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="1 kg" />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
              <input type="url" name="image" value={formData.image} onChange={handleChange} required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tag (Optional)</label>
              <input type="text" name="tag" value={formData.tag} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" placeholder="e.g. Fresh" />
            </div>

            <button type="submit" disabled={isSubmitting}
              className={`w-full text-white font-bold px-4 py-3 rounded-xl transition disabled:opacity-50 mt-2 flex justify-center items-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'}`}>
              {isSubmitting ? 'Processing...' : (editingId ? <><Edit2 size={18}/> Update Product</> : <><Plus size={18}/> Add Product</>)}
            </button>
          </form>
        </div>

        {/* Right Side: Products Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">All Products ({products.length})</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <PackageOpen size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500">No products found. Add one from the left!</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th> 
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors ${editingId === product.id ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                        <span className="font-semibold text-sm text-gray-800">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-bold text-gray-800">₹{product.price}</div>
                        {product.originalPrice && <div className="text-xs text-gray-400 line-through">₹{product.originalPrice}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {product.stock > 0 ? (
                          <span className="text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-md">{product.stock} left</span>
                        ) : (
                          <span className="text-red-500 font-bold bg-red-50 px-2.5 py-1 rounded-md">Out of Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Bulk Upload Products</h2>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Paste JSON array of products here.</p>
              <textarea 
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                rows="10"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 mb-4"
                placeholder='[{"name":"Apple","category":"Fruits","price":100,"originalPrice":150,"unit":"1 kg","stock":50,"image":"url"}]'
              ></textarea>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowBulkModal(false)} className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button onClick={handleBulkUpload} disabled={isSubmitting} className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Upload size={18} /> {isSubmitting ? 'Uploading...' : 'Upload Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;