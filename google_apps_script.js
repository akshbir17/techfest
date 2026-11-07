/**
 * Google Apps Script for Spectrum 1.0 Live Google Sheet Integration
 * 
 * Setup instructions:
 * 1. Open your target Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any default code and paste this entire script.
 * 4. Click "Deploy" (top right) > "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set Description: "Spectrum 1.0 Registrations Webhook".
 * 7. Set Execute as: "Me" (<your-email>).
 * 8. Set Who has access: "Anyone". (Important so Vercel can POST without Google login).
 * 9. Click "Deploy", review/authorize permissions with your Google account.
 * 10. Copy the Web app URL (starts with https://script.google.com/macros/s/...)
 * 11. Add it as GOOGLE_SHEETS_WEBHOOK_URL in your Vercel Environment Variables and .env.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Order ID",
        "Payment ID",
        "Event ID",
        "Event Name",
        "Type",
        "Participant / Leader Name",
        "Email",
        "Phone",
        "College",
        "Team Name",
        "Team Members",
        "Fee (INR)",
        "Status"
      ]);
      sheet.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#d32f2f").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.orderId || "",
      data.paymentId || "",
      data.eventId || "",
      data.eventName || "",
      data.type || "",
      data.name || "",
      data.email || "",
      data.phone || "",
      data.college || "",
      data.teamName || "N/A",
      data.members || "N/A",
      data.fee || 0,
      data.status || "PAID"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
