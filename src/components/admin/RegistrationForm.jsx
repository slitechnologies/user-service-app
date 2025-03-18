import React, { useState, useEffect } from "react";
import "../../styles/RegistrationForm.css";

const RegistrationForm = ({
  userType = "client",
  onSubmit,
  onCancel,
  isAdminCreating = false,
}) => {
  // State for current step in multi-step forms
  const [currentStep, setCurrentStep] = useState(1);

  // Form data to store all user inputs
  const [formData, setFormData] = useState({
    userType:
      userType === "service-provider"
        ? "Service Provider"
        : userType === "administrator"
        ? "Administrator"
        : "Client",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    status: "Active",
    accessLevel: "Standard",
  });

  // Specialization options based on service category
  const [specializationOptions, setSpecializationOptions] = useState([]);

  // Initialize form data based on user type whenever userType prop changes
  useEffect(() => {
    let initialData = {
      userType:
        userType === "service-provider"
          ? "Service Provider"
          : userType === "administrator"
          ? "Administrator"
          : "Client",
      serviceCategory: userType === "service-provider" ? "Healthcare" : "",
      specialization: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      experience: "",
      certifications: "",
      status: "Active",
      accessLevel: "Standard",
    };

    setFormData(initialData);
    setCurrentStep(1);
  }, [userType]);

  // Update specialization options when service category changes
  useEffect(() => {
    if (userType === "service-provider" && formData.serviceCategory) {
      // Define specialization options based on selected service category
      const options = {
        Healthcare: ["Doctor", "Nurse", "Therapist", "Dentist", "Specialist"],
        "Home Services": ["Plumber", "Electrician", "Cleaner", "Gardener"],
        "Professional Services": [
          "Lawyer",
          "Accountant",
          "Consultant",
          "IT Support",
        ],
        Education: ["Tutor", "Teacher", "Coach", "Instructor"],
      };

      setSpecializationOptions(options[formData.serviceCategory] || []);
    }
  }, [userType, formData.serviceCategory]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form navigation
  const handleNext = () => {
    // Simple validation before moving to next step
    if (currentStep === 1) {
      // Validate first step fields
      const requiredFields = ["firstName", "lastName", "email"];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        alert("Please fill in all required fields.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to parent component
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Form submitted:", formData);
      alert("Registration successful!");
    }
  };

  // Get step labels based on user type
  const getStepLabels = () => {
    if (userType === "service-provider") {
      return ["Basic Info", "Professional Info", "Verification"];
    } else if (userType === "client") {
      return ["Personal Info", "Preferences"];
    } else {
      return ["Admin Info", "Permissions"];
    }
  };

  // Shared user info fields for all user types
  const renderUserInfoFields = () => {
    return (
      <>
        <h3>User Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
        </div>

        {!isAdminCreating && (
          <>
            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                required
              />
            </div>
          </>
        )}

        {isAdminCreating && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <div className="custom-select">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="accessLevel">Access Level</label>
                <div className="custom-select">
                  <select
                    id="accessLevel"
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    {userType === "administrator" && (
                      <option value="Admin">Admin</option>
                    )}
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  // Provider registration form step 1
  const renderProviderStep1 = () => {
    return (
      <>
        {userType === "service-provider" && (
          <>
            <div className="form-group">
              <label htmlFor="serviceCategory">Service Category</label>
              <div className="custom-select">
                <select
                  id="serviceCategory"
                  name="serviceCategory"
                  value={formData.serviceCategory || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Healthcare">Healthcare</option>
                  <option value="Home Services">Home Services</option>
                  <option value="Professional Services">
                    Professional Services
                  </option>
                  <option value="Education">Education</option>
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <div className="custom-select">
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your specialization...</option>
                  {specializationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>
            </div>
          </>
        )}

        {renderUserInfoFields()}
      </>
    );
  };

  // Provider registration form step 2
  const renderProviderStep2 = () => {
    return (
      <>
        <div className="form-group">
          <label htmlFor="experience">Years of Experience</label>
          <div className="custom-select">
            <select
              id="experience"
              name="experience"
              value={formData.experience || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Select experience level...</option>
              <option value="0-1 years">0-1 years</option>
              <option value="2-5 years">2-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="certifications">Certifications</label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications || ""}
            onChange={handleInputChange}
            placeholder="List your certifications"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="education">Education</label>
          <textarea
            id="education"
            name="education"
            value={formData.education || ""}
            onChange={handleInputChange}
            placeholder="List your education"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="services">Services Offered</label>
          <textarea
            id="services"
            name="services"
            value={formData.services || ""}
            onChange={handleInputChange}
            placeholder="List services you offer"
            rows="4"
          />
        </div>
      </>
    );
  };

  // Provider registration form step 3
  const renderProviderStep3 = () => {
    return (
      <>
        <p className="verification-info">
          Please upload the following documents to verify your identity and
          credentials:
        </p>

        <div className="form-group">
          <label htmlFor="idDocument">Government-issued ID</label>
          <input
            type="file"
            id="idDocument"
            name="idDocument"
            accept="image/*,.pdf"
          />
        </div>

        <div className="form-group">
          <label htmlFor="professionalLicense">
            Professional License/Certification
          </label>
          <input
            type="file"
            id="professionalLicense"
            name="professionalLicense"
            accept="image/*,.pdf"
          />
        </div>

        <div className="form-group">
          <label htmlFor="proofOfInsurance">
            Proof of Insurance (if applicable)
          </label>
          <input
            type="file"
            id="proofOfInsurance"
            name="proofOfInsurance"
            accept="image/*,.pdf"
          />
        </div>

        <div className="form-group">
          <label htmlFor="agreementCheckbox" className="checkbox-label">
            <input
              type="checkbox"
              id="agreementCheckbox"
              name="agreementCheckbox"
              required
            />
            <span>
              I certify that all information provided is true and accurate. I
              agree to the Terms of Service and Privacy Policy.
            </span>
          </label>
        </div>
      </>
    );
  };

  // Client registration form
  const renderClientForm = () => {
    if (currentStep === 1) {
      return renderUserInfoFields();
    } else {
      return (
        <>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              placeholder="Your location"
            />
          </div>

          <div className="form-group">
            <label>Service Categories of Interest</label>
            <div className="checkbox-group">
              {[
                "Healthcare",
                "Home Services",
                "Professional Services",
                "Education",
              ].map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="interestedCategories"
                    value={category}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="agreementCheckbox" className="checkbox-label">
              <input
                type="checkbox"
                id="agreementCheckbox"
                name="agreementCheckbox"
                required
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
          </div>
        </>
      );
    }
  };

  // Admin registration form
  const renderAdminForm = () => {
    if (currentStep === 1) {
      return renderUserInfoFields();
    } else {
      return (
        <>
          <div className="form-group">
            <label>Admin Permissions</label>
            <div className="checkbox-group">
              {[
                "User Management",
                "Content Management",
                "Service Categories",
                "Provider Verification",
                "Reports",
                "Settings",
                "Billing",
              ].map((permission) => (
                <label key={permission} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={permission}
                  />
                  <span>{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adminNotes">Admin Notes</label>
            <textarea
              id="adminNotes"
              name="adminNotes"
              value={formData.adminNotes || ""}
              onChange={handleInputChange}
              placeholder="Additional notes about this administrator"
              rows="4"
            />
          </div>
        </>
      );
    }
  };

  // Render form fields based on user type and current step
  const renderFormFields = () => {
    if (userType === "service-provider") {
      if (currentStep === 1) return renderProviderStep1();
      if (currentStep === 2) return renderProviderStep2();
      if (currentStep === 3) return renderProviderStep3();
    } else if (userType === "client") {
      return renderClientForm();
    } else if (userType === "administrator") {
      return renderAdminForm();
    }
    return null;
  };

  const stepLabels = getStepLabels();

  // Custom layout for admin portal integration
  if (isAdminCreating) {
    return (
      <div className="admin-create-user-form">
        <div className="form-section">
          {renderFormFields()}

          <div className="form-actions">
            {onCancel && (
              <button className="cancel-button" onClick={onCancel}>
                Cancel
              </button>
            )}

            {currentStep < stepLabels.length ? (
              <button
                type="button"
                className="continue-button"
                onClick={handleNext}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="create-user-button"
                onClick={handleSubmit}
              >
                Create User
              </button>
            )}

            {currentStep > 1 && (
              <button
                type="button"
                className="back-button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard public-facing registration form
  return (
    <div className="registration-form-container">
      <header className="app-header">
        <div className="brand-container">
          <h1 className="brand-name">ServiceHub</h1>
        </div>
        <nav className="navigation">
          <a href="/">Home</a>
          <a href="/categories">Categories</a>
          <a href="/how-it-works">How it Works</a>
          <a href="/sign-in">Sign In</a>
        </nav>
      </header>

      <div className="form-container">
        <div className="form-wrapper">
          <h1>
            {userType === "service-provider"
              ? "Provider Registration"
              : userType === "client"
              ? "Client Registration"
              : "Admin Registration"}
          </h1>

          {/* Progress Steps */}
          <div className="progress-steps">
            {stepLabels.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className={`step ${currentStep >= index + 1 ? "active" : ""}`}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-label">{step}</div>
                </div>
                {index < stepLabels.length - 1 && (
                  <div
                    className={`step-line ${
                      currentStep > index + 1 ? "active" : ""
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <div className="form-section">
              <div className="form-fields">{renderFormFields()}</div>

              {/* Navigation Buttons */}
              <div className="form-actions">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="back-button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}

                {currentStep < stepLabels.length ? (
                  <button
                    type="button"
                    className="continue-button"
                    onClick={handleNext}
                  >
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
