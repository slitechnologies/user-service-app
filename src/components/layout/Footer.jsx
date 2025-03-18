import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        backgroundColor: "#f5f5f5",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 ServiceHub - Professional Services Marketplace
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;