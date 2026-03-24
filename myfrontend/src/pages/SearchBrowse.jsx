import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Search, Filter, MapPin, Briefcase,
  GraduationCap, ChevronDown, ChevronUp, X,
  SlidersHorizontal, CheckCircle, Star, MessageCircle,
  Bell, User, Home, LogOut
} from "lucide-react";
import "./SearchBrowse.css";

// ─────────────────────────────────────────────
// DUMMY PROFILES DATA
// TODO [BACKEND]: GET /api/profiles/search?filters=...
// Replace this with actual API call
// ─────────────────────────────────────────────
const dummyProfiles = [
  { id: 1, name: "Priya Sharma", age: 26, height: "5'4\"", city: "Mumbai", state: "Maharashtra", religion: "Hindu", community: "Brahmin", education: "M.Tech", occupation: "Software Engineer", income: "₹10L - ₹15L", verified: true, premium: true, online: true, compatibility: 96 },
  { id: 2, name: "Sneha Patel", age: 24, height: "5'2\"", city: "Ahmedabad", state: "Gujarat", religion: "Hindu", community: "Patel", education: "MBA", occupation: "Business Owner", income: "₹15L - ₹20L", verified: true, premium: false, online: false, compatibility: 88 },
  { id: 3, name: "Ayesha Khan", age: 25, height: "5'3\"", city: "Hyderabad", state: "Telangana", religion: "Muslim", community: "Sunni", education: "MBBS", occupation: "Doctor", income: "₹10L - ₹15L", verified: true, premium: true, online: true, compatibility: 92 },
  { id: 4, name: "Divya Nair", age: 27, height: "5'5\"", city: "Kochi", state: "Kerala", religion: "Hindu", community: "Nair", education: "CA", occupation: "Accountant", income: "₹10L - ₹15L", verified: false, premium: false, online: false, compatibility: 78 },
  { id: 5, name: "Simran Kaur", age: 23, height: "5'6\"", city: "Chandigarh", state: "Punjab", religion: "Sikh", community: "Khatri", education: "B.Tech", occupation: "Engineer", income: "₹5L - ₹10L", verified: true, premium: false, online: true, compatibility: 84 },
  { id: 6, name: "Meera Iyer", age: 28, height: "5'3\"", city: "Chennai", state: "Tamil Nadu", religion: "Hindu", community: "Brahmin", education: "PhD", occupation: "Researcher", income: "₹10L - ₹15L", verified: true, premium: true, online: false, compatibility: 90 },
];

// ─────────────────────────────────────────────
// SIDEBAR NAVBAR
// ─────────────────────────────────────────────
const Sidebar = ({ active }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <Search size={20} />, label: "Search", path: "/search" },
    { icon: <Heart size={20} />, label: "Matches", path: "/matches" },
    { icon: <MessageCircle size={20} />, label: "Chat", path: "/chat" },
    { icon: <Bell size={20} />, label: "Notifications", path: "/notifications" },
    { icon: <User size={20} />, label: "My Profile", path: "/my-profile" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/")}>
        <Heart size={20} fill="#6B3F69" color="#6B3F69" />
        <span>BandhanSetu</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => (
          <button
            key={i}
            className={`sidebar-item ${active === item.label ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar-logout">
        {/* TODO [BACKEND]: POST /api/auth/logout */}
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// TOP NAVBAR (mobile)
// ─────────────────────────────────────────────
const TopNav = () => {
  const navigate = useNavigate();
  return (
    <div className="top-nav">
      <div className="top-nav-logo">
        <Heart size={18} fill="#6B3F69" color="#6B3F69" />
        <span>BandhanSetu</span>
      </div>
      <div className="top-nav-actions">
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

      <button className="apply-filters-btn">
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
    <div className="profile-card" onClick={() => navigate(`/profile/${profile.id}`)}>

      {/* PHOTO */}
      <div className="card-photo">
        <div className="card-avatar">
          <User size={40} color="#A376A2" />
        </div>
        {/* Badges */}
        <div className="card-badges">
          {profile.verified && (
            <span className="badge badge-verified">
              <CheckCircle size={11} /> Verified
            </span>
          )}
          {profile.premium && (
            <span className="badge badge-premium">
              <Star size={11} /> Premium
            </span>
          )}
        </div>
        {profile.online && <div className="online-dot" />}
        {/* Compatibility */}
        <div className="compatibility-pill">
          <Heart size={11} fill="white" color="white" />
          {profile.compatibility}% Match
        </div>
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
          <h3>{profile.name}</h3>
          <span className="card-age">{profile.age} yrs</span>
        </div>

        <div className="card-details">
          <span><MapPin size={13} /> {profile.city}, {profile.state}</span>
          <span><GraduationCap size={13} /> {profile.education}</span>
          <span><Briefcase size={13} /> {profile.occupation}</span>
          <span><Star size={13} /> {profile.religion} • {profile.community}</span>
        </div>

        <div className="card-height-income">
          <span>{profile.height}</span>
          <span>{profile.income}</span>
        </div>

        <div className="card-actions">
          <button
            className="card-btn card-btn-interest"
            onClick={(e) => {
              e.stopPropagation();
              // TODO [BACKEND]: POST /api/interest/send { toUserId: profile.id }
            }}
          >
            <Heart size={15} /> Send Interest
          </button>
          <button
            className="card-btn card-btn-chat"
            onClick={(e) => {
              e.stopPropagation();
              // TODO [BACKEND]: POST /api/chat/initiate { toUserId: profile.id }
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    ageFrom: "18", ageTo: "40",
    heightFrom: "", heightTo: "",
    religion: "Any", education: "Any",
    occupation: "Any", income: "Any",
    city: "", onlyVerified: false, onlyPremium: false,
  });

  const tabs = [
    { key: "all", label: "All Matches" },
    { key: "new", label: "New Joins" },
    { key: "nearby", label: "Near You" },
    { key: "premium", label: "Premium" },
    { key: "shortlisted", label: "Shortlisted" },
  ];

  // TODO [BACKEND]: GET /api/profiles/search
  // Query params: searchQuery, filters, tab, page
  // Replace dummyProfiles with API response
  const filteredProfiles = dummyProfiles.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.onlyVerified && !p.verified) return false;
    if (filters.onlyPremium && !p.premium) return false;
    if (filters.religion !== "Any" && p.religion !== filters.religion) return false;
    if (activeTab === "premium" && !p.premium) return false;
    if (activeTab === "nearby") return true;
    return true;
  });

  return (
    <div className="search-page">
      <Sidebar active="Search" />
      <TopNav />

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
            filters={filters}
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