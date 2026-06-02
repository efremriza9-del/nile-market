import { useState, useEffect } from 'react';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiCheck, FiTruck } from 'react-icons/fi';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    API.get('/api/admin/stats').then(r => setStats(r.data));
    API.get('/api/admin/orders').then(r => setOrders(r.data));
    API.get('/api/admin/users').then(r => setUsers(r.data));
  }, []);

  const updateOrder = async (id, status) => {
    try {
      await API.put(`/api/admin/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Order updated!');
    } catch { toast.error('Update failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/api/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          {['overview', 'orders', 'users'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && stats && (
          <div className="stats-grid">
            <div className="stat-card"><FiUsers size={28} color="var(--primary)" /><div><h3>{stats.users}</h3><p>Total Users</p></div></div>
            <div className="stat-card"><FiPackage size={28} color="#8b5cf6" /><div><h3>{stats.products}</h3><p>Products</p></div></div>
            <div className="stat-card"><FiShoppingBag size={28} color="#f59e0b" /><div><h3>{stats.orders}</h3><p>Orders</p></div></div>
            <div className="stat-card"><FiDollarSign size={28} color="#10b981" /><div><h3>ETB {stats.revenue?.toLocaleString() || 0}</h3><p>Revenue</p></div></div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>ETB {order.totalPrice?.toLocaleString()}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select value={order.status} onChange={e => updateOrder(order._id, e.target.value)} className="status-select">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.role !== 'admin' && (
                        <button className="delete-btn" onClick={() => deleteUser(user._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
