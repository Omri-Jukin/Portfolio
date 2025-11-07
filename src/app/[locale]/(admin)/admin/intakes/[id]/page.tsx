/**
 * Intake Detail Page
 * 
 * TEMPORARILY DISABLED - Intake functionality requires Node.js APIs (nodemailer)
 * which are not compatible with Cloudflare Workers runtime.
 */

export default function IntakeDetailPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>📋 Intake Details</h1>
      <div style={{ 
        padding: "1.5rem", 
        backgroundColor: "#fff3cd", 
        border: "1px solid #ffc107",
        borderRadius: "8px",
        marginTop: "1rem"
      }}>
        <h2 style={{ marginTop: 0 }}>⚠️ Feature Temporarily Unavailable</h2>
        <p>
          Intake form details are currently disabled while we migrate to a 
          Cloudflare-compatible email service.
        </p>
        <p style={{ marginBottom: 0 }}>
          This feature will be restored once the migration is complete.
        </p>
      </div>
    </div>
  );
}

// ==================================================================================
// ORIGINAL IMPLEMENTATION - TEMPORARILY COMMENTED OUT FOR CLOUDFLARE COMPATIBILITY
// ==================================================================================

// "use client";
// 
// import React from "react";
// import {
//   Box,
//   Typography,
//   Container,
//   CircularProgress,
//   Alert,
//   Button,
//   Paper,
//   Stack,
//   Divider,
//   Chip,
// } from "@mui/material";
// import { api } from "$/trpc/client";
// import { useRouter, useParams } from "next/navigation";
// import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
// import { ClientOnly } from "~/ClientOnly";
// 
// const AdminIntakeDetail = () => {
//   const router = useRouter();
//   const params = useParams();
//   const intakeId = params.id as string;
// 
//   const {
//     data: intake,
//     isLoading,
//     error,
//   } = api.intakes.getById.useQuery({ id: intakeId }, { enabled: !!intakeId });
// 
//   if (isLoading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }
//   if (error || !intake) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Alert severity="error">{error?.message || "Intake not found"}</Alert>
//       </Container>
//     );
//   }
// 
//   const data = intake.data as Record<string, unknown>;
//   const contact = data.contact as Record<string, unknown> | undefined;
//   const org = data.org as Record<string, unknown> | undefined;
//   const project = data.project as Record<string, unknown> | undefined;
//   const additional = data.additional as Record<string, unknown> | undefined;
// 
//   // Helper function to safely convert unknown to string
//   const safeString = (value: unknown): string => {
//     return typeof value === "string" ? value : "";
//   };
// 
//   // Type-safe getters for nested data
//   const orgName = safeString(org?.name);
//   const orgWebsite = typeof org?.website === "string" ? org.website : null;
//   const orgIndustry = typeof org?.industry === "string" ? org.industry : null;
//   const orgSize = typeof org?.size === "string" ? org.size : null;
// 
//   const projectTitle = safeString(project?.title);
//   const projectDescription = safeString(project?.description);
//   const projectTimeline =
//     typeof project?.timeline === "string" ? project.timeline : null;
//   const projectBudget =
//     typeof project?.budget === "string" ? project.budget : null;
//   const projectStartDate =
//     typeof project?.startDate === "string" ? project.startDate : null;
// 
//   const additionalPreferredContact =
//     typeof additional?.preferredContactMethod === "string"
//       ? additional.preferredContactMethod
//       : null;
//   const additionalTimezone =
//     typeof additional?.timezone === "string" ? additional.timezone : null;
//   const additionalUrgency =
//     typeof additional?.urgency === "string" ? additional.urgency : null;
//   const additionalNotes =
//     typeof additional?.notes === "string" ? additional.notes : null;
// 
//   const projectTechnologies =
//     project && Array.isArray(project.technologies)
//       ? (project.technologies as string[])
//       : [];
// 
//   return (
//     <ClientOnly skeleton>
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Box sx={{ mb: 3 }}>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => router.push("/admin/intakes")}
//           >
//             Back to Intakes
//           </Button>
//         </Box>
// 
//         <Stack spacing={3}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h4" gutterBottom>
//               Intake Details
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Email: {intake.email}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Created:{" "}
//               {intake.createdAt
//                 ? new Date(intake.createdAt).toLocaleString()
//                 : "N/A"}
//             </Typography>
//           </Paper>
// 
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h5" gutterBottom>
//               Contact Information
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//             <Stack spacing={1}>
//               <Typography>
//                 <strong>Name:</strong> {safeString(contact?.firstName)}{" "}
//                 {safeString(contact?.lastName)}
//               </Typography>
//               <Typography>
//                 <strong>Email:</strong> {safeString(contact?.email)}
//               </Typography>
//               <Typography>
//                 <strong>Phone:</strong> {safeString(contact?.phone)}
//               </Typography>
//             </Stack>
//           </Paper>
// 
//           {org && (
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h5" gutterBottom>
//                 Organization
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Stack spacing={1}>
//                 <Typography>
//                   <strong>Name:</strong> {orgName}
//                 </Typography>
//                 {orgWebsite && (
//                   <Typography>
//                     <strong>Website:</strong> {orgWebsite}
//                   </Typography>
//                 )}
//                 {orgIndustry && (
//                   <Typography>
//                     <strong>Industry:</strong> {orgIndustry}
//                   </Typography>
//                 )}
//                 {orgSize && (
//                   <Typography>
//                     <strong>Size:</strong> {orgSize}
//                   </Typography>
//                 )}
//               </Stack>
//             </Paper>
//           )}
// 
//           {project && (
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h5" gutterBottom>
//                 Project Information
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Stack spacing={2}>
//                 <Typography>
//                   <strong>Title:</strong> {projectTitle}
//                 </Typography>
//                 <Typography>
//                   <strong>Description:</strong>
//                 </Typography>
//                 <Typography
//                   sx={{
//                     whiteSpace: "pre-wrap",
//                     bgcolor: "grey.50",
//                     p: 2,
//                     borderRadius: 1,
//                   }}
//                 >
//                   {projectDescription}
//                 </Typography>
//                 {projectTimeline && (
//                   <Typography>
//                     <strong>Timeline:</strong> {projectTimeline}
//                   </Typography>
//                 )}
//                 {projectBudget && (
//                   <Typography>
//                     <strong>Budget:</strong> {projectBudget}
//                   </Typography>
//                 )}
//                 {projectStartDate && (
//                   <Typography>
//                     <strong>Start Date:</strong> {projectStartDate}
//                   </Typography>
//                 )}
//                 {projectTechnologies.length > 0 && (
//                   <Box>
//                     <Typography gutterBottom>
//                       <strong>Technologies:</strong>
//                     </Typography>
//                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                       {projectTechnologies.map((tech, idx) => (
//                         <Chip key={idx} label={tech} size="small" />
//                       ))}
//                     </Box>
//                   </Box>
//                 )}
//               </Stack>
//             </Paper>
//           )}
// 
//           {additional && (
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h5" gutterBottom>
//                 Additional Information
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Stack spacing={1}>
//                 {additionalPreferredContact && (
//                   <Typography>
//                     <strong>Preferred Contact:</strong>{" "}
//                     {additionalPreferredContact}
//                   </Typography>
//                 )}
//                 {additionalTimezone && (
//                   <Typography>
//                     <strong>Timezone:</strong> {additionalTimezone}
//                   </Typography>
//                 )}
//                 {additionalUrgency && (
//                   <Typography>
//                     <strong>Urgency:</strong> {additionalUrgency}
//                   </Typography>
//                 )}
//                 {additionalNotes && (
//                   <>
//                     <Typography>
//                       <strong>Notes:</strong>
//                     </Typography>
//                     <Typography
//                       sx={{
//                         whiteSpace: "pre-wrap",
//                         bgcolor: "grey.50",
//                         p: 2,
//                         borderRadius: 1,
//                       }}
//                     >
//                       {additionalNotes}
//                     </Typography>
//                   </>
//                 )}
//               </Stack>
//             </Paper>
//           )}
// 
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h5" gutterBottom>
//               Proposal
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//             <Box
//               component="pre"
//               sx={{
//                 whiteSpace: "pre-wrap",
//                 fontFamily: "monospace",
//                 bgcolor: "grey.50",
//                 p: 2,
//                 borderRadius: 1,
//                 overflowX: "auto",
//               }}
//             >
//               {intake.proposalMd}
//             </Box>
//           </Paper>
// 
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h5" gutterBottom>
//               Raw Data (JSON)
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//             <Box
//               component="pre"
//               sx={{
//                 whiteSpace: "pre-wrap",
//                 fontFamily: "monospace",
//                 bgcolor: "grey.50",
//                 p: 2,
//                 borderRadius: 1,
//                 overflowX: "auto",
//                 fontSize: "0.875rem",
//               }}
//             >
//               {JSON.stringify(data, null, 2)}
//             </Box>
//           </Paper>
//         </Stack>
//       </Container>
//     </ClientOnly>
//   );
// };
// 
// export default AdminIntakeDetail;
// 
// 
