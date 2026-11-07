/**
 * Spectrum 1.0 — Production Google Apps Script Web App for Live Registrations
 * 
 * Instructions:
 * 1. Open your target Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code with this script.
 * 4. (Optional) If you use a secret in Vercel (GOOGLE_SHEETS_WEBHOOK_SECRET),
 *    replace "YOUR_SHARED_SECRET_HERE" with that exact same secret below.
 *    If no secret is used, you can leave it as is or empty.
 * 5. Click Deploy > New deployment (or Manage Deployments > Edit > New Version).
 *    - Type: Web app
 *    - Description: Spectrum 1.0 Registrations
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and ensure it matches GOOGLE_SHEETS_WEBHOOK_URL in Vercel.
 */

var SHARED_SECRET = "YOUR_SHARED_SECRET_HERE";

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : "";
    var data = {};
    
    try {
      data = JSON.parse(contents);
    } catch (parseErr) {
      data = e.parameter || {};
    }

    // Verify shared authentication secret if configured
    if (SHARED_SECRET && SHARED_SECRET !== "YOUR_SHARED_SECRET_HERE" && SHARED_SECRET !== "") {
      if (!data.secret || data.secret !== SHARED_SECRET) {
        return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Unauthorized: Invalid secret" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Auto-create and format header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp (IST)",
        "Registration ID",
        "Participant / Leader Name",
        "Email",
        "Phone",
        "College / Institution",
        "Event Name",
        "Team Name",
        "Team Members",
        "Amount Paid (₹)",
        "Razorpay Payment ID",
        "Payment Status"
      ];
      sheet.appendRow(headers);
      
      // Professional styling
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#d32f2f");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontFamily("Segoe UI");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Append participant registration row
    var row = [
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.registration_id || "",
      data.participant_name || "",
      data.email || "",
      data.phone ? "'" + data.phone : "", // prepended quote preserves leading zeros for mobile numbers
      data.college || "N/A",
      data.event_name || "",
      data.team_name || "N/A",
      data.team_members || "N/A",
      data.amount_paid !== undefined ? data.amount_paid : 0,
      data.razorpay_payment_id || "",
      data.payment_status || "PAID"
    ];

    sheet.appendRow(row);

    // Auto-align and adjust width for readability
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, row.length).setFontFamily("Segoe UI");

    return ContentService.createTextOutput(JSON.stringify({ result: "success", rowAdded: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allows testing directly from browser or GET requests
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Spectrum 1.0 Registration Webhook is live and ready to receive payments!"
  })).setMimeType(ContentService.MimeType.JSON);
}
