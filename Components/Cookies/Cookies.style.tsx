import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const CookiesContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  z-index: 1000;
  padding: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

export const CookiesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
`;

export const CookiesText = styled.div`
  flex: 1;
  color: #f8fafc;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #ffffff;
  }

  p {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #cbd5e1;
    margin: 0;
  }

  @media (min-width: 768px) {
    h3 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

export const CookiesActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

export const CookieButton = styled.button<{
  variant?: "primary" | "secondary" | "outline";
}>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  white-space: nowrap;

  ${({ variant = "primary" }) => {
    switch (variant) {
      case "primary":
        return `
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        `;
      case "secondary":
        return `
          background: rgba(148, 163, 184, 0.1);
          color: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.3);
          &:hover {
            background: rgba(148, 163, 184, 0.2);
            border-color: rgba(148, 163, 184, 0.5);
          }
        `;
      case "outline":
        return `
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
          &:hover {
            color: #f8fafc;
            border-color: rgba(148, 163, 184, 0.5);
            background: rgba(148, 163, 184, 0.1);
          }
        `;
      default:
        return "";
    }
  }}

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const CustomizePanel = styled(motion.div)`
  background: rgba(15, 23, 42, 0.98);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const CustomizeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #f8fafc;
  }
`;

export const CookieCategories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const CookieCategory = styled.div<{ required?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: border-color 0.2s ease;

  ${({ required }) =>
    required &&
    `
    border-color: rgba(34, 197, 94, 0.3);
    background: rgba(34, 197, 94, 0.05);
  `}
`;

export const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .required-badge {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
  }
`;

export const CategoryDescription = styled.p`
  font-size: 0.875rem;
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
  cursor: pointer;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: #3b82f6;
  }

  &:checked + span:before {
    transform: translateX(1.5rem);
  }

  &:disabled + span {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(148, 163, 184, 0.3);
  transition: 0.2s;
  border-radius: 1.5rem;

  &:before {
    position: absolute;
    content: "";
    height: 1.25rem;
    width: 1.25rem;
    left: 0.125rem;
    bottom: 0.125rem;
    background: white;
    transition: 0.2s;
    border-radius: 50%;
  }
`;

export const CustomizeActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;
