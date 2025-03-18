import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/forgot.css";

const ResetPassword = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("No reset token provided");
      setTokenChecked(true);
      setTokenValid(false);
    }
  }, [location]);

  // Validate the token when extracted from URL
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/users/reset-password/validate?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.valid) {
          throw new Error("Invalid or expired reset token");
        }

        setTokenValid(true);
      } catch (err) {
        setError(err.message || "Invalid or expired token");
        setTokenValid(false);
      } finally {
        setTokenChecked(true);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password strength
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8082/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage(
        data.message || "Your password has been updated successfully."
      );

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenChecked) {
    return <div className="loading">Validating reset token...</div>;
  }

  if (!tokenValid) {
    return (
      <div className="invalid-token">
        <h2>Invalid or Expired Link</h2>
        <p>The password reset link is invalid or has expired.</p>
        <p>Please request a new password reset link.</p>
        <a href="/forgot-password" className="button">
          Request New Link
        </a>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <p>Please enter your new password below.</p>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>

        <div className="password-requirements">
          <p>Password must:</p>
          <ul>
            <li className={newPassword.length >= 8 ? "valid" : "invalid"}>
              Be at least 8 characters long
            </li>
            <li className={/[A-Z]/.test(newPassword) ? "valid" : "invalid"}>
              Include at least one uppercase letter
            </li>
            <li className={/[0-9]/.test(newPassword) ? "valid" : "invalid"}>
              Include at least one number
            </li>
            <li
              className={/[^A-Za-z0-9]/.test(newPassword) ? "valid" : "invalid"}
            >
              Include at least one special character
            </li>
          </ul>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
