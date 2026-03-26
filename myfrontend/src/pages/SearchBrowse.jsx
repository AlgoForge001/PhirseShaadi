import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Search, Filter, MapPin, Briefcase,
  GraduationCap, ChevronDown, ChevronUp, X,
  SlidersHorizontal, CheckCircle, Star, MessageCircle,
  Bell, User, Home, LogOut
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "./SearchBrowse.css";

// TopNav moved to a simple component if needed elsewhere, 
// but for SearchBrowse we'll just use a simple header since Sidebar is present.
const SearchHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="search-top-mobile">
      <div className="search-top-logo">
        <Heart size={18} fill="#6B3F69" color="#6B3F69" />
        <span>PhirseShaadi</span>
      </div>
      <div className="search-top-actions">
        <button onClick={() => navigate("/notifications")}><Bell size={20} /></button>
        <button onClick={() => navigate("/my-profile")}><User size={20} /></button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters, onClose }) => {
  const religions = ["Any", "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist"];
  const educations = ["Any", "Bachelor's Degree", "Master's Degree", "MBA", "PhD", "MBBS", "Engineering", "CA/CS"];
  const occupations = ["Any", "Software Engineer", "Doctor", "Engineer", "Teacher", "Business Owner", "Government Employee", "Lawyer"];
  const incomes = ["Any", "Below ₹2L", "₹2L - ₹5L", "₹5L - ₹10L", "₹10L - ₹15L", "₹15L - ₹20L", "Above ₹20L"];

  const handleChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      ageFrom: "18", ageTo: "40",
      heightFrom: "", heightTo: "",
      religion: "Any", education: "Any",
      occupation: "Any", income: "Any",
      city: "", onlyVerified: false, onlyPremium: false,
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3><SlidersHorizontal size={18} /> Filters</h3>
        <div className="filter-header-actions">
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <button className="close-filter" onClick={onClose}><X size={18} /></button>
        </div>
      </div>

      <div className="filter-body">

        {/* AGE RANGE */}
        <div className="filter-group">
          <label>Age Range</label>
          <div className="range-inputs">
            <input
              type="number"
              min="18" max="60"
              value={filters.ageFrom}
              onChange={(e) => handleChange("ageFrom", e.target.value)}
              placeholder="From"
            />
            <span>to</span>
            <input
              type="number"
              min="18" max="60"
              value={filters.ageTo}
              onChange={(e) => handleChange("ageTo", e.target.value)}
              placeholder="To"
            />
          </div>
        </div>

        {/* RELIGION */}
        <div className="filter-group">
          <label>Religion</label>
          <div className="filter-chips">
            {religions.map((r) => (
              <button
                key={r}
                className={`chip ${filters.religion === r ? "active" : ""}`}
                onClick={() => handleChange("religion", r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="filter-group">
          <label>Education</label>
          <select
            value={filters.education}
            onChange={(e) => handleChange("education", e.target.value)}
            className="filter-select"
          >
            {educations.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* OCCUPATION */}
        <div className="filter-group">
          <label>Occupation</label>
          <select
            value={filters.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
            className="filter-select"
          >
            {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* INCOME */}
        <div className="filter-group">
          <label>Annual Income</label>
          <select
            value={filters.income}
            onChange={(e) => handleChange("income", e.target.value)}
            className="filter-select"
          >
            {incomes.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        {/* CITY */}
        <div className="filter-group">
          <label>City</label>
          <input
            type="text"
            placeholder="Enter city name"
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="filter-input"
          />
        </div>

        {/* TOGGLES */}
        <div className="filter-group">
          <label>Other Filters</label>
          <div className="toggle-filters">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={filters.onlyVerified}
                onChange={(e) => handleChange("onlyVerified", e.target.checked)}
              />
              <span>Verified Profiles Only</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={filters.onlyPremium}
                onChange={(e) => handleChange("onlyPremium", e.target.checked)}
              />
              <span>Premium Members Only</span>
            </label>
          </div>
        </div>

      </div>

      <button className="apply-filters-btn" onClick={filters.onApply}>
        Apply Filters
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROFILE CARD
// ─────────────────────────────────────────────
const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <div className="profile-card" onClick={() => navigate(`/profile/${profile._id}`)}>
      {/* PHOTO */}
      <div className="card-photo">
        <div className="card-avatar">
          {profile.photos && profile.photos.length > 0 ? (
            <img src={profile.photos[0].url} alt={profile.fullName || profile.name} className="card-img" />
          ) : (
            <User size={40} color="#A376A2" />
          )}
        </div>
        {/* Badges */}
        <div className="card-badges">
          {profile.isVerified && (
            <span className="badge badge-verified">
              <CheckCircle size={11} /> Verified
            </span>
          )}
          {profile.isPremium && (
            <span className="badge badge-premium">
              <Star size={11} /> Premium
            </span>
          )}
        </div>
        {profile.online && <div className="online-dot" />}
        {/* Compatibility */}
        {profile.compatibility && (
           <div className="compatibility-pill">
           <Heart size={11} fill="white" color="white" />
           {profile.compatibility}% Match
         </div>
        )}
        {/* Like Button */}
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        >
          <Heart size={18} fill={liked ? "white" : "none"} color={liked ? "white" : "#6B3F69"} />
        </button>
      </div>

      {/* INFO */}
      <div className="card-info">
        <div className="card-name-row">
          <h3>{profile.fullName || profile.name}</h3>
          {profile.dob && <span className="card-age">{new Date().getFullYear() - new Date(profile.dob).getFullYear()} yrs</span>}
        </div>

        <div className="card-details">
          <span><MapPin size={13} /> {profile.city}, {profile.state}</span>
          <span><GraduationCap size={13} /> {profile.education}</span>
          <span><Briefcase size={13} /> {profile.profession || profile.occupation}</span>
          <span><Star size={13} /> {profile.religion} • {profile.community}</span>
        </div>

        <div className="card-height-income">
          <span>{profile.height}</span>
          <span>{profile.income || profile.annualIncome}</span>
        </div>

        <div className="card-actions">
          <button
            className="card-btn card-btn-interest"
            onClick={(e) => {
              e.stopPropagation();
              const sendInterest = async () => {
                try {
                  await api.post("/interest/send", { toUserId: profile._id });
                  alert("Interest sent successfully!");
                } catch (err) {
                  alert("Already sent or failed to send interest.");
                }
              };
              sendInterest();
            }}
          >
            <Heart size={15} /> Send Interest
          </button>
          <button
            className="card-btn card-btn-chat"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat?userId=${profile._id}`);
            }}
          >
            <MessageCircle size={15} /> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN SEARCH PAGE
// ─────────────────────────────────────────────
const SearchBrowse = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ageFrom: "18", ageTo: "40",
    heightFrom: "", heightTo: "",
    religion: "Any", education: "Any",
    occupation: "Any", income: "Any",
    city: "", onlyVerified: false, onlyPremium: false,
  });

  const tabs = [
    { key: "all", label: "All Members" },
    { key: "new", label: "New Joins" },
    { key: "nearby", label: "Near You" },
  ];

  // ── FETCH PROFILES FROM BACKEND ──
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      let endpoint = "/search";
      
      // Map tabs to match endpoints
      if (activeTab === "new") endpoint = "/matches/new-joins";
      if (activeTab === "nearby") endpoint = "/matches/near-you";
      if (activeTab === "recommended") endpoint = "/matches/recommended";
      
      const params = {
        minAge: filters.ageFrom,
        maxAge: filters.ageTo,
        religion: filters.religion !== "Any" ? filters.religion : undefined,
        city: filters.city || undefined,
        education: filters.education !== "Any" ? filters.education : undefined,
        jobType: filters.occupation !== "Any" ? filters.occupation : undefined,
        income: filters.income !== "Any" ? filters.income : undefined,
        search: searchQuery || undefined
      };

      const res = await api.get(endpoint, { params });

      if (res.data.success) {
        setProfiles(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfiles();
    } else {
      navigate("/login");
    }
  }, [activeTab, token]); // Re-fetch on tab change or token

  const handleApplyFilters = () => {
    fetchProfiles();
    setShowFilter(false);
  };

  const filteredProfiles = profiles;

  return (
    <div className="search-page">
      <Sidebar />
      <SearchHeader />

      <div className="search-main">

        {/* SEARCH BAR */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, city, community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>
          <button
            className={`filter-toggle-btn ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter size={18} />
            Filters
            {showFilter ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {/* FILTER PANEL */}
        {showFilter && (
          <FilterPanel
            filters={{ ...filters, onApply: handleApplyFilters }}
            setFilters={setFilters}
            onClose={() => setShowFilter(false)}
          />
        )}

        {/* TABS */}
        <div className="search-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* RESULTS COUNT */}
        <div className="results-info">
          <span>{filteredProfiles.length} profiles found</span>
        </div>

        {/* PROFILES GRID */}
        {filteredProfiles.length > 0 ? (
          <div className="profiles-grid">
            {filteredProfiles.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <Search size={48} color="#DDC3C3" />
            <h3>No profiles found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchBrowse;