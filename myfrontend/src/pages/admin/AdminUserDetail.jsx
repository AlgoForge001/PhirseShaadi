import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ChevronLeft, Check, Ban, Crown, Trash2, Shield, AlertTriangle, User, MessageSquare } from 'lucide-react';
import './AdminUserDetail.css';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('Fake Profile');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Chat viewer state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users/${userId}/detail`);
      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleVerify = async () => {
    if (!window.confirm("Verify this user's profile?")) return;
    try {
      setActionLoading(true);
      await api.put(`/admin/verify-user/${userId}`);
      showToast("Profile verified");
      fetchUserDetail();
    } catch (_error) {
      showToast("Error verifying user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnverify = async () => {
    try {
      setActionLoading(true);
      await api.put(`/admin/unverify-user/${userId}`);
      showToast("Verification removed");
      fetchUserDetail();
    } catch (_error) {
      showToast("Error removing verification", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBan = async () => {
    try {
      setActionLoading(true);
      await api.put(`/admin/ban-user/${userId}`, { reason: banReason });
      setShowBanModal(false);
      showToast("User banned");
      fetchUserDetail();
    } catch (_error) {
      showToast("Error banning user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async () => {
    try {
      setActionLoading(true);
      await api.put(`/admin/unban-user/${userId}`);
      showToast("User unbanned");
      fetchUserDetail();
    } catch (_error) {
      showToast("Error unbanning user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this user completely? This cannot be undone.")) return;
    try {
      setActionLoading(true);
      await api.delete(`/admin/users/${userId}`);
      showToast("User deleted");
      setTimeout(() => navigate('/admin-users'), 1500);
    } catch (_error) {
      showToast("Error deleting user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewChat = async (conversationId, withUser) => {
    setChatWith(withUser);
    setChatMessages([]);
    setShowChatModal(true);
    setChatLoading(true);
    try {
      const res = await api.get(`/admin/conversations/${conversationId}/messages`);
      if (res.data.success) setChatMessages(res.data.data);
    } catch (_err) {
      showToast('Failed to load chat messages', 'error');
      setShowChatModal(false);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading user details...</p>
    </div>
  );

  if (error || !data) return (
    <div className="admin-detail-page">
      <button className="back-button" onClick={() => navigate('/admin-users')}>
        <ChevronLeft size={20} />
      </button>
      <div className="loader-container" style={{ color: 'red' }}>
        <h2>User Not Found</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  const primaryPhoto = data.photos?.find(p => p.isPrimary)?.url || data.photos?.[0]?.url;

  return (
    <div className="admin-layout" style={{ backgroundColor: '#f5f5f7', minHeight: '100vh', paddingBottom: '40px' }}>

      {/* Toast */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, background: toast.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {toast.message}
        </div>
      )}

      {/* Chat Viewer Modal */}
      {showChatModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '18px', width: '560px', maxWidth: '95vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {chatWith?.photos?.[0]?.url
                    ? <img src={chatWith.photos[0].url} style={{ width: 40, height: 40, objectFit: 'cover' }} alt="" />
                    : <User size={20} color="#7a7a7a" />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f' }}>{data?.name} &amp; {chatWith?.name || 'User'}</div>
                  <div style={{ fontSize: '13px', color: '#7a7a7a' }}>{chatMessages.length} messages</div>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#7a7a7a', lineHeight: 1, padding: '0 4px' }}>&times;</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f5f5f7' }}>
              {chatLoading ? (
                <div style={{ textAlign: 'center', color: '#7a7a7a', padding: '40px' }}>
                  <div className="spinner" style={{ margin: '0 auto 12px' }} />
                  Loading messages...
                </div>
              ) : chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#7a7a7a', padding: '40px', background: '#fff', borderRadius: '12px' }}>No messages found in this conversation.</div>
              ) : chatMessages.map((msg, i) => {
                const isMine = msg.from?._id?.toString() === userId;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0e0e0', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {msg.from?.photos?.[0]?.url
                        ? <img src={msg.from.photos[0].url} style={{ width: 28, height: 28, objectFit: 'cover' }} alt="" />
                        : <User size={14} color="#7a7a7a" />}
                    </div>
                    <div style={{ maxWidth: '65%' }}>
                      <div style={{
                        background: isMine ? '#0066cc' : '#ffffff',
                        color: isMine ? '#ffffff' : '#1d1d1f',
                        padding: '10px 14px',
                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                      }}>{msg.text}</div>
                      <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                        {msg.from?.name} &middot; {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2 className="modal-title">Ban {data.name}?</h2>
            <div className="modal-body">
              <label>Reason for ban:</label>
              <select value={banReason} onChange={e => setBanReason(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                <option value="Fake Profile">Fake Profile</option>
                <option value="Spam / Scam">Spam / Scam</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Harassment">Harassment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="button-dark-utility" onClick={() => setShowBanModal(false)}>Cancel</button>
              <button className="button-dark-utility" style={{ background: '#dc2626' }} onClick={handleBan} disabled={actionLoading}>
                {actionLoading ? 'Banning...' : 'Confirm Ban'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-detail-page">
        {/* TOP BAR */}
        <div className="detail-top-bar">
          <div className="top-bar-left">
            <button className="back-button" onClick={() => navigate('/admin-users')}>
              <ChevronLeft size={20} />
            </button>
            <h1 className="user-name-title">{data.name}</h1>
            <div className="status-badges">
              <span className="badge">
                <span style={{ color: data.isActive !== false ? '#10b981' : '#dc2626' }}>●</span>
                {data.isActive !== false ? 'Active' : 'Banned'}
              </span>
              <span className="badge">
                <span style={{ color: data.isVerified ? '#0066cc' : '#7a7a7a' }}>●</span>
                {data.isVerified ? 'Verified' : 'Unverified'}
              </span>
              <span className="badge">
                <span style={{ color: data.isPremium ? '#f59e0b' : '#7a7a7a' }}>●</span>
                {data.isPremium ? 'Premium' : 'Free'}
              </span>
              <span className="badge">{data.role === 'admin' ? 'Admin' : 'User'}</span>
            </div>
          </div>
          <div className="top-bar-right">
            {data.isVerified ? (
              <button className="button-pearl-capsule" onClick={handleUnverify} disabled={actionLoading}>Unverify</button>
            ) : (
              <button className="button-pearl-capsule" onClick={handleVerify} disabled={actionLoading}>Verify</button>
            )}

            {data.isActive !== false ? (
              <button className="button-pearl-capsule" onClick={() => setShowBanModal(true)} disabled={actionLoading}>Ban</button>
            ) : (
              <button className="button-pearl-capsule" onClick={handleUnban} disabled={actionLoading}>Unban</button>
            )}
            <button className="button-pearl-capsule" onClick={() => showToast("Premium granting coming soon")} disabled={actionLoading}>Give Premium</button>
            <button className="button-pearl-capsule" style={{ color: '#dc2626' }} onClick={handleDelete} disabled={actionLoading}>
              Delete
            </button>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="detail-content">

          {/* LEFT COLUMN */}
          <div className="left-column">

            {/* CARD 1 */}
            <div className="detail-card">
              <div className="profile-header">
                {primaryPhoto ? (
                  <img src={primaryPhoto} alt={data.name} className="primary-photo" />
                ) : (
                  <div className="photo-placeholder"><User size={40} /></div>
                )}
                <div className="basic-info-text">
                  <h2>{data.name}</h2>
                  <p>{data.age || '--'} yrs • {data.gender || '--'} • {data.religion || '--'}</p>
                  <p>{data.city ? `${data.city}, ` : ''}{data.state || '--'}</p>
                  <p>Joined: {new Date(data.createdAt).toLocaleDateString()}</p>
                  <p>Last Active: {data.lastActive ? new Date(data.lastActive).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="progress-container">
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink-muted-80)' }}>Profile Completion: {data.profileComplete}%</span>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${data.profileComplete}%` }}></div>
                </div>
              </div>
              {data.photos?.length > 1 && (
                <div className="other-photos">
                  {data.photos.filter(p => !p.isPrimary).map((p, i) => (
                    <img key={i} src={p.url} alt="User photo" className="small-photo" />
                  ))}
                </div>
              )}
            </div>

            {/* CARD 2 */}
            <div className="detail-card">
              <h3 className="card-title">Account Status</h3>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="info-value" style={{ color: data.isActive !== false ? '#166534' : '#dc2626' }}>
                  {data.isActive !== false ? '🟢 Active' : '🔴 Banned'}
                </span>
              </div>
              {data.isActive === false && (
                <div className="ban-reason-text">Reason: {data.banReason || 'None specified'}</div>
              )}
              <div className="info-row">
                <span className="info-label">Profile Verified</span>
                <span className="info-value">{data.isVerified ? `Yes (${new Date(data.verifiedAt).toLocaleDateString()})` : 'No'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Premium</span>
                <span className="info-value">{data.isPremium ? `Yes (Expires: ${new Date(data.premiumExpiry).toLocaleDateString()})` : 'No'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className="info-value">{data.role}</span>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="detail-card">
              <h3 className="card-title">Quick Stats</h3>
              <div className="quick-stats-grid">
                <div className="quick-stat-box">
                  <div className="stat-num">{data.stats.totalInterestsSent || 0}</div>
                  <div className="stat-label">Interests Sent</div>
                </div>
                <div className="quick-stat-box">
                  <div className="stat-num">{data.stats.totalInterestsReceived || 0}</div>
                  <div className="stat-label">Interests Received</div>
                </div>
                <div className="quick-stat-box">
                  <div className="stat-num">{data.stats.totalInterestsAccepted || 0}</div>
                  <div className="stat-label">Accepted</div>
                </div>
                <div className="quick-stat-box">
                  <div className="stat-num">{data.stats.totalProfileViews || 0}</div>
                  <div className="stat-label">Profile Views</div>
                </div>
                <div className="quick-stat-box">
                  <div className="stat-num">{data.stats.totalConversations || 0}</div>
                  <div className="stat-label">Chats</div>
                </div>
                <div className="quick-stat-box">
                  <div className="stat-num">{data.stats.totalShortlisted || 0}</div>
                  <div className="stat-label">Shortlisted By</div>
                </div>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="detail-card">
              <h3 className="card-title">Reports Against User</h3>
              {data.reportsAgainst?.length > 0 ? (
                <>
                  <div className="report-banner">
                    <AlertTriangle size={16} />
                    {data.reportsAgainst.length} reports filed against this user
                  </div>
                  <div className="report-list">
                    {data.reportsAgainst.map((r, i) => (
                      <div className="report-item" key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: '#dc2626' }}>{r.reason}</span>
                          <span style={{ fontSize: '12px', color: 'var(--color-ink-muted-48)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-ink-muted-80)' }}>
                          Reported by: {r.reportedBy?.name || 'Unknown'}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ color: '#166534', fontWeight: 500, fontSize: '14px' }}>✓ No reports filed</div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">

            <div className="tabs-header">
              {['profile', 'family', 'preferences', 'activity', 'chats'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'profile' && (
                <div>
                  <div className="content-section">
                    <h3>Personal</h3>
                    <div className="info-row"><span className="info-label">Height</span><span className="info-value">{data.height || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Weight</span><span className="info-value">{data.weight || '--'}</span></div>
                    <div style={{ marginTop: '24px' }}>
                      <span className="info-label" style={{ display: 'block', marginBottom: '12px' }}>About</span>
                      {data.about ? (
                        <div className="about-box">{data.about}</div>
                      ) : (
                        <div className="empty-state" style={{ padding: '24px' }}>No about text provided.</div>
                      )}
                    </div>
                  </div>

                  <div className="content-section">
                    <h3>Education & Job</h3>
                    <div className="info-row"><span className="info-label">Education</span><span className="info-value">{data.education || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Details</span><span className="info-value">{data.educationDetail || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Job Type</span><span className="info-value">{data.jobType || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Job Title</span><span className="info-value">{data.jobTitle || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Company</span><span className="info-value">{data.company || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Income</span><span className="info-value">{data.income || '--'}</span></div>
                  </div>

                  <div className="content-section">
                    <h3>Horoscope</h3>
                    <div className="info-row"><span className="info-label">Birth Time</span><span className="info-value">{data.birthTime || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Birth Place</span><span className="info-value">{data.birthPlace || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Manglik</span><span className="info-value">{data.manglik || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Gotra</span><span className="info-value">{data.gotra || '--'}</span></div>
                  </div>
                </div>
              )}

              {activeTab === 'family' && (
                <div>
                  <div className="content-section">
                    <h3>Family Details</h3>
                    <div className="info-row"><span className="info-label">Father's Name</span><span className="info-value">{data.fatherName || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Father's Occ.</span><span className="info-value">{data.fatherOccupation || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Mother's Name</span><span className="info-value">{data.motherName || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Mother's Occ.</span><span className="info-value">{data.motherOccupation || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Siblings</span><span className="info-value">{data.siblings || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Family Type</span><span className="info-value">{data.familyType || '--'}</span></div>
                    <div className="info-row"><span className="info-label">Family Status</span><span className="info-value">{data.familyStatus || '--'}</span></div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <div className="content-section">
                    <h3>Partner Preferences</h3>
                    {Object.keys(data.partnerPreferences || {}).length === 0 ? (
                      <p className="empty-state">User has not set preferences yet</p>
                    ) : (
                      <>
                        <div className="info-row"><span className="info-label">Age Range</span><span className="info-value">{data.partnerPreferences.minAge || '--'} - {data.partnerPreferences.maxAge || '--'} yrs</span></div>
                        <div className="info-row"><span className="info-label">Religion</span><span className="info-value">{data.partnerPreferences.religion || '--'}</span></div>
                        <div className="info-row"><span className="info-label">Height Range</span><span className="info-value">{data.partnerPreferences.minHeight || '--'} - {data.partnerPreferences.maxHeight || '--'}</span></div>
                        <div className="info-row"><span className="info-label">Education</span><span className="info-value">{data.partnerPreferences.education || '--'}</span></div>
                        <div className="info-row"><span className="info-label">Income</span><span className="info-value">{data.partnerPreferences.income || '--'}</span></div>
                        <div className="info-row"><span className="info-label">City</span><span className="info-value">{data.partnerPreferences.city || '--'}</span></div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', color: 'var(--color-ink-muted-48)', marginBottom: '16px' }}>Interests Sent (Last 5)</h3>
                    {data.recentInterestsSent?.length > 0 ? data.recentInterestsSent.map((i, idx) => (
                      <div className="activity-row" key={idx}>
                        <div className="photo-placeholder" style={{ width: 40, height: 40 }}>
                          {i.toUser?.photos?.[0]?.url ? <img src={i.toUser.photos[0].url} className="activity-user-img" alt="" /> : <User size={20} />}
                        </div>
                        <div className="activity-details">
                          <div className="activity-name">{i.toUser?.name || 'Deleted User'}</div>
                          <div className="activity-time">{new Date(i.createdAt).toLocaleDateString()}</div>
                        </div>
                        <span className="badge" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                          <span style={{ color: i.status === 'accepted' ? '#10b981' : i.status === 'rejected' ? '#dc2626' : '#7a7a7a' }}>●</span>
                          {i.status}
                        </span>
                      </div>
                    )) : <p className="empty-state">No interests sent</p>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', color: 'var(--color-ink-muted-48)', marginBottom: '16px' }}>Interests Received (Last 5)</h3>
                    {data.recentInterestsReceived?.length > 0 ? data.recentInterestsReceived.map((i, idx) => (
                      <div className="activity-row" key={idx}>
                        <div className="photo-placeholder" style={{ width: 40, height: 40 }}>
                          {i.fromUser?.photos?.[0]?.url ? <img src={i.fromUser.photos[0].url} className="activity-user-img" alt="" /> : <User size={20} />}
                        </div>
                        <div className="activity-details">
                          <div className="activity-name">{i.fromUser?.name || 'Deleted User'}</div>
                          <div className="activity-time">{new Date(i.createdAt).toLocaleDateString()}</div>
                        </div>
                        <span className="badge" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                          <span style={{ color: i.status === 'accepted' ? '#10b981' : i.status === 'rejected' ? '#dc2626' : '#7a7a7a' }}>●</span>
                          {i.status}
                        </span>
                      </div>
                    )) : <p className="empty-state">No interests received</p>}
                  </div>
                </div>
              )}

              {activeTab === 'chats' && (
                <div>
                  <h3 style={{ fontSize: '15px', color: 'var(--color-ink-muted-48)', marginBottom: '16px' }}>Recent Conversations</h3>
                  {data.recentChats?.length > 0 ? data.recentChats.map((c, idx) => (
                    <div className="activity-row" key={idx} style={{ padding: '16px 0' }}>
                      <div className="photo-placeholder" style={{ width: 48, height: 48 }}>
                        {c.withUser?.photos?.[0]?.url ? <img src={c.withUser.photos[0].url} className="activity-user-img" style={{ width: 48, height: 48 }} alt="" /> : <User size={24} />}
                      </div>
                      <div className="activity-details">
                        <div className="activity-name">{c.withUser?.name || 'Deleted User'}</div>
                        <div className="activity-time" style={{ color: 'var(--color-ink)', marginTop: '4px' }}>
                          {c.lastMessage ? (c.lastMessage.length > 50 ? c.lastMessage.substring(0, 50) + '...' : c.lastMessage) : 'Image/File attached'}
                        </div>
                        <div className="activity-time" style={{ marginTop: '4px' }}>{new Date(c.lastMessageTime).toLocaleString()}</div>
                      </div>
                      <button className="button-pearl-capsule" onClick={() => handleViewChat(c.conversationId, c.withUser)}>
                        <MessageSquare size={14} style={{ marginRight: '6px' }} /> View Chat
                      </button>
                    </div>
                  )) : <p className="empty-state">No recent chats</p>}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminUserDetail;
