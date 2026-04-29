import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Edit2, Trash2, CheckCircle, XCircle, 
  Filter, LogOut, Shield, ChevronLeft, ChevronRight, User
} from "lucide-react";
import api from "../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
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
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
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
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.phone?.includes(searchTerm);
    
    if (filter === "verified") return matchesSearch && u.isVerified;
    if (filter === "unverified") return matchesSearch && !u.isVerified;
    return matchesSearch;
  });

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Shield size={24} color="#6B3F69" fill="#6B3F69" />
          <span>Shaadi Admin</span>
        </div>
        <nav className="admin-nav">
          <button className="nav-item active"><Users size={20} /> Users</button>
          {/* Add more admin sections here in future */}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>User Management</h1>
          <div className="admin-header-actions">
            <div className="admin-search">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filter">
              <Filter size={18} />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Users</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner"></div>
            <p>Fetching users...</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Info</th>
                  <th>Profile Details</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar">
                          {user.photos?.[0]?.url ? (
                            <img src={user.photos[0].url} alt="" />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: {user._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <div className="cell-email">{user.email}</div>
                        <div className="cell-phone">{user.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="details-cell">
                        <span>{user.gender} • {user.religion}</span>
                        <span>{user.city}, {user.state}</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className={`status-pill ${user.isVerified ? 'verified' : 'unverified'}`}
                        onClick={() => handleToggleVerify(user._id)}
                      >
                        {user.isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {user.isVerified ? "Verified" : "Unverified"}
                      </button>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="edit-btn" onClick={() => handleEditClick(user)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(user._id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="admin-empty">
                <Users size={48} color="#ccc" />
                <p>No users found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      {showEditModal && editUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h2>Edit User Profile</h2>
              <button onClick={() => setShowEditModal(false)}><XCircle size={24} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-input">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editUser.name} 
                    onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  />
                </div>
                <div className="modal-input">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editUser.email} 
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  />
                </div>
                <div className="modal-input">
                  <label>Phone</label>
                  <input 
                    type="text" 
                    value={editUser.phone} 
                    onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                  />
                </div>
                <div className="modal-input">
                  <label>Religion</label>
                  <input 
                    type="text" 
                    value={editUser.religion} 
                    onChange={(e) => setEditUser({...editUser, religion: e.target.value})}
                  />
                </div>
                <div className="modal-input">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={editUser.city} 
                    onChange={(e) => setEditUser({...editUser, city: e.target.value})}
                  />
                </div>
                <div className="modal-input">
                  <label>Role</label>
                  <select 
                    value={editUser.role} 
                    onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="modal-save" onClick={handleUpdateUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
