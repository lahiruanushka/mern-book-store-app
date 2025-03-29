import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/book.jfif";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { text: "Books", path: "/categories" },
        { text: "New Releases", path: "/new-releases" },
        { text: "Best Sellers", path: "/best-sellers" },
        { text: "Deals & Promotions", path: "/deals" },
      ],
    },
    {
      title: "Account",
      links: [
        { text: "My Account", path: "/profile" },
        { text: "My Orders", path: "/orders" },
        { text: "Wishlist", path: "/wishlist" },
        { text: "Shopping Cart", path: "/cart" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", path: "/about" },
        { text: "Contact Us", path: "/contact" },
        { text: "Careers", path: "/careers" },
        { text: "Blog", path: "/blog" },
      ],
    },
    {
      title: "Help",
      links: [
        { text: "FAQs", path: "/faqs" },
        { text: "Shipping Policy", path: "/shipping" },
        { text: "Return Policy", path: "/returns" },
        { text: "Privacy Policy", path: "/privacy" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: "white",
        pt: 6,
        pb: 3,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and About Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <img
                src={Logo}
                alt="BookWhiz Logo"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              <Typography variant="h6" component="div">
                BookWhiz
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your ultimate destination for books of all genres. Discover new
              releases, bestsellers, and classics all in one place.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <IconButton
                color="inherit"
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
              >
                <Facebook size={20} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Twitter"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
              >
                <Twitter size={20} />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
              >
                <Instagram size={20} />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer Links */}
          {!isMobile &&
            footerLinks.map((section) => (
              <Grid item xs={6} sm={3} md={2} key={section.title}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  {section.title}
                </Typography>
                <Box
                  component="ul"
                  sx={{ listStyle: "none", padding: 0, margin: 0 }}
                >
                  {section.links.map((link) => (
                    <Box component="li" key={link.text} sx={{ mb: 1 }}>
                      <Link
                        color="inherit"
                        underline="hover"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(link.path)}
                      >
                        {link.text}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}

          {/* Mobile Links (Accordion or simplified) */}
          {isMobile && (
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                {footerLinks.map((section) => (
                  <Grid item xs={6} key={section.title}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      {section.title}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ listStyle: "none", padding: 0, margin: 0 }}
                    >
                      {section.links.slice(0, 2).map((link) => (
                        <Box component="li" key={link.text} sx={{ mb: 1 }}>
                          <Link
                            color="inherit"
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(link.path)}
                          >
                            {link.text}
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Mail size={16} style={{ marginRight: 8 }} />
              <Link
                color="inherit"
                href="mailto:support@bookwhiz.com"
                underline="hover"
              >
                support@bookwhiz.com
              </Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone size={16} style={{ marginRight: 8 }} />
              <Link color="inherit" href="tel:+11234567890" underline="hover">
                +1 (123) 456-7890
              </Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <MapPin size={16} style={{ marginRight: 8, marginTop: 4 }} />
              <Typography variant="body2">
                123 Book Street, Reading City,
                <br />
                Bookland, BK 12345
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <Typography variant="body2" sx={{ mb: isMobile ? 1 : 0 }}>
            © {new Date().getFullYear()} BookWhiz. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link color="inherit" underline="hover" sx={{ cursor: "pointer" }}>
              Terms of Service
            </Link>
            <Link color="inherit" underline="hover" sx={{ cursor: "pointer" }}>
              Privacy Policy
            </Link>
            <Link color="inherit" underline="hover" sx={{ cursor: "pointer" }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;