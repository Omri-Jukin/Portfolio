import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
  type PDFDownloadLinkProps,
} from "@react-pdf/renderer";
import { formatMoney } from "$/pricing/calcProposalTotals";
import type { RouterOutputs } from "$/trpc/client";

type ProposalData =
  | RouterOutputs["proposals"]["getById"]
  | {
      proposal: RouterOutputs["proposals"]["getById"]["proposal"];
      sections: RouterOutputs["proposals"]["getById"]["sections"];
      lineItems: RouterOutputs["proposals"]["getById"]["lineItems"];
      discounts: RouterOutputs["proposals"]["getById"]["discounts"];
      taxes: RouterOutputs["proposals"]["getById"]["taxes"];
      events?: RouterOutputs["proposals"]["getById"]["events"];
    };
type ProposalLineItem = RouterOutputs["proposals"]["getById"]["lineItems"][0];
type ProposalSection = RouterOutputs["proposals"]["getById"]["sections"][0];
type ProposalDiscount = RouterOutputs["proposals"]["getById"]["discounts"][0];
type ProposalTax = RouterOutputs["proposals"]["getById"]["taxes"][0];

export interface ProposalPDFOptions {
  includeInternalNotes?: boolean;
  includeClientNotes?: boolean;
  theme?: "light" | "dark";
}

// Styles
const createStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    page: {
      padding: 0,
      fontFamily: "Helvetica",
      backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    },
    header: {
      backgroundColor: isDark ? "#667eea" : "#1976d2",
      padding: 20,
      height: 40,
      justifyContent: "center",
    },
    headerText: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
    },
    content: {
      padding: 20,
    },
    proposalInfo: {
      marginBottom: 20,
    },
    clientName: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 7,
    },
    clientCompany: {
      fontSize: 12,
      marginBottom: 6,
    },
    clientEmail: {
      fontSize: 10,
      marginBottom: 8,
    },
    validUntil: {
      fontSize: 10,
      color: isDark ? "#999999" : "#666666",
      marginBottom: 5,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 10,
      color: isDark ? "#999999" : "#666666",
      marginBottom: 6,
    },
    table: {
      marginBottom: 5,
    },
    tableRow: {
      flexDirection: "row",
      marginBottom: 6,
    },
    tableHeader: {
      flexDirection: "row",
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#444444" : "#e0e0e0",
      paddingBottom: 4,
    },
    tableCell: {
      fontSize: 10,
    },
    tableCellBold: {
      fontSize: 10,
      fontWeight: "bold",
    },
    tableCellLabel: {
      width: "50%",
    },
    tableCellQty: {
      width: "15%",
    },
    tableCellPrice: {
      width: "15%",
    },
    tableCellTotal: {
      width: "20%",
    },
    itemDescription: {
      fontSize: 9,
      color: isDark ? "#999999" : "#666666",
      marginLeft: 5,
      marginTop: 2,
      marginBottom: 5,
    },
    totalsBox: {
      borderWidth: 0.5,
      borderColor: isDark ? "#444444" : "#e0e0e0",
      padding: 5,
      marginTop: 20,
      marginBottom: 15,
    },
    totalsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    totalsLabel: {
      fontSize: 10,
      width: "60%",
    },
    totalsValue: {
      fontSize: 10,
      fontWeight: "bold",
      width: "40%",
      textAlign: "right",
    },
    totalsLabelSecondary: {
      fontSize: 9,
      color: isDark ? "#999999" : "#666666",
      width: "60%",
    },
    totalsValueSecondary: {
      fontSize: 9,
      color: isDark ? "#999999" : "#666666",
      width: "40%",
      textAlign: "right",
    },
    totalsDivider: {
      borderTopWidth: 1,
      borderTopColor: isDark ? "#667eea" : "#1976d2",
      marginTop: 5,
      marginBottom: 5,
    },
    grandTotal: {
      fontSize: 14,
      fontWeight: "bold",
    },
    notesTitle: {
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 6,
    },
    notesText: {
      fontSize: 10,
      marginBottom: 5,
    },
    additionalItemsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8,
    },
    additionalItem: {
      fontSize: 10,
      marginBottom: 6,
    },
  });
};

// Proposal PDF Component
const ProposalPDFDocument: React.FC<{
  proposalData: ProposalData;
  options: ProposalPDFOptions;
}> = ({ proposalData, options }) => {
  const opts = {
    includeInternalNotes: options.includeInternalNotes ?? false,
    includeClientNotes: options.includeClientNotes ?? true,
    theme: options.theme || "light",
  };

  const { proposal, sections, lineItems, discounts, taxes } = proposalData;
  const styles = createStyles(opts.theme);

  // Calculate totals
  let subtotal = 0;
  for (const item of lineItems.filter(
    (i: ProposalLineItem) => !i.isOptional || i.isSelected
  )) {
    subtotal += Number(item.quantity) * item.unitPriceMinor;
  }

  let discountTotal = 0;
  for (const discount of discounts as ProposalDiscount[]) {
    if (discount.type === "percent" && discount.percent) {
      discountTotal += Math.round((subtotal * Number(discount.percent)) / 100);
    } else if (discount.type === "fixed" && discount.amountMinor) {
      discountTotal += discount.amountMinor;
    }
  }

  const preTaxTotal = subtotal - discountTotal;

  let taxTotal = 0;
  for (const tax of taxes as ProposalTax[]) {
    if (tax.type === "percent") {
      taxTotal += Math.round((preTaxTotal * Number(tax.rateOrAmount)) / 100);
    } else {
      taxTotal += Math.round(Number(tax.rateOrAmount) * 100);
    }
  }

  const grandTotal = preTaxTotal + taxTotal;

  // Get section items
  const getSectionItems = (sectionId: string) => {
    return lineItems.filter(
      (item: ProposalLineItem) =>
        item.sectionId === sectionId && (!item.isOptional || item.isSelected)
    );
  };

  // Get unsectioned items
  const unsectionedItems = lineItems.filter(
    (item: ProposalLineItem) =>
      !item.sectionId && (!item.isOptional || item.isSelected)
  );

  return (
    <Document
      title={`Proposal - ${proposal.clientName}`}
      author="Portfolio"
      subject="Proposal"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>PROPOSAL</Text>
        </View>

        <View style={styles.content}>
          {/* Proposal Info */}
          <View style={styles.proposalInfo}>
            <Text style={styles.clientName}>For: {proposal.clientName}</Text>
            {proposal.clientCompany && (
              <Text style={styles.clientCompany}>{proposal.clientCompany}</Text>
            )}
            <Text style={styles.clientEmail}>{proposal.clientEmail}</Text>
            {proposal.validUntil && (
              <Text style={styles.validUntil}>
                Valid until:{" "}
                {new Date(proposal.validUntil).toLocaleDateString()}
              </Text>
            )}
          </View>

          {/* Sections and Line Items */}
          {sections.map((section: ProposalSection) => {
            const sectionItems = getSectionItems(section.id);
            if (sectionItems.length === 0) return null;

            return (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.label}</Text>
                {section.description && (
                  <Text style={styles.sectionDescription}>
                    {section.description}
                  </Text>
                )}

                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBold,
                      styles.tableCellLabel,
                    ]}
                  >
                    Item
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBold,
                      styles.tableCellQty,
                    ]}
                  >
                    Qty
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBold,
                      styles.tableCellPrice,
                    ]}
                  >
                    Unit Price
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellBold,
                      styles.tableCellTotal,
                    ]}
                  >
                    Total
                  </Text>
                </View>

                {/* Table Rows */}
                {sectionItems.map((item: ProposalLineItem) => {
                  const quantity = Number(item.quantity);
                  const unitPrice = item.unitPriceMinor / 100;
                  const total = quantity * unitPrice;

                  return (
                    <View key={item.id}>
                      <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.tableCellLabel]}>
                          {item.label}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellQty]}>
                          {quantity.toString()}
                        </Text>
                        <Text style={[styles.tableCell, styles.tableCellPrice]}>
                          {formatMoney(item.unitPriceMinor, proposal.currency)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCell,
                            styles.tableCellBold,
                            styles.tableCellTotal,
                          ]}
                        >
                          {formatMoney(
                            Math.round(total * 100),
                            proposal.currency
                          )}
                        </Text>
                      </View>
                      {item.description && (
                        <Text style={styles.itemDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}

          {/* Unsectioned Items */}
          {unsectionedItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.additionalItemsTitle}>Additional Items</Text>
              {unsectionedItems.map((item: ProposalLineItem) => {
                const quantity = Number(item.quantity);
                const unitPrice = item.unitPriceMinor / 100;
                const total = quantity * unitPrice;

                return (
                  <View key={item.id} style={styles.additionalItem}>
                    <Text>
                      {item.label} ({quantity} ×{" "}
                      {formatMoney(item.unitPriceMinor, proposal.currency)}) -{" "}
                      {formatMoney(Math.round(total * 100), proposal.currency)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Totals Section */}
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal:</Text>
              <Text style={styles.totalsValue}>
                {formatMoney(subtotal, proposal.currency)}
              </Text>
            </View>

            {discounts.length > 0 && (
              <>
                <Text style={styles.totalsLabelSecondary}>Discounts:</Text>
                {discounts.map((discount: ProposalDiscount) => {
                  const discountAmount =
                    discount.type === "percent" && discount.percent
                      ? Math.round((subtotal * Number(discount.percent)) / 100)
                      : discount.amountMinor || 0;

                  return (
                    <View key={discount.id} style={styles.totalsRow}>
                      <Text style={styles.totalsLabelSecondary}>
                        {"  "}
                        {discount.label}:
                      </Text>
                      <Text style={styles.totalsValueSecondary}>
                        -{formatMoney(discountAmount, proposal.currency)}
                      </Text>
                    </View>
                  );
                })}
              </>
            )}

            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Pre-tax Total:</Text>
              <Text style={styles.totalsValue}>
                {formatMoney(preTaxTotal, proposal.currency)}
              </Text>
            </View>

            {taxes.length > 0 && (
              <>
                <Text style={styles.totalsLabelSecondary}>Taxes:</Text>
                {taxes.map((tax: ProposalTax) => {
                  const taxAmount =
                    tax.type === "percent"
                      ? Math.round(
                          (preTaxTotal * Number(tax.rateOrAmount)) / 100
                        )
                      : Math.round(Number(tax.rateOrAmount) * 100);

                  return (
                    <View key={tax.id} style={styles.totalsRow}>
                      <Text style={styles.totalsLabelSecondary}>
                        {"  "}
                        {tax.label}:
                      </Text>
                      <Text style={styles.totalsValueSecondary}>
                        {formatMoney(taxAmount, proposal.currency)}
                      </Text>
                    </View>
                  );
                })}
              </>
            )}

            <View style={styles.totalsDivider} />

            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, styles.grandTotal]}>
                Grand Total:
              </Text>
              <Text style={[styles.totalsValue, styles.grandTotal]}>
                {formatMoney(grandTotal, proposal.currency)}
              </Text>
            </View>
          </View>

          {/* Client Notes */}
          {opts.includeClientNotes && proposal.notesClient && (
            <View>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{proposal.notesClient}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

/**
 * Generate proposal PDF and return as buffer
 */
export async function generateProposalPDF(
  proposalData: ProposalData,
  options: ProposalPDFOptions = {}
): Promise<Buffer> {
  const doc = (
    <ProposalPDFDocument proposalData={proposalData} options={options} />
  );
  const pdfBlob = await pdf(doc).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
