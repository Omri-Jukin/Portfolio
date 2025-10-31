"use-client";

import React, { useEffect, useState } from "react";
import { PopupButton } from "react-calendly";
import { CalendlyProps } from ".";
import { useTheme } from "@mui/material/styles";
import { CalendlyContainer } from "./Calendly.style";
import { useRouter, usePathname } from "next/navigation";

const CalendlyBadge = ({
  url = "https://calendly.com/omrijukin/30min",
  text = "Book a Call!",
  backgroundColor = "#FF6B6B",
  textColor = "#FFFFFF",
  position = "bottom-right",
  className = "calendly-badge",
}: CalendlyProps) => {
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

  // Use theme colors as defaults, fallback to props if provided
  const buttonBackground = backgroundColor || theme.palette.calendly.primary;
  const buttonTextColor = textColor || theme.palette.calendly.contrastText;
  const pageBackground = theme.palette.calendly.background;
  const pageTextColor = theme.palette.text.primary;

  // Theme-aware gradient styles
  const isDarkMode = theme.palette.mode === "dark";

  const getGradientStyles = () => {
    if (isDarkMode) {
      return {
        background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
        hoverBackground: "linear-gradient(135deg, #FF5252, #FF7043)",
        shadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
        hoverShadow: "0 6px 16px rgba(255, 107, 107, 0.4)",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #4ECDC4, #44A08D)",
        hoverBackground: "linear-gradient(135deg, #3DB5AC, #3A8F7A)",
        shadow: "0 4px 12px rgba(78, 205, 196, 0.3)",
        hoverShadow: "0 6px 16px rgba(78, 205, 196, 0.4)",
      };
    }
  };

  const gradientStyles = getGradientStyles();

  // No need for complex positioning logic - handled by styled component

  // Don't render until we're on the client side
  if (!isClient) {
    return null;
  }

  return (
    <CalendlyContainer className={className} calendlyPosition={position}>
      <PopupButton
        url={url}
        pageSettings={{
          backgroundColor: pageBackground,
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: buttonBackground.replace("#", ""),
          textColor: pageTextColor.replace("#", ""),
          hideGdprBanner: true,
        }}
        rootElement={document.getElementById("root") || document.body}
        text={text}
        styles={{
          background: gradientStyles.background,
          color: buttonTextColor,
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          boxShadow: gradientStyles.shadow,
          transform: "translateY(0)",
          width: "50%",
          height: "100%",
        }}
        prefill={{
          name: "",
          email: "",
          firstName: "",
          lastName: "",
        }}
      />
    </CalendlyContainer>
  );
};

export default CalendlyBadge;
