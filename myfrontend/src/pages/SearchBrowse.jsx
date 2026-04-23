import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search, Filter, MapPin,
  ChevronDown, ChevronUp, X,
  SlidersHorizontal
} from "lucide-react";
import api from "../utils/api";

import ProfileCard from "../components/ProfileCard";
import Navbar from "../components/Navbar";
import "./SearchBrowse.css";

// ─────────────────────────────────────────────
// FILTER PANEL
// ✅ FIX: onApply passed as separate prop — no longer mixed into filters object
// ─────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters, onApply, onClose }) => {
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
      city: "", state: "", onlyVerified: false, onlyPremium: false,
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

        <div className="filter-group">
          <label>State</label>
          <input
            type="text"
            placeholder="Enter state name"
            value={filters.state}
            onChange={(e) => handleChange("state", e.target.value)}
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

      {/* ✅ FIX: Use onApply prop directly */}
      <button className="apply-filters-btn" onClick={onApply}>
        Apply Filters
      </button>
    </div>
  );
};


// ─────────────────────────────────────────────
// MAIN SEARCH PAGE
// ─────────────────────────────────────────────
const SearchBrowse = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [profiles, setProfiles] = useState([]);
  const [sameCityMeta, setSameCityMeta] = useState({ city: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ageFrom: "18", ageTo: "40",
    heightFrom: "", heightTo: "",
    religion: "Any", education: "Any",
    occupation: "Any", income: "Any",
    city: "", state: "", onlyVerified: false, onlyPremium: false,
  });

  const tabs = [
    { key: "all", label: "All Members" },
    { key: "sameCity", label: "Same City Match" },
    { key: "recommended", label: "Smart Matches" },
    { key: "new", label: "New Joins" },
    { key: "nearby", label: "Near You" },
  ];

  // ── FETCH PROFILES FROM BACKEND ──
  const fetchProfiles = async (activeFilters = filters, activeSearchQuery = searchQuery) => {
    try {
      setLoading(true);
      let endpoint = "/search";

      if (activeTab === "new") endpoint = "/matches/new-joins";
      if (activeTab === "nearby") endpoint = "/matches/near-you";
      if (activeTab === "sameCity") endpoint = "/matches/same-city";
      if (activeTab === "recommended") endpoint = "/matches/recommended";

      const params = {
        minAge: activeFilters.ageFrom,
        maxAge: activeFilters.ageTo,
        religion: activeFilters.religion !== "Any" ? activeFilters.religion : undefined,
        city: activeFilters.city || undefined,
        state: activeFilters.state || undefined,
        education: activeFilters.education !== "Any" ? activeFilters.education : undefined,
        jobType: activeFilters.occupation !== "Any" ? activeFilters.occupation : undefined,
        income: activeFilters.income !== "Any" ? activeFilters.income : undefined,
        search: activeSearchQuery || undefined
      };

      const res = await api.get(endpoint, { params });

      if (res.data.success) {
        setProfiles(res.data.data || []);
        if (activeTab === "sameCity") {
          setSameCityMeta({
            city: res.data.city || "",
            message: res.data.message || "",
          });
        } else {
          setSameCityMeta({ city: "", message: "" });
        }
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
      if (activeTab === "sameCity") {
        setSameCityMeta({ city: "", message: "Unable to load same-city matches right now." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    if (!location.search) return;

    const parsedFilters = {
      ageFrom: qs.get("minAge") || "18",
      ageTo: qs.get("maxAge") || "40",
      religion: qs.get("religion") || "Any",
      city: qs.get("city") || "",
      state: qs.get("state") || "",
      education: qs.get("education") || "Any",
      occupation: qs.get("jobType") || "Any",
      income: qs.get("income") || "Any",
      heightFrom: "",
      heightTo: "",
      onlyVerified: false,
      onlyPremium: false,
    };

    const parsedSearch = qs.get("search") || "";

    setFilters((prev) => ({ ...prev, ...parsedFilters }));
    setSearchQuery(parsedSearch);
    fetchProfiles(parsedFilters, parsedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleApplyFilters = () => {
    fetchProfiles();
    setShowFilter(false);
  };

  return (
    <div className="search-page-new">
      <Navbar />

      <div className="search-container-main">
        <div className="search-content-area">

          {/* SEARCH BAR */}
          <div className="search-bar-wrap">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, city, community..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // ✅ FIX: Trigger search on Enter key
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchProfiles(filters, e.target.value);
                }}
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => {
                    setSearchQuery("");
                    fetchProfiles(filters, "");
                  }}
                >
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
          {/* ✅ FIX: onApply passed as separate prop */}
          {showFilter && (
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onApply={handleApplyFilters}
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

          {/* SAME CITY CONTEXT */}
          {activeTab === "sameCity" && (
            <div className="same-city-meta">
              <div className="same-city-pill">
                <MapPin size={15} />
                <span>
                  {sameCityMeta.city
                    ? `Using your city: ${sameCityMeta.city}`
                    : "Set your city in profile to enable same-city matches"}
                </span>
              </div>
              {sameCityMeta.message && <p className="same-city-note">{sameCityMeta.message}</p>}
            </div>
          )}

          {/* RESULTS COUNT */}
          <div className="results-info">
            {loading
              ? <span>Loading profiles...</span>
              : <span>{profiles.length} profiles found</span>
            }
          </div>

          {/* PROFILES GRID */}
          {!loading && profiles.length > 0 ? (
            <div className="profiles-grid">
              {profiles.map((p) => (
                <ProfileCard key={p._id} profile={p} />
              ))}
            </div>
          ) : !loading ? (
            <div className="no-results">
              <Search size={48} color="#DDC3C3" />
              <h3>{activeTab === "sameCity" ? "No same-city matches found" : "No profiles found"}</h3>
              <p>
                {activeTab === "sameCity"
                  ? (sameCityMeta.message || "Try broadening your filters or check back later.")
                  : "Try adjusting your filters or search query"}
              </p>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default SearchBrowse;