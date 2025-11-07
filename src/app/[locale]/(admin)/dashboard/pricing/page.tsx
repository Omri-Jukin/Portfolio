"use client";

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { ClientOnly } from "~/ClientOnly";
import ProjectTypesTab from "./components/ProjectTypesTab";
import FeaturesTab from "./components/FeaturesTab";
import MultipliersTab from "./components/MultipliersTab";
import MetaTab from "./components/MetaTab";
import PreviewPanel from "./components/PreviewPanel";
import CostBreakdown from "./components/CostBreakdown";
import { PricingProvider } from "./components/PricingContext";

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
      id={`pricing-tabpanel-${index}`}
      aria-labelledby={`pricing-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `pricing-tab-${index}`,
    "aria-controls": `pricing-tabpanel-${index}`,
  };
}

export default function PricingAdminPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ClientOnly skeleton>
      <PricingProvider>
        <Box id="pricing-admin-page" sx={{ width: "100%" }}>
          <Typography
            id="pricing-admin-page-title"
            variant="h4"
            gutterBottom
            color="text.primary"
          >
            Pricing Management
          </Typography>
          <Typography
            id="pricing-admin-page-description"
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Manage project types, base rates, features, multipliers, and pricing
            meta settings. All changes are dynamic and take effect immediately.
          </Typography>

          <Box
            id="pricing-admin-page-content"
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left Column: Tabs and Content */}
            <Box
              id="pricing-admin-page-content-left"
              sx={{
                flex: { md: "1 1 auto" },
                minWidth: 0,
              }}
            >
              <Paper
                id="pricing-admin-page-content-left-paper"
                sx={{ mb: 3, bgcolor: "background.paper" }}
              >
                <Box
                  id="pricing-admin-page-content-left-paper-tabs"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="pricing management tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Project Types" {...a11yProps(0)} />
                    <Tab label="Features" {...a11yProps(1)} />
                    <Tab label="Multipliers" {...a11yProps(2)} />
                    <Tab label="Meta" {...a11yProps(3)} />
                  </Tabs>
                </Box>

                <Box
                  id="pricing-admin-page-content-left-paper-tabs-content"
                  sx={{ p: 3 }}
                >
                  <TabPanel value={tabValue} index={0}>
                    <ProjectTypesTab />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <FeaturesTab />
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <MultipliersTab />
                  </TabPanel>
                  <TabPanel value={tabValue} index={3}>
                    <MetaTab />
                  </TabPanel>
                </Box>
              </Paper>

              {/* Cost Breakdown Accordion */}
              <CostBreakdown />
            </Box>

            {/* Right Column: Preview Panel (Sticky), needs to be wider */}
            <Box
              id="pricing-admin-page-content-right"
              sx={{
                flex: { md: "0 0 500px" }, // Fixed width for preview panel
                position: { md: "sticky" },
                top: { md: 100 },
                maxHeight: { md: "calc(100vh - 120px)" },
                overflow: { md: "auto" },
                alignSelf: { md: "flex-start" },
              }}
            >
              <PreviewPanel />
            </Box>
          </Box>
        </Box>
      </PricingProvider>
    </ClientOnly>
  );
}
