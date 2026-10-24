import { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

    const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}/status?status=${newStatus}`, {
        method: 'PUT',
      });

      // 🆕 Check karo ki backend ne error toh nahi diya
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      fetchOrders(); // Success hone par list refresh karo
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("❌ Status update failed: " + error.message);
    }
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#245b3b] mb-6">Order Management</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">Abhi tak koi order nahi aaya hai.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eaf0e5] text-[#245b3b]">
                <th className="p-4 border-b">Order ID</th>
                <th className="p-4 border-b">Customer</th>
                <th className="p-4 border-b">Total</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono font-bold">{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                    <p className="text-xs text-gray-400 max-w-[200px] truncate">{order.address}</p>
                  </td>
                  <td className="p-4 font-bold text-[#245b3b]">₹{order.totalAmount}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-gray-300 rounded p-2 text-sm font-semibold outline-none focus:border-[#245b3b]"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}