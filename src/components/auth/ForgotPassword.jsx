import React, { useState } from "react";
import "../../styles/forgot.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8082/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError); // Use parseError here
        throw new Error(
          `Failed to parse response from the server. Details: ${parseError.message}`
        );
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to request password reset");
      }

      setMessage(
        data?.message ||
          "If your email exists in our system, you will receive a password reset link shortly."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>
        Enter your email address and we'll send you instructions to reset your
        password.
      </p>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            aria-label="Enter your email address"
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="links">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPassword;

// import React, { useState } from "react";
// import "../../styles/forgot.css";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await fetch(
//         "http://localhost:8082/api/users/forgot-password",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email }),
//         }
//       );

//       let data;
//       try {
//         data = await response.json();
//       } catch (parseError) {
//         throw new Error("Failed to parse response from the server.");
//       }

//       if (!response.ok) {
//         throw new Error(data?.message || "Failed to request password reset");
//       }

//       setMessage(
//         data?.message ||
//           "If your email exists in our system, you will receive a password reset link shortly."
//       );
//       setEmail("");
//     } catch (err) {
//       setError(err.message || "An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       <h2>Forgot Password</h2>
//       <p>
//         Enter your email address and we'll send you instructions to reset your
//         password.
//       </p>

//       {message && <div className="success-message">{message}</div>}
//       {error && <div className="error-message">{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="email">Email Address</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             placeholder="Enter your email"
//             aria-label="Enter your email address"
//           />
//         </div>

//         <button
//           type="submit"
//           className="submit-button"
//           disabled={isSubmitting}
//           aria-busy={isSubmitting}
//         >
//           {isSubmitting ? "Sending..." : "Send Reset Link"}
//         </button>
//       </form>

//       <div className="links">
//         <a href="/login">Back to Login</a>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
