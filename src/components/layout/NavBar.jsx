import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import "../../styles/NavBar.css";

const NavBar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            component="a"
            href="/"
            sx={{
              fontWeight: "bold",
              color: "#4285F4",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            ManaService
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" href="/">
              Home
            </Button>
            <Button color="inherit" href="/categories">
              Categories
            </Button>
            <Button color="inherit" href="/how-it-works">
              How it Works
            </Button>
            <Button color="inherit" href="/login">
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
