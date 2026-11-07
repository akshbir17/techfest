// ==========================================
// SPECTRUM 1.0 — GOOGLE APPS SCRIPT WEB APP
// ==========================================

function doPost(e) {
  try {
    var contents = e && e.postData ? e.postData.contents : "";
    var data = {};
    try {
      data = JSON.parse(contents);
    } catch (parseErr) {
      data = (e && e.parameter) ? e.parameter : {};
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Auto-create and format header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp (IST)",
        "Registration ID",
        "Participant Name",
        "Email",
        "Phone",
        "College / Institution",
        "Event Name",
        "Team Name",
        "Team Members",
        "Amount Paid (INR)",
        "Razorpay Payment ID",
        "Payment Status"
      ];
      sheet.appendRow(headers);
      
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#d32f2f");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Append participant registration row
    var row = [
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.registration_id || "N/A",
      data.participant_name || "N/A",
      data.email || "N/A",
      data.phone ? "'" + data.phone : "N/A",
      data.college || "N/A",
      data.event_name || "N/A",
      data.team_name || "N/A",
      data.team_members || "N/A",
      data.amount_paid !== undefined ? data.amount_paid : 0,
      data.razorpay_payment_id || "N/A",
      data.payment_status || "PAID"
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allows testing GET requests from browser
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Spectrum 1.0 Webhook is live!"
  })).setMimeType(ContentService.MimeType.JSON);
}

// Helper: You can select 'testSheet' and click 'Run' to test your sheet directly!
function testSheet() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        registration_id: "TEST-001",
        participant_name: "Test Participant",
        email: "test@spectrum.com",
        phone: "9876543210",
        college: "GNDEC Bidar",
        event_name: "Test Event",
        team_name: "N/A",
        team_members: "N/A",
        amount_paid: 1,
        razorpay_payment_id: "pay_test_12345",
        payment_status: "PAID"
      })
    }
  };
  var res = doPost(fakeEvent);
  Logger.log(res.getContent());
}
