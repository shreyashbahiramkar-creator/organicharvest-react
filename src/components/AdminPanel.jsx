import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  // Form State (Stock add kiya)
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', unit: '', image: '', tag: '', stock: ''
  });
  
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Products List State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState(null);

  // 1. Products Fetch Karein
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://organicharvest-backend.onrender.com/api/products');
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

  // 2. Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Form Submit (Add OR Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const url = editingId 
      ? `https://organicharvest-backend.onrender.com/api/products/${editingId}` 
      : 'https://organicharvest-backend.onrender.com/api/products';             

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0 // 🆕 Stock ko integer mein convert kiya
        }),
      });

      if (res.ok) {
        setMessage(editingId ? '✅ Product updated successfully!' : '✅ Product added successfully!');
        setFormData({ name: '', category: '', price: '', unit: '', image: '', tag: '', stock: '' }); // 🆕 Reset
        setEditingId(null); 
        fetchProducts(); 
      } else {
        setMessage('❌ Operation failed.');
      }
    } catch (error) {
      setMessage('❌ Server error!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Delete Product Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Pakka is product ko delete karna hai?')) return;
    
    try {
      const res = await fetch(`https://organicharvest-backend.onrender.com/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        if (editingId === id) {
          setEditingId(null);
          setFormData({ name: '', category: '', price: '', unit: '', image: '', tag: '', stock: '' }); // 🆕 Reset
        }
      } else {
        alert('Delete failed!');
      }
    } catch (error) {
      console.error(error);
      alert('Server error!');
    }
  };

  // 5. Edit Button Click Handler
  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.image,
      tag: product.tag || '',
      stock: product.stock || 0 // 🆕 Stock load kiya
    });
    setEditingId(product.id);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit Handler
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: '', unit: '', image: '', tag: '', stock: '' }); // 🆕 Reset
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#245b3b]">Admin Dashboard</h1>
          <Link 
            to="/" 
            className="bg-[#245b3b] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            ← Back to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Add/Edit Product Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:underline">
                  Cancel
                </button>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="Organic Mango" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="Fruits" />
              </div>

              {/* 🆕 3 Columns: Price, Unit, Stock */}
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="150" />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit *</label>
                  <input type="text" name="unit" value={formData.unit} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="1 kg" />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL *</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tag (Optional)</label>
                <input type="text" name="tag" value={formData.tag} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#245b3b]" placeholder="Fresh" />
              </div>

              <button type="submit" disabled={isSubmitting}
                className={`w-full text-white font-bold px-4 py-2 rounded-lg transition disabled:opacity-50 mt-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#245b3b] hover:bg-green-800'}`}>
                {isSubmitting ? 'Processing...' : (editingId ? 'Update Product' : '+ Add Product')}
              </button>
            </form>
          </div>

          {/* Right Side: Products List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">All Products</h2>
            
            {loading ? (
              <p className="text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products found. Add one from the left!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                      <th className="p-3 font-medium">Product</th>
                      <th className="p-3 font-medium">Category</th>
                      <th className="p-3 font-medium">Price</th>
                      <th className="p-3 font-medium">Stock</th> {/* 🆕 Naya Column */}
                      <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className={`border-b hover:bg-gray-50 transition ${editingId === product.id ? 'bg-blue-50' : ''}`}>
                        <td className="p-3 flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                          <span className="font-medium text-sm text-gray-800">{product.name}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{product.category}</td>
                        <td className="p-3 text-sm font-semibold text-gray-800">₹{product.price}</td>
                        
                        {/* 🆕 Stock Column Data */}
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
    </div>
  );
}

export default AdminPanel;