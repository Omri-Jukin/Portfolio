"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import { api } from "$/trpc/client";
import { formatMoney } from "$/pricing/calcProposalTotals";

interface AddPricingItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: {
    label: string;
    unitPriceMinor: number;
    featureKey?: string;
    description?: string;
  }) => void;
  currency: string;
}

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
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AddPricingItemDialog({
  open,
  onClose,
  onSelect,
  currency,
}: AddPricingItemDialogProps) {
  const [tabValue, setTabValue] = useState(0);

  const { data: projectTypes, isLoading: projectTypesLoading } =
    api.pricing.projectTypes.getAll.useQuery({ includeInactive: false });

  const { data: features, isLoading: featuresLoading } =
    api.pricing.features.getAll.useQuery({ includeInactive: false });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectProjectType = (projectType: {
    key: string;
    displayName: string;
    baseRateIls: number;
  }) => {
    // Convert ILS to the proposal currency (simplified - would need proper conversion)
    const priceInCurrency = projectType.baseRateIls; // TODO: Add currency conversion
    onSelect({
      label: projectType.displayName,
      unitPriceMinor: Math.round(priceInCurrency * 100), // Convert to minor units
      description: `Base rate for ${projectType.displayName.toLowerCase()}`,
    });
    onClose();
  };

  const handleSelectFeature = (feature: {
    key: string;
    displayName: string;
    defaultCostIls: number;
  }) => {
    // Convert ILS to the proposal currency (simplified - would need proper conversion)
    const priceInCurrency = feature.defaultCostIls; // TODO: Add currency conversion
    onSelect({
      label: feature.displayName,
      unitPriceMinor: Math.round(priceInCurrency * 100), // Convert to minor units
      featureKey: feature.key,
      description: `Feature: ${feature.displayName}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Item from Pricing System</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Project Types" />
            <Tab label="Features" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {projectTypesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : projectTypes && projectTypes.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {projectTypes.map(
                (pt: {
                  key: string;
                  displayName: string;
                  baseRateIls: number;
                }) => (
                  <Box sx={{ xs: 12, sm: 6, md: 4 }} key={pt.key}>
                    <Card variant="outlined">
                      <CardActionArea
                        onClick={() =>
                          handleSelectProjectType({
                            key: pt.key,
                            displayName: pt.displayName,
                            baseRateIls: pt.baseRateIls,
                          })
                        }
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {pt.displayName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Base Rate
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {formatMoney(
                              Math.round(pt.baseRateIls * 100),
                              currency
                            )}
                          </Typography>
                          <Chip
                            label={pt.key}
                            size="small"
                            sx={{ mt: 1 }}
                            variant="outlined"
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Box>
                )
              )}
            </Grid>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              No project types available
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {featuresLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : features && features.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {features.map((feature) => (
                <Box sx={{ xs: 12, sm: 6, md: 4 }} key={feature.key}>
                  <Card variant="outlined">
                    <CardActionArea
                      onClick={() =>
                        handleSelectFeature({
                          key: feature.key,
                          displayName: feature.displayName,
                          defaultCostIls: feature.defaultCostIls,
                        })
                      }
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {feature.displayName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Feature Cost
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {formatMoney(
                            Math.round(feature.defaultCostIls * 100),
                            currency
                          )}
                        </Typography>
                        <Chip
                          label={feature.key}
                          size="small"
                          sx={{ mt: 1 }}
                          variant="outlined"
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              ))}
            </Grid>
          ) : (
            <Typography
              color="text.secondary"
              sx={{ p: 3, textAlign: "center" }}
            >
              No features available
            </Typography>
          )}
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
