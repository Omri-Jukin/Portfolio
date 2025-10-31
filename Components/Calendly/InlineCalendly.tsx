"use client";

import React, { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { useRouter, usePathname } from "next/navigation";

interface InlineCalendlyProps {
  url?: string;
  className?: string;
}

const InlineCalendly = ({
  url = "https://calendly.com/omrijukin/30min",
  className = "inline-calendly",
}: InlineCalendlyProps) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for Calendly events - Enhanced callback handling
  useEffect(() => {
    if (!isClient) return;

    const handleCalendlyEvent = (e: MessageEvent) => {
      // Only process messages from Calendly origin
      if (!e.origin.includes("calendly.com")) {
        return;
      }

      // Check if this is a Calendly event
      if (e.data?.event && typeof e.data.event === "string") {
        const eventName = e.data.event;

        console.log("[Calendly] Event received:", eventName, e.data);

        // Handle event scheduled callback
        if (eventName === "calendly.event_scheduled") {
          try {
            const payload = e.data.payload;

            // Extract booking details with validation
            const inviteeEmail = payload?.invitee?.email;
            const inviteeFirstName = payload?.invitee?.first_name;
            const inviteeLastName = payload?.invitee?.last_name;
            const eventUri = payload?.event?.uri;
            const inviteeUri = payload?.invitee?.uri;

            if (!inviteeEmail || !eventUri) {
              console.error("[Calendly] Missing required fields:", {
                inviteeEmail,
                eventUri,
              });
              return;
            }

            // Get locale from pathname
            const locale = pathname.split("/")[1] || "en";

            // Build intake URL with parameters
            const intakeUrl = new URL(
              `/${locale}/intake`,
              window.location.origin
            );
            intakeUrl.searchParams.set("inviteeEmail", inviteeEmail);
            intakeUrl.searchParams.set("eventUri", eventUri);
            if (inviteeFirstName) {
              intakeUrl.searchParams.set("inviteeFirstName", inviteeFirstName);
            }
            if (inviteeLastName) {
              intakeUrl.searchParams.set("inviteeLastName", inviteeLastName);
            }
            if (inviteeUri) {
              intakeUrl.searchParams.set("inviteeUri", inviteeUri);
            }

            console.log(
              "[Calendly] Redirecting to intake form:",
              intakeUrl.toString()
            );

            // Small delay to ensure Calendly confirmation is visible
            setTimeout(() => {
              router.push(intakeUrl.pathname + intakeUrl.search);
            }, 500);
          } catch (error) {
            console.error("[Calendly] Error processing event:", error);
          }
        }
      }
    };

    // Add event listener with proper origin check
    window.addEventListener("message", handleCalendlyEvent);

    console.log("[Calendly] Event listener attached for intake form redirect");

    return () => {
      window.removeEventListener("message", handleCalendlyEvent);
      console.log("[Calendly] Event listener removed");
    };
  }, [isClient, router, pathname]);

  // Don't render until we're on the client side
  if (!isClient) {
    return null;
  }

  return (
    <Box
      className={className}
      sx={{
        width: "100%",
        height: { xs: "800px", sm: "1000px", md: "1200px" },
        minHeight: { xs: "800px", sm: "1000px", md: "1200px" },
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <InlineWidget
        url={url}
        pageSettings={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: theme.palette.primary.main.replace("#", ""),
          textColor: theme.palette.text.primary.replace("#", ""),
          hideGdprBanner: true,
        }}
        styles={{
          width: "100%",
          height: "100%",
          minHeight: "fit-content",
          border: "none",
        }}
        prefill={{
          name: "",
          email: "",
          firstName: "",
          lastName: "",
        }}
        utm={{
          utmCampaign: "Portfolio Intake",
          utmSource: "Website",
          utmMedium: "Calendly Widget",
        }}
      />
    </Box>
  );
};

export default InlineCalendly;
