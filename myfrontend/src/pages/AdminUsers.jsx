import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Trash2, Shield, User, ChevronDown, XCircle, LogOut
} from "lucide-react";
import api from "../utils/api";
import "./AdminDashboard.css"; // Reuse common styles or specific ones

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      if (err.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      const res = await api.post(`/admin/users/${id}/toggle-verify`);
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: res.data.data.isVerified } : u));
    } catch (err) {
      alert("Failed to toggle verification");
    }
  };

  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/admin/users/${editUser._id}`, editUser);
      setUsers(users.map(u => u._id === editUser._id ? editUser : u));
      setShowEditModal(false);
      alert("User updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "verified") return matchesSearch && u.isVerified;
    if (filter === "unverified") return matchesSearch && !u.isVerified;
    return matchesSearch;
  });

  return (
    <div className="admin-layout">
      {/* GLOBAL NAV */}
      <nav className="global-nav">
        <div className="global-nav-content">
          <div className="admin-logo">
            <Shield size={16} color="#ffffff" fill="#ffffff" />
            <span>Shaadi Admin</span>
          </div>
          <div className="global-nav-links">
            <button className="nav-link" onClick={() => navigate('/admin-dashboard')}>Dashboard</button>
            <button className="nav-link active">Users</button>
            <button className="nav-link" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </nav>

      {/* SUB NAV FROSTED */}
      <div className="sub-nav-frosted">
        <div className="sub-nav-content">
          <h1 className="sub-nav-title">User Management</h1>
          <div className="sub-nav-actions">
            <div className="search-input-wrapper">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                className="search-input"
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-wrapper">
              <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="admin-main">
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Contact</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar">
                        {user.photos?.[0]?.url ? <img src={user.photos[0].url} alt="" /> : <User size={18} />}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">{user._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div>{user.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{user.phone}</div>
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`status-chip ${user.isVerified ? 'verified' : 'unverified'}`}
                      onClick={() => handleToggleVerify(user._id)}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="button-pearl-capsule" onClick={() => handleEditClick(user)}>Edit</button>
                      <button className="button-icon-circular delete" onClick={() => handleDelete(user._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* EDIT MODAL (Simplified) */}
      {showEditModal && editUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><XCircle size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="modal-input">
                  <label>Full Name</label>
                  <input type="text" value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} />
                </div>
                <div className="modal-input">
                  <label>Email</label>
                  <input type="email" value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button-primary" onClick={handleUpdateUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
