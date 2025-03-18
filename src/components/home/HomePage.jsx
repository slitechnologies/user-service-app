import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  HealthAndSafety as HealthcareIcon,
  Gavel as LegalIcon,
  Build as TradesIcon,
  WorkOutline as BriefcaseIcon,
  Science as SpecializedIcon,
  Engineering as EngineeringIcon,
  MyLocation as CurrentLocationIcon,
} from "@mui/icons-material";
import "../../styles/home.css";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const serviceCategories = [
    {
      id: 1,
      name: "Healthcare",
      icon: <HealthcareIcon fontSize="large" />,
      color: "#4caf50",
    },
    {
      id: 2,
      name: "Legal",
      icon: <LegalIcon fontSize="large" />,
      color: "#2196f3",
    },
    {
      id: 3,
      name: "Home Services",
      icon: <TradesIcon fontSize="large" />,
      color: "#ff9800",
    },
    {
      id: 4,
      name: "Financial",
      icon: <BriefcaseIcon fontSize="large" style={{ color: "#8B4513" }} />,
      color: "#8B4513",
    },
    {
      id: 5,
      name: "Engineering",
      icon: <EngineeringIcon fontSize="large" />,
      color: "#f44336",
    },
    {
      id: 6,
      name: "Specialized Services",
      icon: <SpecializedIcon fontSize="large" />,
      color: "#607d8b",
    },
  ];

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // This would typically be reverse geocoded to get a readable address
          // For now, we'll just show coordinates
          setLocationQuery(
            `${position.coords.latitude.toFixed(
              4
            )}, ${position.coords.longitude.toFixed(4)}`
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleSearch = () => {
    // In a real implementation, this would navigate to search results
    // with the query parameters
    console.log("Searching for:", searchQuery, "in location:", locationQuery);
    // Implement search functionality or navigation here
  };

  return (
    <div className="homepage">
      <NavBar />

      {/* Hero Section with Enhanced Search */}
      <div className="hero-section">
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              backgroundColor: "#f0f5ff",
              borderRadius: "8px",
              mb: 4,
              px: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              Find Professional Services
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              Connect with verified service providers in your area
            </Typography>

            <Box sx={{ maxWidth: "700px", mx: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="What service are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "4px",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your location"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "4px",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={handleCurrentLocation}
                            sx={{ minWidth: "40px" }}
                          >
                            <CurrentLocationIcon fontSize="small" />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSearch}
                    sx={{ mt: 1, px: 4 }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>

      {/* Service Categories Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Browse Categories
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
          gap={2}
        >
          {serviceCategories.slice(0, 4).map((category) => (
            <Paper
              key={category.id}
              elevation={1}
              sx={{
                p: 3,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#f0f5ff",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {category.icon}
              </Box>
              <Typography variant="subtitle1" align="center">
                {category.name}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default HomePage;
