"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Container } from "@mui/material";
import { CondensedResume, Portfolio, MotionWrapper } from "#/Components";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resume-portfolio-tabpanel-${index}`}
      aria-labelledby={`resume-portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `resume-portfolio-tab-${index}`,
    "aria-controls": `resume-portfolio-tabpanel-${index}`,
  };
}

export default function ResumePortfolioPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <MotionWrapper variant="fadeInUp" duration={0.8}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Professional Profile
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            Choose my preferred view: Quick resume overview or detailed
            technical portfolio
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="resume and portfolio tabs"
            centered
            sx={{
              "& .MuiTab-root": {
                fontSize: "1.1rem",
                fontWeight: "medium",
                minHeight: "60px",
              },
            }}
          >
            <Tab
              label="Condensed Resume"
              {...a11yProps(0)}
              sx={{
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              }}
            />
            <Tab
              label="Technical Portfolio"
              {...a11yProps(1)}
              sx={{
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              }}
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <MotionWrapper variant="fadeInUp" duration={0.8} delay={0.2}>
            <CondensedResume />
          </MotionWrapper>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <MotionWrapper variant="fadeInUp" duration={0.8} delay={0.2}>
            <Portfolio />
          </MotionWrapper>
        </TabPanel>
      </MotionWrapper>
    </Container>
  );
}
