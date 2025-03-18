import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/auth.css";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("client");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    userType: "client",
    roles: ["ROLE_CLIENT"],
    serviceCategory: "Healthcare",
    specialization: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData({
      ...formData,
      userType: type,
      roles: type === "provider" ? ["ROLE_PROVIDER"] : ["ROLE_CLIENT"],
    });
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    // Check if all required fields are filled
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "password",
      "confirmPassword",
    ];

    // Add provider-specific required fields
    if (userType === "provider") {
      requiredFields.push("serviceCategory", "specialization");
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(`Please fill in all required fields`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (userType === "provider" && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Prepare the data object based on API expectations
      const submitData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        roles: formData.roles,
      };

      // Add provider-specific fields only when user type is provider
      if (userType === "provider") {
        submitData.serviceCategory = formData.serviceCategory;
        submitData.specialization = formData.specialization;
      }

      const response = await axios.post(
        "http://localhost:8082/api/users/register",
        submitData
      );

      console.log("Registration successful:", response.data);
      alert("Registration successful! Redirecting to login page...");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderClientRegistration = () => {
    return (
      <div className="registration-container">
        <h2 className="registration-title">Create Your Account</h2>

        <div className="user-type-selection">
          <p>I want to:</p>
          <div className="button-group">
            <button
              type="button"
              className={`type-button ${userType === "client" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("client")}
            >
              Find Services
            </button>
            <button
              type="button"
              className={`type-button ${
                userType === "provider" ? "active" : ""
              }`}
              onClick={() => handleUserTypeChange("provider")}
            >
              Provide Services
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="section-title">Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    );
  };

  const renderProviderRegistrationStep1 = () => {
    return (
      <div className="registration-container">
        <h2 className="registration-title">Provider Registration</h2>

        <div className="progress-bar">
          <div className="progress-step active">
            <div className="step-number">1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Professional Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Verification</div>
          </div>
        </div>

        <form onSubmit={handleContinue}>
          <div className="form-group">
            <label htmlFor="serviceCategory">Service Category</label>
            <div className="select-wrapper">
              <select
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                required
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Legal">Legal</option>
                <option value="Trades">Trades</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Specialized">Specialized</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <div className="select-wrapper">
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your specialization...
                </option>
                <option value="General Medicine">General Medicine</option>
                <option value="Dentistry">Dentistry</option>
                <option value="Physical Therapy">Physical Therapy</option>
                <option value="Nursing">Nursing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <h3 className="section-title">Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            Continue
          </button>
        </form>
      </div>
    );
  };

  const renderProviderRegistrationStep2 = () => {
    return (
      <div className="registration-container">
        <h2 className="registration-title">Provider Registration</h2>

        <div className="progress-bar">
          <div className="progress-step active">
            <div className="step-number">1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step active">
            <div className="step-number">2</div>
            <div className="step-label">Professional Info</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Verification</div>
          </div>
        </div>

        <form onSubmit={handleContinue}>
          <h3 className="section-title">Professional Information</h3>

          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              placeholder="Enter years of experience"
              min="0"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="education">Education</label>
            <input
              type="text"
              id="education"
              name="education"
              placeholder="Highest degree or certification"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="license">License Number (if applicable)</label>
            <input
              type="text"
              id="license"
              name="license"
              placeholder="Professional license number"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Professional Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              placeholder="Tell clients about your expertise and services"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="button-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderProviderRegistrationStep3 = () => {
    return (
      <div className="registration-container">
        <h2 className="registration-title">Provider Registration</h2>

        <div className="progress-bar">
          <div className="progress-step active">
            <div className="step-number">1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step active">
            <div className="step-number">2</div>
            <div className="step-label">Professional Info</div>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step active">
            <div className="step-number">3</div>
            <div className="step-label">Verification</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="section-title">Verification</h3>

          <div className="info-box">
            <p>
              To complete your registration as a service provider, we need to
              verify your professional information. Please review the
              information below and submit your application.
            </p>
          </div>

          <div className="verification-summary">
            <h4>Personal Information</h4>
            <p>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phoneNumber}
            </p>

            <h4>Professional Information</h4>
            <p>
              <strong>Category:</strong> {formData.serviceCategory}
            </p>
            <p>
              <strong>Specialization:</strong> {formData.specialization}
            </p>
          </div>

          <div className="form-group checkbox-group">
            <input type="checkbox" id="termsAgree" name="termsAgree" required />
            <label htmlFor="termsAgree">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="infoConfirm"
              name="infoConfirm"
              required
            />
            <label htmlFor="infoConfirm">
              I confirm that all information provided is accurate and complete
            </label>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="button-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderProviderRegistration = () => {
    switch (currentStep) {
      case 1:
        return renderProviderRegistrationStep1();
      case 2:
        return renderProviderRegistrationStep2();
      case 3:
        return renderProviderRegistrationStep3();
      default:
        return renderProviderRegistrationStep1();
    }
  };

  return (
    <div className="auth-container">
      <header className="header">
        <div className="logo">
          <Link to="/">ServiceHub</Link>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/how-it-works">How it Works</Link>
            </li>
            <li>
              <Link to="/login">Sign In</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        {userType === "provider"
          ? renderProviderRegistration()
          : renderClientRegistration()}
      </main>
    </div>
  );
};

export default Register;
