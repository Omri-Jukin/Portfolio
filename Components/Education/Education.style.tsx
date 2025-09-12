import styled from "@emotion/styled";
import { Box, Typography, Card, Chip, List, ListItem } from "@mui/material";

export const EducationContainer = styled(Box)`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
`;

export const EducationContent = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const EducationHeader = styled(Box)`
  text-align: center;
  margin-bottom: 60px;
`;

export const EducationTitle = styled(Typography)`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
`;

export const EducationSubtitle = styled(Typography)`
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 24px;
`;

export const EducationDescription = styled(Typography)`
  font-size: 1.1rem;
  color: #475569;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.7;
`;

export const EducationSection = styled(Box)`
  margin-bottom: 60px;
`;

export const SectionTitle = styled(Typography)`
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
`;

export const DegreeCard = styled(Card)`
  padding: 32px;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
`;

export const DegreeHeader = styled(Box)`
  margin-bottom: 24px;
`;

export const DegreeTitle = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

export const InstitutionName = styled(Typography)`
  font-size: 1.1rem;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 4px;
`;

export const DegreeDetails = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

export const DetailChip = styled(Chip)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 500;
`;

export const AchievementList = styled(List)`
  margin-top: 16px;
`;

export const AchievementItem = styled(ListItem)`
  padding-left: 0;
  padding-right: 0;

  &::before {
    content: "✓";
    color: #10b981;
    font-weight: bold;
    margin-right: 8px;
  }
`;

export const CourseworkGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

export const CourseChip = styled(Chip)`
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
`;

export const CertificationCard = styled(Card)`
  padding: 24px;
  margin-bottom: 16px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
`;

export const CertificationHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CertificationName = styled(Typography)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

export const CertificationStatus = styled(Chip)`
  background: #10b981;
  color: white;
  font-size: 0.75rem;
`;

export const CertificationDetails = styled(Typography)`
  color: #64748b;
  font-size: 0.9rem;
`;

export const CTAButton = styled(Box)`
  text-align: center;
  margin-top: 60px;
`;
