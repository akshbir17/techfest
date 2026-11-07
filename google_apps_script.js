/**
 * Spectrum 1.0 — Google Apps Script Web App for Live Google Sheets Integration
 * 
 * Target fields expected in POST request:
 * - secret
 * - registration_id
 * - participant_name
 * - email
 * - phone
 * - event_name
 * - team_name
 * - team_members
 * - amount_paid
 * - razorpay_payment_id
 * - payment_status
 */

// Set this to the same value as GOOGLE_SHEETS_WEBHOOK_SECRET in Vercel
var SHARED_SECRET = "YOUR_SHARED_SECRET_HERE";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Verify shared authentication secret
    if (SHARED_SECRET && SHARED_SECRET !== "YOUR_SHARED_SECRET_HERE") {
      if (!data.secret || data.secret !== SHARED_SECRET) {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Unauthorized: Invalid secret" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Registration ID",
        "Participant Name",
        "Email",
        "Phone",
        "Event Name",
        "Team Name",
        "Team Members",
        "Amount Paid (INR)",
        "Razorpay Payment ID",
        "Payment Status"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#d32f2f").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.registration_id || "",
      data.participant_name || "",
      data.email || "",
      data.phone || "",
      data.event_name || "",
      data.team_name || "N/A",
      data.team_members || "N/A",
      data.amount_paid || 0,
      data.razorpay_payment_id || "",
      data.payment_status || "PAID"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
