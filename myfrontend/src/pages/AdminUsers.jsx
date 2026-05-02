import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users, Search, Trash2, Shield, User, ChevronDown, XCircle, LogOut,
  UserCheck, Ban, ShieldCheck, Clock, UserPlus, Calendar, Check
} from "lucide-react";
import api from "../utils/api";
import "./AdminDashboard.css"; // Reuse common styles or specific ones

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Ban state
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [banReason, setBanReason] = useState("Fake Profile");
  const [banning, setBanning] = useState(false);
  const [unbanningId, setUnbanningId] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get("/admin/stats");
      setStats(res.data.success ? res.data.data : res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

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

  const handleVerify = async (id) => {
    if (!window.confirm("Verify this user's profile?")) return;
    try {
      await api.put(`/admin/verify-user/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: true } : u));
      alert("Profile verified");
      fetchStats();
    } catch (err) {
      alert("Failed to verify user");
    }
  };

  const handleUnverify = async (id) => {
    try {
      await api.put(`/admin/unverify-user/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isVerified: false } : u));
      alert("Verification removed");
      fetchStats();
    } catch (err) {
      alert("Failed to unverify user");
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

  const handleBanClick = (user) => {
    setUserToBan(user);
    setBanReason("Fake Profile");
    setShowBanModal(true);
  };

  const handleConfirmBan = async () => {
    try {
      setBanning(true);
      await api.put(`/admin/ban-user/${userToBan._id}`, { reason: banReason });
      setUsers(users.map(u => u._id === userToBan._id ? { ...u, isActive: false, banReason } : u));
      setShowBanModal(false);
      setUserToBan(null);
      alert("User banned");
      fetchStats();
    } catch (err) {
      alert("Failed to ban user");
    } finally {
      setBanning(false);
    }
  };

  const handleUnban = async (id) => {
    try {
      setUnbanningId(id);
      await api.put(`/admin/unban-user/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: true, banReason: null } : u));
      alert("User unbanned");
      fetchStats();
    } catch (err) {
      alert("Failed to unban user");
    } finally {
      setUnbanningId(null);
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
        {/* STATS SECTION */}
        {loadingStats ? (
          <div className="stats-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ height: '80px', backgroundColor: '#f5f5f7', borderRadius: '11px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            ))}
          </div>
        ) : stats ? (
          <div className="stats-grid">
            <StatCard title="Total Users" value={stats.totalUsers || 0} icon={<Users size={16} />} />
            <StatCard title="Active Users" value={stats.activeUsers || 0} icon={<UserCheck size={16} />} />
            <StatCard title="Banned Users" value={stats.bannedUsers || 0} icon={<Ban size={16} />} />

            <StatCard title="Verified" value={stats.verifiedUsers || 0} icon={<ShieldCheck size={16} />} />
            <StatCard title="Pending" value={stats.unverifiedUsers || 0} icon={<Clock size={16} />} />
            <StatCard title="Today" value={stats.newToday || 0} icon={<UserPlus size={16} />} />

            <StatCard title="Male" value={stats.maleUsers || 0} icon={<User size={16} />} />
            <StatCard title="Female" value={stats.femaleUsers || 0} icon={<User size={16} />} />
            <StatCard title="This Week" value={stats.newThisWeek || 0} icon={<Calendar size={16} />} />
          </div>
        ) : null}

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
                <tr key={user._id} onClick={() => navigate(`/admin-users/${user._id}`)}>
                  <td>
                    <Link to={`/admin-users/${user._id}`} className="user-info-cell" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="user-avatar">
                        {user.photos?.[0]?.url ? <img src={user.photos[0].url} alt="" /> : <User size={18} />}
                      </div>
                      <div>
                        <div className="user-name" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{user.name}</div>
                        <div className="user-id">{user._id.slice(-6)}</div>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div>{user.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{user.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                      <span className={`status-chip ${user.isActive !== false ? 'active' : 'banned'}`}>
                        {user.isActive !== false ? "Active" : "Banned"}
                      </span>
                      <span className={`status-chip ${user.isVerified ? 'verified' : 'unverified'}`}>
                        {user.isVerified ? <><Check size={12} /> Verified</> : "Unverified"}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {user.isVerified ? (
                        <button className="button-pearl-capsule" onClick={(e) => { e.stopPropagation(); handleUnverify(user._id); }}>
                          Unverify
                        </button>
                      ) : (
                        <button className="button-pearl-capsule" onClick={(e) => { e.stopPropagation(); handleVerify(user._id); }}>
                          Verify
                        </button>
                      )}
                      {user.isActive !== false ? (
                        <button className="button-pearl-capsule" onClick={(e) => { e.stopPropagation(); handleBanClick(user); }}>
                          Ban
                        </button>
                      ) : (
                        <button className="button-pearl-capsule" onClick={(e) => { e.stopPropagation(); handleUnban(user._id); }} disabled={unbanningId === user._id}>
                          {unbanningId === user._id ? "..." : "Unban"}
                        </button>
                      )}
                      <button className="button-pearl-capsule" onClick={(e) => { e.stopPropagation(); navigate(`/admin-users/${user._id}`); }} style={{ background: '#f5f5f7' }}>
                        View
                      </button>
                      <button className="button-pearl-capsule" onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}>Edit</button>
                      <button className="button-icon-circular delete" onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}>
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

      {/* BAN MODAL */}
      {showBanModal && userToBan && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h2>Ban this user?</h2>
              <button className="modal-close" onClick={() => setShowBanModal(false)}><XCircle size={20} /></button>
            </div>
            <div className="modal-body">
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
                User: <strong style={{ color: '#0f172a' }}>{userToBan.name}</strong> ({userToBan.email})
              </p>
              <div className="modal-input">
                <label>Reason for Ban</label>
                <select
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                >
                  <option value="Fake Profile">Fake Profile</option>
                  <option value="Spam / Scam">Spam / Scam</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button-pearl-capsule" onClick={() => setShowBanModal(false)} style={{ padding: '11px 22px', fontSize: '17px' }}>Cancel</button>
              <button className="button-primary" onClick={handleConfirmBan} disabled={banning} style={{ opacity: banning ? 0.7 : 1 }}>
                {banning ? "Banning..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <input type="text" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                </div>
                <div className="modal-input">
                  <label>Email</label>
                  <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
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

const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="stat-card-icon">
      {icon}
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-title">{title}</div>
  </div>
);

export default AdminUsers;
