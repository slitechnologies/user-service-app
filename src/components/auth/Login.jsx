import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleIcon from "@mui/icons-material/Google";
import "../../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rememberMe" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8082/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      const userRoles = response.data.user.roles;
      if (userRoles.includes("ROLE_ADMIN")) {
        navigate("/admin-dashboard");
      } else if (userRoles.includes("ROLE_PROVIDER")) {
        navigate("/provider-dashboard");
      } else if (userRoles.includes("ROLE_CLIENT")) {
        navigate("/");
      } else {
        setError("Unable to determine user role for redirection.");
      }
    } catch (error) {
      console.error("Login failed:", error);

      // Handle specific error messages from the backend
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else if (
          error.response.data &&
          typeof error.response.data === "string" &&
          error.response.data.includes("Invalid email or password")
        ) {
          setError(
            "The email or password you entered is incorrect. Please try again."
          );
        } else if (error.response.status === 401) {
          setError(
            "Invalid credentials. Please check your email and password."
          );
        } else if (error.response.status === 403) {
          setError("Your account doesn't have permission to log in.");
        } else if (error.response.status >= 500) {
          setError(
            "We're experiencing technical difficulties. Please try again later."
          );
        } else {
          setError("An error occurred during login. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        // Something else caused the error
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "calc(100vh - 64px)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={1}
          sx={{
            maxWidth: 500,
            mx: "auto",
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={500}
              gutterBottom
            >
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access your ServiceHub account
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box mb={2.5}>
              <Typography variant="body1" mb={1}>
                Email
              </Typography>
              <TextField
                name="email"
                placeholder="Enter your email"
                variant="outlined"
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                size="medium"
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
                error={Boolean(error && error.toLowerCase().includes("email"))}
              />
            </Box>

            <Box mb={1}>
              <Typography variant="body1" mb={1}>
                Password
              </Typography>
              <TextField
                name="password"
                placeholder="********"
                variant="outlined"
                fullWidth
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                size="medium"
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
                error={Boolean(
                  error && error.toLowerCase().includes("password")
                )}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    name="rememberMe"
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: "#4285f4",
                  fontSize: "0.875rem",
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                backgroundColor: "#4285f4",
                "&:hover": {
                  backgroundColor: "#3367d6",
                },
                borderRadius: 50,
              }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <Box textAlign="center" my={2}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Box>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              color: "#757575",
              borderColor: "#dadce0",
              "&:hover": {
                borderColor: "#bbb",
                backgroundColor: "#f8f8f8",
              },
              borderRadius: 50,
            }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#4285f4",
                  fontWeight: 500,
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;