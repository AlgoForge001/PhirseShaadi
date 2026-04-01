import React, { useState, useEffect } from "react";
import AddFamilyMemberModal from "../pages/AddFamilyMemberModal";
import {
  Plus, Edit2, Trash2, Shield, Eye, MessageSquare,
  Users, ChevronRight
} from "lucide-react";
import api from "../utils/api";
import "./FamilyMembers.css";


const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/family/members");
      setFamilyMembers(res.data.familyMembers || []);
    } catch (err) {
      console.error("Error fetching family members:", err);
      setError(err.response?.data?.message || "Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      if (editingMember) {
        await api.put(`/family/${editingMember._id}`, memberData);
      } else {
        await api.post("/family/add", memberData);
      }
      setShowModal(false);
      setEditingMember(null);
      fetchFamilyMembers();
    } catch (err) {
      console.error("Error saving family member:", err);
      alert(err.response?.data?.message || "Failed to save family member");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Remove this family member?")) {
      try {
        await api.delete(`/family/${memberId}`);
        fetchFamilyMembers();
      } catch (err) {
        console.error("Error deleting family member:", err);
        alert(err.response?.data?.message || "Failed to delete family member");
      }
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case "view-only":
        return "#448aff";
      case "shortlist-only":
        return "#ff9800";
      case "full-access":
        return "#4caf50";
      default:
        return "#6B3F69";
    }
  };

  const getAccessLevelIcon = (level) => {
    switch (level) {
      case "view-only":
        return <Eye size={16} />;
      case "shortlist-only":
        return <MessageSquare size={16} />;
      case "full-access":
        return <Shield size={16} />;
      default:
        return null;
    }
  };

  if (loading) return <div className="loading-screen">Loading family members...</div>;

  return (
    <div className="family-members-page">
      <section className="family-header">
        <div className="header-content">
          <div className="header-icon">
            <Users size={40} />
          </div>
          <div>
            <h1>Family Members</h1>
            <p>Manage family involvement in your profile</p>
          </div>
        </div>
        <button
          className="add-family-btn"
          onClick={() => {
            setEditingMember(null);
            setShowModal(true);
          }}
        >
          <Plus size={20} /> Add Family Member
        </button>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="family-members-section">
        <div className="section-title">
          <h2>Your Family Team</h2>
          <span className="member-count">{familyMembers.length} members</span>
        </div>

        {familyMembers.length === 0 ? (
          <div className="empty-state">
            <Users size={60} />
            <h3>No family members added yet</h3>
            <p>Invite parents or siblings to help with your search</p>
            <button
              className="add-family-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} /> Add Your First Family Member
            </button>
          </div>
        ) : (
          <div className="family-members-grid">
            {familyMembers.map((member) => (
              <div key={member._id} className="family-member-card">
                <div className="member-avatar">
                  {member.name?.charAt(0).toUpperCase()}
                </div>

                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="relationship">{member.relationship}</p>
                  {member.contactInfo && (
                    <p className="contact">{member.contactInfo}</p>
                  )}
                </div>

                <div className="access-level">
                  <div
                    className="access-badge"
                    style={{
                      backgroundColor: `${getAccessLevelColor(
                        member.accessLevel
                      )}20`,
                      borderColor: getAccessLevelColor(member.accessLevel),
                    }}
                  >
                    <span style={{ color: getAccessLevelColor(member.accessLevel) }}>
                      {getAccessLevelIcon(member.accessLevel)}
                    </span>
                    <span>{member.accessLevel.replace("-", " ")}</span>
                  </div>
                </div>

                <div className="member-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingMember(member);
                      setShowModal(true);
                    }}
                    title="Edit member"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMember(member._id)}
                    title="Remove member"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="access-levels-info">
        <h3>Access Level Explained</h3>
        <div className="access-info-grid">
          <div className="access-info-card">
            <div className="info-icon" style={{ backgroundColor: "#448aff20" }}>
              <Eye size={24} color="#448aff" />
            </div>
            <h4>View-Only</h4>
            <p>Can see profiles and your matches, but cannot save or message</p>
          </div>

          <div className="access-info-card">
            <div className="info-icon" style={{ backgroundColor: "#ff980020" }}>
              <MessageSquare size={24} color="#ff9800" />
            </div>
            <h4>Shortlist-Only</h4>
            <p>Can view profiles and create their own shortlist, but cannot message</p>
          </div>

          <div className="access-info-card">
            <div className="info-icon" style={{ backgroundColor: "#4caf5020" }}>
              <Shield size={24} color="#4caf50" />
            </div>
            <h4>Full Access</h4>
            <p>Can view, shortlist, message matches, and participate fully</p>
          </div>
        </div>
      </section>

      {showModal && (
        <AddFamilyMemberModal
          onClose={() => {
            setShowModal(false);
            setEditingMember(null);
          }}
          onSubmit={handleAddMember}
          initialData={editingMember}
        />
      )}
    </div>
  );
};

export default FamilyMembers;