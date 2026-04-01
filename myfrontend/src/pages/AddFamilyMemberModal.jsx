import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./AddFamilyMemberModal.css";

const AddFamilyMemberModal = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "mother",
    contactInfo: "",
    accessLevel: "view-only",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        relationship: initialData.relationship || "mother",
        contactInfo: initialData.contactInfo || "",
        accessLevel: initialData.accessLevel || "view-only",
      });
    }
  }, [initialData]);

  const relationships = [
    { value: "mother", label: "Mother" },
    { value: "father", label: "Father" },
    { value: "sister", label: "Sister" },
    { value: "brother", label: "Brother" },
    { value: "grandmother", label: "Grandmother" },
    { value: "grandfather", label: "Grandfather" },
    { value: "aunt", label: "Aunt" },
    { value: "uncle", label: "Uncle" },
    { value: "cousin", label: "Cousin" },
    { value: "other", label: "Other Family Member" },
  ];

  const accessLevels = [
    {
      value: "view-only",
      label: "View-Only",
      description: "Can see profiles but cannot save or message",
    },
    {
      value: "shortlist-only",
      label: "Shortlist-Only",
      description: "Can view and save profiles, but cannot message",
    },
    {
      value: "full-access",
      label: "Full Access",
      description: "Can view, save, message, and fully participate",
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.relationship) newErrors.relationship = "Relationship is required";
    if (!formData.accessLevel) newErrors.accessLevel = "Access level is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "Edit Family Member" : "Add Family Member"}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* NAME FIELD */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Mom, Dad, Sister"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* RELATIONSHIP FIELD */}
          <div className="form-group">
            <label htmlFor="relationship">Relationship *</label>
            <select
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              className={errors.relationship ? "error" : ""}
            >
              {relationships.map((rel) => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </select>
            {errors.relationship && (
              <span className="error-msg">{errors.relationship}</span>
            )}
          </div>

          {/* CONTACT INFO FIELD */}
          <div className="form-group">
            <label htmlFor="contactInfo">Contact Info (Optional)</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="Phone or email"
            />
          </div>

          {/* ACCESS LEVEL FIELD */}
          <div className="form-group">
            <label>Access Level *</label>
            <div className="access-level-options">
              {accessLevels.map((level) => (
                <label key={level.value} className="access-option">
                  <input
                    type="radio"
                    name="accessLevel"
                    value={level.value}
                    checked={formData.accessLevel === level.value}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <span className="option-label">{level.label}</span>
                    <span className="option-desc">{level.description}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.accessLevel && (
              <span className="error-msg">{errors.accessLevel}</span>
            )}
          </div>

          {/* FORM ACTIONS */}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {initialData ? "Update Family Member" : "Add Family Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;