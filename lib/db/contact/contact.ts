import { contactInquiries } from "../schema/schema.tables";
import { eq, desc } from "drizzle-orm";
import { dbClient } from "../client";
import { v4 as uuidv4 } from "uuid";
import { InquiryStatus } from "../schema/schema.tables";

export type CreateContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type UpdateContactInput = {
  id: string;
  status?: InquiryStatus;
};

export const createContactInquiry = async (input: CreateContactInput) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const newInquiry = await dbClient
    .insert(contactInquiries)
    .values({
      id: uuidv4(),
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: "open",
      createdAt: new Date(),
    })
    .returning();

  if (!newInquiry.length) {
    throw new Error("Failed to create contact inquiry.");
  }

  return newInquiry[0];
};

export const getContactInquiries = async (status?: InquiryStatus) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const inquiries = await dbClient.query.contactInquiries.findMany({
    where: status ? eq(contactInquiries.status, status) : undefined,
    orderBy: desc(contactInquiries.createdAt),
  });

  return inquiries;
};

export const getContactInquiryById = async (id: string) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const inquiry = await dbClient.query.contactInquiries.findFirst({
    where: eq(contactInquiries.id, id),
  });

  if (!inquiry) {
    throw new Error("Contact inquiry not found.");
  }

  return inquiry;
};

export const updateContactInquiry = async (input: UpdateContactInput) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const updateData: Partial<typeof contactInquiries.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (input.status) updateData.status = input.status;

  const updatedInquiry = await dbClient
    .update(contactInquiries)
    .set(updateData)
    .where(eq(contactInquiries.id, input.id))
    .returning();

  if (!updatedInquiry.length) {
    throw new Error("Contact inquiry not found.");
  }

  return updatedInquiry[0];
};

export const deleteContactInquiry = async (id: string) => {
  if (!dbClient) {
    throw new Error("Database client not available.");
  }

  const deletedInquiry = await dbClient
    .delete(contactInquiries)
    .where(eq(contactInquiries.id, id))
    .returning();

  if (!deletedInquiry.length) {
    throw new Error("Contact inquiry not found.");
  }

  return deletedInquiry[0];
}; 