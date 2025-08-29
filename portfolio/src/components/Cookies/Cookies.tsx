"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  CookiesContainer,
  CookiesContent,
  CookiesText,
  CookiesActions,
  CookieButton,
  CustomizePanel,
  CustomizeHeader,
  CloseButton,
  CookieCategories,
  CookieCategory,
  CategoryHeader,
  CategoryTitle,
  CategoryDescription,
  ToggleSwitch,
  ToggleInput,
  ToggleSlider,
  CustomizeActions,
} from "./Cookies.style";
import {
  CookiesProps,
  CookiePreferences,
  CookieCategory as CookieCategoryType,
} from "./Cookies.type";

const COOKIE_CATEGORIES: CookieCategoryType[] = [
  {
    id: "necessary",
    title: "Necessary",
    description:
      "These cookies are essential for the website to function properly. They cannot be disabled.",
    required: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    required: false,
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
    required: false,
  },
  {
    id: "preferences",
    title: "Preferences",
    description:
      "These cookies allow the website to remember choices you make and provide enhanced, more personal features.",
    required: false,
  },
];

const STORAGE_KEY = "cookie-preferences";

const Cookies: React.FC<CookiesProps> = ({
  isVisible = true,
  onAcceptAll,
  onAcceptSelected,
  onDecline,
  onCustomize,
  className,
}) => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<{
    isVisible: boolean;
    showCustomize: boolean;
    preferences: CookiePreferences;
  }>({
    isVisible: false, // Start hidden to prevent hydration mismatch
    showCustomize: false,
    preferences: {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    },
  });

  useEffect(() => {
    // Set mounted to true after hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run after hydration to prevent SSR mismatch
    if (!mounted) return;

    const storedPreferences = getStoredPreferences();
    if (storedPreferences) {
      setState((prev) => ({
        ...prev,
        isVisible: false,
        preferences: storedPreferences,
      }));
    } else {
      // Show the banner if no preferences are stored and component should be visible
      setState((prev) => ({
        ...prev,
        isVisible: isVisible,
      }));
    }
  }, [isVisible, mounted]);

  function getStoredPreferences(): CookiePreferences | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  function savePreferences(preferences: CookiePreferences): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }

  function handleAcceptAll(): void {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    savePreferences(allAccepted);
    setState((prev) => ({ ...prev, isVisible: false }));
    onAcceptAll?.(allAccepted);
  }

  function handleAcceptSelected(): void {
    savePreferences(state.preferences);
    setState((prev) => ({ ...prev, isVisible: false, showCustomize: false }));
    onAcceptSelected?.(state.preferences);
  }

  function handleDecline(): void {
    const minimalPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    savePreferences(minimalPreferences);
    setState((prev) => ({ ...prev, isVisible: false }));
    onDecline?.();
  }

  function handleCustomize(): void {
    setState((prev) => ({ ...prev, showCustomize: true }));
    onCustomize?.();
  }

  function handleCloseCustomize(): void {
    setState((prev) => ({ ...prev, showCustomize: false }));
  }

  function handlePreferenceChange(
    category: keyof CookiePreferences,
    value: boolean
  ): void {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: value,
      },
    }));
  }

  function handleToggleCategory(category: keyof CookiePreferences): void {
    if (category === "necessary") return; // Cannot disable necessary cookies

    const newValue = !state.preferences[category];
    handlePreferenceChange(category, newValue);
  }

  const containerVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  const panelVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!state.isVisible && !state.showCustomize) {
    return null;
  }

  return (
    <AnimatePresence>
      <CookiesContainer
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!state.showCustomize ? (
          <CookiesContent>
            <CookiesText>
              <h3>🍪 We use cookies</h3>
              <p>
                We use cookies to enhance your browsing experience, serve
                personalized content, and analyze our traffic. By clicking
                &ldquo;Accept All&rdquo;, you consent to our use of cookies.
              </p>
            </CookiesText>

            <CookiesActions>
              <CookieButton variant="outline" onClick={handleDecline}>
                Decline
              </CookieButton>
              <CookieButton variant="secondary" onClick={handleCustomize}>
                Customize
              </CookieButton>
              <CookieButton variant="primary" onClick={handleAcceptAll}>
                Accept All
              </CookieButton>
            </CookiesActions>
          </CookiesContent>
        ) : (
          <CustomizePanel
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CustomizeHeader>
              <h4>Cookie Preferences</h4>
              <CloseButton
                onClick={handleCloseCustomize}
                aria-label="Close customize panel"
              >
                ×
              </CloseButton>
            </CustomizeHeader>

            <CookieCategories>
              {COOKIE_CATEGORIES.map((category) => (
                <CookieCategory key={category.id} required={category.required}>
                  <CategoryHeader>
                    <CategoryTitle>
                      <h5>{category.title}</h5>
                      {category.required && (
                        <span className="required-badge">Required</span>
                      )}
                    </CategoryTitle>

                    <ToggleSwitch>
                      <ToggleInput
                        type="checkbox"
                        checked={state.preferences[category.id]}
                        onChange={() => handleToggleCategory(category.id)}
                        disabled={category.required}
                      />
                      <ToggleSlider />
                    </ToggleSwitch>
                  </CategoryHeader>

                  <CategoryDescription>
                    {category.description}
                  </CategoryDescription>
                </CookieCategory>
              ))}
            </CookieCategories>

            <CustomizeActions>
              <CookieButton variant="outline" onClick={handleCloseCustomize}>
                Cancel
              </CookieButton>
              <CookieButton variant="primary" onClick={handleAcceptSelected}>
                Save Preferences
              </CookieButton>
            </CustomizeActions>
          </CustomizePanel>
        )}
      </CookiesContainer>
    </AnimatePresence>
  );
};

export default Cookies;
