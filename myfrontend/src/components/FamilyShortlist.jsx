import React, { useState, useEffect } from "react";
import {
  Heart, Trash2, Users, Filter, ChevronRight,
  Eye, Share2, Download
} from "lucide-react";
import api from "../utils/api";
import "./FamilyShortlist.css";

const FamilyShortlist = () => {
  const [activeTab, setActiveTab] = useState("my-shortlist");
  const [myShortlist, setMyShortlist] = useState([]);
  const [familyShortlists, setFamilyShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [commonProfiles, setCommonProfiles] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchShortlists();
  }, []);

  const fetchShortlists = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shortlist/all");
      setMyShortlist(res.data.myShortlist || []);
      setFamilyShortlists(res.data.familyShortlists || []);
    } catch (err) {
      console.error("Error fetching shortlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromShortlist = async (profileId) => {
    try {
      await api.delete(`/shortlist/${profileId}`);
      setMyShortlist(myShortlist.filter(p => p._id !== profileId));
    } catch (err) {
      console.error("Error removing from shortlist:", err);
    }
  };

  const handleFamilyMemberClick = (familyShortlist) => {
    setSelectedFamily(familyShortlist);
    // Calculate common profiles
    const myIds = myShortlist.map(p => p._id);
    const familyIds = familyShortlist.profiles.map(p => p._id);
    const common = familyShortlist.profiles.filter(p => myIds.includes(p._id));
    setCommonProfiles(common);
  };

  const renderProfileCard = (profile, showRemoveBtn = true) => (
    <div key={profile._id} className="shortlist-profile-card">
      <div className="profile-image-container">
        {profile.photos?.[0]?.url ? (
          <img src={profile.photos[0].url} alt={profile.name} />
        ) : (
          <div className="profile-placeholder">
            <Eye size={32} />
          </div>
        )}
        {showRemoveBtn && (
          <button
            className="remove-btn"
            onClick={() => handleRemoveFromShortlist(profile._id)}
            title="Remove from shortlist"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="profile-card-info">
        <h4>{profile.name}</h4>
        <p className="age-location">
          {profile.age}, {profile.city || "Location not specified"}
        </p>
        <p className="bio">{profile.bio || "No bio provided"}</p>

        <div className="profile-tags">
          {profile.education && (
            <span className="tag">{profile.education}</span>
          )}
          {profile.profession && (
            <span className="tag">{profile.profession}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="loading-screen">Loading shortlists...</div>;

  return (
    <div className="family-shortlist-page">
      {/* HEADER */}
      <section className="shortlist-header">
        <div className="header-content">
          <div className="header-icon">
            <Heart size={40} fill="#e91e63" color="#e91e63" />
          </div>
          <div>
            <h1>Family Shortlists</h1>
            <p>Compare choices and collaborate with family</p>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="shortlist-tabs-section">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "my-shortlist" ? "active" : ""}`}
            onClick={() => setActiveTab("my-shortlist")}
          >
            <Heart size={18} />
            My Shortlist
            <span className="count-badge">{myShortlist.length}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "family" ? "active" : ""}`}
            onClick={() => setActiveTab("family")}
          >
            <Users size={18} />
            Family Shortlists
            <span className="count-badge">{familyShortlists.length}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "common" ? "active" : ""}`}
            onClick={() => setActiveTab("common")}
          >
            <Share2 size={18} />
            Common Choices
            <span className="count-badge">{commonProfiles.length}</span>
          </button>
        </div>
      </section>

      {/* MY SHORTLIST TAB */}
      {activeTab === "my-shortlist" && (
        <section className="shortlist-content">
          <div className="section-header">
            <div>
              <h2>Your Shortlist</h2>
              <p>Profiles you've saved</p>
            </div>
            <button className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
              <Filter size={18} /> Filter
            </button>
          </div>

          {myShortlist.length === 0 ? (
            <div className="empty-shortlist">
              <Heart size={60} />
              <h3>Your shortlist is empty</h3>
              <p>Start saving profiles you like</p>
              <button className="explore-btn">
                Explore Matches <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="profiles-grid">
              {myShortlist.map(profile => renderProfileCard(profile, true))}
            </div>
          )}
        </section>
      )}

      {/* FAMILY SHORTLISTS TAB */}
      {activeTab === "family" && (
        <section className="shortlist-content">
          <div className="section-header">
            <div>
              <h2>Family Shortlists</h2>
              <p>Each family member's saved profiles</p>
            </div>
          </div>

          {familyShortlists.length === 0 ? (
            <div className="empty-shortlist">
              <Users size={60} />
              <h3>No family shortlists yet</h3>
              <p>Family members with access will have their own shortlists</p>
            </div>
          ) : (
            <div className="family-shortlist-tabs">
              {familyShortlists.map((familyList) => (
                <button
                  key={familyList._id}
                  className={`family-tab ${selectedFamily?._id === familyList._id ? "active" : ""}`}
                  onClick={() => handleFamilyMemberClick(familyList)}
                >
                  <div className="family-tab-avatar">
                    {familyList.createdByName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="family-tab-info">
                    <span className="family-name">{familyList.createdByName}</span>
                    <span className="profile-count">{familyList.profiles.length} profiles</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedFamily && (
            <div className="family-shortlist-display">
              <div className="display-header">
                <h3>{selectedFamily.createdByName}'s Shortlist</h3>
                <span className="profile-count">{selectedFamily.profiles.length} profiles</span>
              </div>

              {selectedFamily.profiles.length === 0 ? (
                <div className="empty-shortlist">
                  <Heart size={60} />
                  <p>{selectedFamily.createdByName} hasn't saved any profiles yet</p>
                </div>
              ) : (
                <div className="profiles-grid">
                  {selectedFamily.profiles.map(profile =>
                    renderProfileCard(profile, false)
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* COMMON CHOICES TAB */}
      {activeTab === "common" && (
        <section className="shortlist-content">
          <div className="section-header">
            <div>
              <h2>Common Choices</h2>
              <p>Profiles saved by both you and family members</p>
            </div>
          </div>

          {commonProfiles.length === 0 ? (
            <div className="empty-shortlist">
              <Share2 size={60} />
              <h3>No common choices yet</h3>
              <p>When you and family members save the same profile, they'll appear here</p>
            </div>
          ) : (
            <div className="profiles-grid">
              {commonProfiles.map(profile => (
                <div key={profile._id} className="shortlist-profile-card common-choice">
                  <div className="common-badge">
                    <Share2 size={16} /> Mutual Choice
                  </div>
                  {renderProfileCard(profile, false)}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default FamilyShortlist;