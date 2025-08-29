"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Mouse as ClickIcon,
  Timer as TimeIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topPages: Array<{ name: string; views: number; percentage: number }>;
  topReferrers: Array<{ name: string; visits: number; percentage: number }>;
  deviceTypes: Array<{ type: string; count: number; percentage: number }>;
}

interface AnalyticsProps {
  title?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

const mockAnalyticsData: AnalyticsData = {
  pageViews: 1247,
  uniqueVisitors: 892,
  averageTimeOnSite: 245, // seconds
  bounceRate: 32.5,
  topPages: [
    { name: "Home", views: 456, percentage: 36.6 },
    { name: "Projects", views: 234, percentage: 18.8 },
    { name: "About", views: 189, percentage: 15.2 },
    { name: "Blog", views: 156, percentage: 12.5 },
    { name: "Contact", views: 98, percentage: 7.9 },
  ],
  topReferrers: [
    { name: "Direct", visits: 567, percentage: 45.5 },
    { name: "Google", visits: 234, percentage: 18.8 },
    { name: "LinkedIn", visits: 123, percentage: 9.9 },
    { name: "GitHub", visits: 89, percentage: 7.1 },
    { name: "Twitter", visits: 67, percentage: 5.4 },
  ],
  deviceTypes: [
    { type: "Desktop", count: 678, percentage: 54.4 },
    { type: "Mobile", count: 456, percentage: 36.6 },
    { type: "Tablet", count: 113, percentage: 9.1 },
  ],
};

export default function Analytics({
  title = "Portfolio Analytics",
  showRefresh = true,
  onRefresh,
}: AnalyticsProps) {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData({ ...mockAnalyticsData });
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <Box py={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>

        {showRefresh && (
          <Tooltip title="Refresh Analytics">
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ color: "primary.main" }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Key Metrics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Box>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <ViewIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {formatNumber(data.pageViews)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Page Views
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <ClickIcon
                sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
              />
              <Typography variant="h4" component="div" gutterBottom>
                {formatNumber(data.uniqueVisitors)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Visitors
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <TimeIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {formatTime(data.averageTimeOnSite)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Time on Site
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <TrendingIcon
                sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
              />
              <Typography variant="h4" component="div" gutterBottom>
                {data.bounceRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bounce Rate
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Detailed Analytics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {/* Top Pages */}
        <Box>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Top Pages
            </Typography>
            <Box sx={{ mt: 2 }}>
              {data.topPages.map((page) => (
                <Box key={page.name} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {page.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(page.views)}
                      </Typography>
                      <Chip
                        label={`${page.percentage}%`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={page.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Top Referrers */}
        <Box>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Top Referrers
            </Typography>
            <Box sx={{ mt: 2 }}>
              {data.topReferrers.map((referrer) => (
                <Box key={referrer.name} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {referrer.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(referrer.visits)}
                      </Typography>
                      <Chip
                        label={`${referrer.percentage}%`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={referrer.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Device Types */}
        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Device Types
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 3,
                mt: 2,
              }}
            >
              {data.deviceTypes.map((device) => (
                <Box key={device.type} sx={{ textAlign: "center" }}>
                  <Typography variant="h4" component="div" gutterBottom>
                    {formatNumber(device.count)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {device.type}
                  </Typography>
                  <Chip
                    label={`${device.percentage}%`}
                    color="success"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <LinearProgress sx={{ width: "50%" }} />
        </Box>
      )}
    </Box>
  );
}
