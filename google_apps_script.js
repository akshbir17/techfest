/* ============================================================
   SPECTRUM 1.0
   GOOGLE APPS SCRIPT REGISTRATION & EMAIL ENGINE
   GNDEC BIDAR | DECEMBER 7-9, 2026
   ============================================================ */

var HEADERS = [
  "Timestamp",
  "Reg ID",
  "Confirmation (Order ID)",
  "Participant Name (Leader)",
  "Email",
  "Phone",
  "College",
  "Event Name",
  "Theme",
  "Accommodation",
  "Team Name",
  "Team Members",
  "Fee",
  "Razorpay Payment ID",
  "Status",
  "Confirmation Email"
];

var SHEET_HEADER_COLOR = "#2e7d32";
var WEBSITE_URL = "https://spectrum10.vercel.app";
var SUPPORT_EMAIL = "Spectrum101213@gmail.com";
var TIMEZONE = "Asia/Kolkata";


/* ============================================================
   MAIN WEBHOOK
   ============================================================ */

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    var data = parseRequest(e);

    if (!data.email || !data.razorpay_payment_id || !data.order_id) {
      throw new Error("Missing email, Razorpay payment ID or order ID.");
    }

    // Get spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error("No active spreadsheet found.");
    }

    var sheet = ss.getActiveSheet();

    // Initialize or adapt sheet headers
    initializeSheet(sheet);

    // Prevent duplicate payment processing
    var existingRow = findExistingPayment(
      sheet,
      data.razorpay_payment_id,
      data.order_id
    );

    if (existingRow) {
      return jsonResponse({
        result: "success",
        duplicate: true,
        row: existingRow,
        message: "Registration already processed."
      });
    }

    // Prepare registration information
    var participantName = String(
      data.participant_name || "N/A"
    ).trim();

    var teamName = String(data.team_name || "").trim();
    var isTeam = teamName !== "" && teamName !== "N/A";

    if (
      isTeam &&
      participantName !== "N/A" &&
      participantName.indexOf("(Leader)") === -1
    ) {
      participantName += " (Leader)";
    }

    var teamMembers = formatTeamMembers(data.team_members);

    var eventName = String(data.event_name || "N/A").trim();

    var isHackathon =
      eventName.toLowerCase().indexOf("hackathon") !== -1;

    var theme = data.theme || (isHackathon ? "General" : "N/A");

    var accommodation = data.accommodation || (isHackathon ? "Yes" : "N/A");

    var registrationId =
      data.registration_id || data.order_id;

    var amount = data.amount_paid !== undefined ? data.amount_paid : 0;

    var timestamp = Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy, hh:mm a");

    var phone = data.phone
      ? "'" + String(data.phone).replace(/\s+/g, "")
      : "N/A";

    // Build fields map for robust column alignment
    var fieldsMap = {
      timestamp: timestamp,
      reg_id: registrationId,
      order_id: data.order_id,
      participant_name: participantName,
      email: data.email,
      phone: phone,
      college: data.college || "N/A",
      event_name: eventName,
      theme: theme,
      accommodation: accommodation,
      team_name: isTeam ? teamName : "N/A",
      team_members: teamMembers,
      fee: "₹" + amount,
      razorpay_payment_id: data.razorpay_payment_id,
      status: "PAID",
      confirmation_email: "Pending"
    };

    // Dynamically match row values to existing sheet columns by header name
    var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = [];

    for (var colIdx = 0; colIdx < currentHeaders.length; colIdx++) {
      var h = String(currentHeaders[colIdx] || "").toLowerCase().trim();
      if (!h) {
        row.push("");
        continue;
      }
      if (h.indexOf("time") !== -1 || h.indexOf("date") !== -1) {
        row.push(fieldsMap.timestamp);
      } else if (h.indexOf("reg") !== -1 && h.indexOf("order") === -1) {
        row.push(fieldsMap.reg_id);
      } else if (h.indexOf("order") !== -1 || (h.indexOf("confirm") !== -1 && h.indexOf("email") === -1)) {
        row.push(fieldsMap.order_id);
      } else if (h.indexOf("participant") !== -1 || h.indexOf("leader") !== -1 || (h.indexOf("name") !== -1 && h.indexOf("team") === -1 && h.indexOf("event") === -1)) {
        row.push(fieldsMap.participant_name);
      } else if (h.indexOf("email") !== -1 && h.indexOf("confirm") === -1 && h.indexOf("status") === -1) {
        row.push(fieldsMap.email);
      } else if (h.indexOf("phone") !== -1 || h.indexOf("contact") !== -1 || h.indexOf("mobile") !== -1) {
        row.push(fieldsMap.phone);
      } else if (h.indexOf("college") !== -1 || h.indexOf("institute") !== -1 || h.indexOf("university") !== -1) {
        row.push(fieldsMap.college);
      } else if (h.indexOf("event") !== -1) {
        row.push(fieldsMap.event_name);
      } else if (h.indexOf("theme") !== -1) {
        row.push(fieldsMap.theme);
      } else if (h.indexOf("accommodat") !== -1 || h.indexOf("stay") !== -1) {
        row.push(fieldsMap.accommodation);
      } else if (h === "team name" || (h.indexOf("team") !== -1 && h.indexOf("member") === -1)) {
        row.push(fieldsMap.team_name);
      } else if (h.indexOf("member") !== -1) {
        row.push(fieldsMap.team_members);
      } else if (h.indexOf("fee") !== -1 || h.indexOf("amount") !== -1 || h.indexOf("price") !== -1) {
        row.push(fieldsMap.fee);
      } else if (h.indexOf("razorpay") !== -1 || h.indexOf("payment id") !== -1) {
        row.push(fieldsMap.razorpay_payment_id);
      } else if (h.indexOf("status") !== -1 && h.indexOf("email") === -1) {
        row.push(fieldsMap.status);
      } else if (h.indexOf("confirm") !== -1 && h.indexOf("email") !== -1 || h.indexOf("email status") !== -1) {
        row.push(fieldsMap.confirmation_email);
      } else {
        row.push("N/A");
      }
    }

    sheet.appendRow(row);

    var lastRow = sheet.getLastRow();

    // Send confirmation email
    var emailSent = false;

    try {
      var emailData = {
        participant_name: participantName,
        email: data.email,
        event_name: eventName,
        team_name: isTeam ? teamName : "N/A",
        team_members: teamMembers,
        amount_paid: amount,
        order_id: data.order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        college: data.college || "N/A",
        theme: theme,
        accommodation: accommodation
      };

      sendConfirmationEmail(emailData);
      emailSent = true;

    } catch (mailError) {
      Logger.log("Email error: " + mailError.toString());
    }

    // Locate Confirmation Email column dynamically
    var emailColIdx = -1;
    for (var k = 0; k < currentHeaders.length; k++) {
      var kh = String(currentHeaders[k] || "").toLowerCase();
      if (kh.indexOf("confirm") !== -1 && kh.indexOf("email") !== -1 || kh.indexOf("email status") !== -1) {
        emailColIdx = k + 1;
        break;
      }
    }
    if (emailColIdx === -1) emailColIdx = currentHeaders.length;

    var emailCell = sheet.getRange(lastRow, emailColIdx);
    emailCell.setValue(emailSent ? "Sent" : "Failed");
    emailCell
      .setFontColor(emailSent ? "#155724" : "#721c24")
      .setBackground(emailSent ? "#d4edda" : "#f8d7da")
      .setHorizontalAlignment("center")
      .setFontWeight("bold");

    SpreadsheetApp.flush();

    return jsonResponse({
      result: "success",
      row: lastRow,
      email_sent: emailSent,
      registration_id: registrationId
    });

  } catch (err) {
    Logger.log("Registration error: " + err.toString());
    return jsonResponse({
      result: "error",
      error: err.message || String(err)
    });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}


/* ============================================================
   REQUEST PARSER
   ============================================================ */

function parseRequest(e) {
  if (!e) {
    throw new Error("Invalid webhook request.");
  }

  var contents =
    e.postData && e.postData.contents
      ? e.postData.contents
      : "";

  if (contents) {
    try {
      return JSON.parse(contents);
    } catch (err) {
      throw new Error("Invalid JSON request.");
    }
  }

  if (e.parameter) {
    return e.parameter;
  }

  throw new Error("Empty request.");
}


/* ============================================================
   DUPLICATE PAYMENT PROTECTION
   ============================================================ */

function findExistingPayment(sheet, paymentId, orderId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var payColIdx = -1;
  var orderColIdx = -1;

  for (var c = 0; c < currentHeaders.length; c++) {
    var h = String(currentHeaders[c] || "").toLowerCase();
    if (h.indexOf("razorpay") !== -1 || h.indexOf("payment id") !== -1) payColIdx = c;
    if (h.indexOf("order") !== -1) orderColIdx = c;
  }

  if (payColIdx === -1 && orderColIdx === -1) return null;

  var rows = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getDisplayValues();

  for (var i = 0; i < rows.length; i++) {
    var existingPayment = payColIdx !== -1 ? rows[i][payColIdx] : "";
    var existingOrder = orderColIdx !== -1 ? rows[i][orderColIdx] : "";

    if (
      (paymentId && existingPayment === paymentId) ||
      (orderId && existingOrder === orderId)
    ) {
      return i + 2;
    }
  }

  return null;
}


/* ============================================================
   GOOGLE SHEETS INITIALIZATION & HEADER UPDATE
   ============================================================ */

function initializeSheet(sheet) {
  var lastRow = sheet.getLastRow();

  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // Check if key columns like Order ID or Accommodation are missing
    var hasOrderId = false;
    var hasAccom = false;
    for (var i = 0; i < currentHeaders.length; i++) {
      var h = String(currentHeaders[i] || "").toLowerCase();
      if (h.indexOf("order") !== -1) hasOrderId = true;
      if (h.indexOf("accommodat") !== -1) hasAccom = true;
    }
    // If missing, automatically update headers to official 16-column layout
    if (!hasOrderId || !hasAccom || currentHeaders.length !== HEADERS.length) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
  }

  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange
    .setFontWeight("bold")
    .setBackground(SHEET_HEADER_COLOR)
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  sheet.setFrozenRows(1);
}

function updateSheetHeaders() {
  formatAndFixSheet();
}


/* ============================================================
   HEADER UPDATER & REPAIR EXISTING ROWS
   Run manually to format green headers and repair shifted data
   ============================================================ */

function formatAndFixSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  // 1. Format official green header row
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground(SHEET_HEADER_COLOR);
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  // 2. Scan and repair existing rows if columns were previously shifted
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  if (lastRow > 1) {
    var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    var rows = dataRange.getValues();

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];

      var membersStr = "";
      var paymentIdStr = "";
      var feeStr = "";
      var orderIdStr = "";

      for (var c = 0; c < row.length; c++) {
        var val = String(row[c] || "").trim();
        if (val.indexOf("pay_") === 0) {
          paymentIdStr = val;
        } else if (val.indexOf("order_") === 0) {
          orderIdStr = val;
        } else if (val.indexOf("(+91") !== -1 || (val.indexOf(",") !== -1 && /\d{5}/.test(val))) {
          membersStr = val;
        } else if (/^₹?\d+(\.\d+)?$/.test(val) && val !== "0" && val !== "N/A") {
          feeStr = val.indexOf("₹") === 0 ? val : "₹" + val;
        }
      }

      // If this row suffered from column shift (e.g. member list in Team Name column)
      if (membersStr && row[10] === membersStr) {
        row[10] = "N/A"; // Team Name should only be team name
        row[11] = membersStr; // Team Members
      }
      if (paymentIdStr) {
        row[13] = paymentIdStr; // Razorpay Payment ID
      }
      if (feeStr) {
        row[12] = feeStr; // Fee
      }
      if (orderIdStr && (!row[2] || row[2] === "N/A")) {
        row[2] = orderIdStr; // Confirmation (Order ID)
      }

      // Set default Accommodation for Hackathon if blank
      var eventStr = String(row[7] || "").toLowerCase();
      if (eventStr.indexOf("hackathon") !== -1 && (!row[9] || row[9] === "N/A" || row[9] === "")) {
        row[9] = "Yes";
      } else if (!row[9] || row[9] === "") {
        row[9] = "N/A";
      }
    }

    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

  SpreadsheetApp.flush();
  Logger.log("Spectrum 1.0 headers and rows updated and aligned successfully.");
}


/* ============================================================
   TEAM MEMBER FORMATTER
   ============================================================ */

function formatTeamMembers(members) {
  if (!members || members === "N/A") {
    return "N/A";
  }

  if (!Array.isArray(members)) {
    return String(members);
  }

  return members.map(function(member, index) {
    if (typeof member === "string") {
      return member;
    }

    var name = member.name || "Member " + (index + 2);
    var phone = "";

    if (member.phone) {
      var raw = String(member.phone)
        .replace(/\s+/g, "")
        .replace(/^0+/, "");

      phone = raw.indexOf("+91") === 0
        ? raw
        : "+91 " + raw;
    }

    return name + (phone ? " (" + phone + ")" : "");
  }).join(", ");
}


/* ============================================================
   HTML SECURITY
   ============================================================ */

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


/* ============================================================
   HTML CONFIRMATION PASS
   ============================================================ */

function buildHtmlPass(data) {
  data = data || {};

  var participant = escapeHtml(data.participant_name || "Participant");
  var firstName = escapeHtml(
    String(data.participant_name || "Participant").split(" ")[0]
  );

  var event = escapeHtml(data.event_name || "Official Event");
  var team = escapeHtml(data.team_name || "");
  var members = escapeHtml(data.team_members || "");
  var college = escapeHtml(data.college || "N/A");
  var theme = escapeHtml(data.theme || "");
  var accommodation = escapeHtml(data.accommodation || "");
  var amount = escapeHtml(data.amount_paid || 0);
  var orderId = escapeHtml(data.order_id || "N/A");
  var paymentId = escapeHtml(data.razorpay_payment_id || "N/A");

  var isYes = accommodation.toLowerCase().indexOf("yes") !== -1;

  var teamRow = team && team !== "N/A"
    ? '<tr><td class="label">Team</td><td class="value">' + team + '</td></tr>'
    : "";

  var themeRow = theme && theme !== "N/A"
    ? '<tr><td class="label">Theme</td><td class="value">' + theme + '</td></tr>'
    : "";

  var accommodationRow = accommodation && accommodation !== "N/A"
    ? '<tr><td class="label">Accommodation</td><td class="value">' +
      (isYes ? "Yes (Campus Stay &amp; Meals)" : "No (Self Arranged)") +
      '</td></tr>'
    : "";

  var membersRow = members && members !== "N/A"
    ? '<tr><td class="label">Team members</td><td class="value">' + members + '</td></tr>'
    : "";

  var html = "";
  html += '<!DOCTYPE html>';
  html += '<html lang="en">';
  html += '<head>';
  html += '<meta charset="UTF-8">';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  html += '<meta name="color-scheme" content="light">';
  html += '<title>Spectrum 1.0 - Registration Confirmed</title>';
  html += '<style>';
  html += 'body { margin:0; padding:0; background:#EEF2F7; font-family:Arial,Helvetica,sans-serif; color:#0F172A; }';
  html += '.container { max-width:600px; margin:25px auto; background:#ffffff; border-radius:16px; overflow:hidden; }';
  html += '.header { background:#4338CA; background-image:linear-gradient(120deg,#4338CA,#7C3AED,#DB2777); color:#ffffff; text-align:center; padding:35px 20px; }';
  html += '.header h1 { font-size:40px; margin:10px 0; }';
  html += '.header p { font-size:14px; }';
  html += '.content { padding:25px 30px; }';
  html += '.card { border:1px solid #E2E8F0; border-left:5px solid #DB2777; border-radius:12px; padding:18px; }';
  html += 'table { width:100%; border-collapse:collapse; }';
  html += 'td { padding:10px 4px; vertical-align:top; font-size:14px; }';
  html += '.label { width:38%; color:#64748B; }';
  html += '.value { color:#0F172A; font-weight:bold; word-break:break-word; }';
  html += '.section { color:#DB2777; font-weight:bold; margin-bottom:12px; }';
  html += '.steps { line-height:1.7; color:#334155; font-size:14px; }';
  html += '.coordinator { background:#F0FDFA; border-left:4px solid #0D9488; padding:12px; margin:5px 0; border-radius:7px; }';
  html += '.coordinator strong { display:block; margin:5px 0; }';
  html += '.footer { background:#0F172A; color:#ffffff; text-align:center; padding:22px; font-size:13px; }';
  html += 'a { color:#4338CA; }';
  html += '@media screen and (max-width:480px) { .content { padding:20px 16px; } .header h1 { font-size:32px; } }';
  html += '</style>';
  html += '</head>';
  html += '<body>';
  html += '<div class="container">';
  html += '  <div class="header">';
  html += '    <div style="font-size:12px;font-weight:bold;letter-spacing:2px;">NATIONAL LEVEL TECHNICAL &amp; CULTURAL FESTIVAL</div>';
  html += '    <h1>Spectrum 1.0</h1>';
  html += '    <p>Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka</p>';
  html += '    <div style="margin-top:18px;">';
  html += '      <span style="background:#FBBF24;color:#0F172A;padding:8px 15px;border-radius:20px;font-weight:bold;">Dec 7 - 9, 2026</span>&nbsp;';
  html += '      <span style="background:#10B981;color:#ffffff;padding:8px 15px;border-radius:20px;font-weight:bold;">&#10003; Payment Verified</span>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="content">';
  html += '    <h2 style="font-size:22px;">You\'re registered, ' + firstName + '!</h2>';
  html += '    <p style="color:#475569;line-height:1.7;">Your spot at <strong style="color:#4338CA;">Spectrum 1.0</strong> is secured. Keep this email handy and bring your college ID when you arrive on campus.</p>';
  html += '    <div class="section">■ Your event pass</div>';
  html += '    <div class="card">';
  html += '      <table>';
  html += '        <tr><td class="label">Registered event</td><td class="value">' + event + '</td></tr>';
  html += '        <tr><td class="label">Participant</td><td class="value">' + participant + '</td></tr>';
  html +=          teamRow;
  html +=          themeRow;
  html +=          accommodationRow;
  html +=          membersRow;
  html += '        <tr><td class="label">College</td><td class="value">' + college + '</td></tr>';
  html += '      </table>';
  html += '      <hr style="border:0;border-top:2px dashed #E2E8F0;margin:15px 0;">';
  html += '      <table>';
  html += '        <tr><td class="label">Fee paid</td><td class="value" style="color:#047857;">&#8377;' + amount + '/-</td></tr>';
  html += '        <tr><td class="label">Order ID</td><td class="value">' + orderId + '</td></tr>';
  html += '        <tr><td class="label">Payment ID</td><td class="value">' + paymentId + '</td></tr>';
  html += '      </table>';
  html += '    </div>';
  html += '    <div style="margin-top:28px;" class="section">■ Campus instructions</div>';
  html += '    <div class="steps">';
  html += '      <p><strong>1. Dates and reporting:</strong> December 7 - 9, 2026. Reporting starts at 8:30 AM on Day 1.</p>';
  html += '      <p><strong>2. Venue:</strong> GNDEC Bidar, Main Gate, Bidar, Karnataka.</p>';
  html += '      <p><strong>3. ID required:</strong> Carry a valid physical college or institution ID card. It is compulsory for entry.</p>';
  html += '      <p><strong>4. Hackathon teams:</strong> Overnight accommodation and meals are provided for registered teams that have confirmed accommodation.</p>';
  html += '    </div>';
  html += '    <div style="margin-top:25px;" class="section">■ Help desk</div>';
  html += '    <div class="coordinator"><span style="font-size:11px;color:#0D9488;">STUDENT COORDINATOR</span><strong>Armaandeep Singh</strong>+91 8427027540</div>';
  html += '    <div class="coordinator"><span style="font-size:11px;color:#0D9488;">STUDENT COORDINATOR</span><strong>Sangmesh</strong>+91 9353142522</div>';
  html += '    <div class="coordinator"><span style="font-size:11px;color:#0D9488;">STUDENT COORDINATOR</span><strong>Abdul Aziz</strong>+91 8296683831</div>';
  html += '    <div class="coordinator" style="background:#FDF2F8;border-color:#DB2777;"><span style="font-size:11px;color:#DB2777;">HEAD, CSE - AIML</span><strong>Dr. Praveen Reddy</strong>+91 99165 42332</div>';
  html += '    <div style="text-align:center;margin-top:28px;">';
  html += '      <a href="' + WEBSITE_URL + '" style="display:inline-block;background:#4338CA;background-image:linear-gradient(90deg,#4338CA,#DB2777);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:25px;font-weight:bold;">Visit the Spectrum portal</a>';
  html += '      <p style="font-size:13px;color:#64748B;margin-top:18px;">Questions? Email <a href="mailto:' + SUPPORT_EMAIL + '">' + SUPPORT_EMAIL + '</a></p>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="footer"><strong>Spectrum 1.0 · GNDEC Bidar</strong><p style="color:#94A3B8;">Keep this email as your entry reference on campus.</p></div>';
  html += '</div>';
  html += '</body>';
  html += '</html>';

  return html;
}


/* ============================================================
   EMAIL DISPATCH
   ============================================================ */

function sendConfirmationEmail(data) {
  if (!data.email || String(data.email).indexOf("@") === -1) {
    throw new Error("Invalid recipient email address.");
  }

  var participant = data.participant_name || "Participant";
  var event = data.event_name || "Official Event";

  var subject =
    "Registration Confirmed: SPECTRUM 1.0 - " + event;

  var plainText =
    "SPECTRUM 1.0 - REGISTRATION CONFIRMED\n\n" +
    "Dear " + participant + ",\n\n" +
    "Your registration has been successfully confirmed!\n\n" +
    "Event: " + event + "\n" +
    "Participant: " + participant + "\n" +
    "Team: " + (data.team_name || "N/A") + "\n" +
    "Members: " + (data.team_members || "N/A") + "\n" +
    "College: " + (data.college || "N/A") + "\n" +
    "Theme: " + (data.theme || "N/A") + "\n" +
    "Accommodation: " + (data.accommodation || "N/A") + "\n" +
    "Fee paid: INR " + data.amount_paid + "/-\n" +
    "Order ID: " + data.order_id + "\n" +
    "Payment ID: " + data.razorpay_payment_id + "\n" +
    "Payment Status: PAID & VERIFIED\n\n" +
    "VENUE AND REPORTING:\n" +
    "GNDEC Bidar, Karnataka\n" +
    "December 7 - 9, 2026\n" +
    "Reporting starts at 8:30 AM on Day 1.\n" +
    "Bring your valid college ID card.\n\n" +
    "HELP DESK:\n" +
    "Armaandeep Singh: +91 8427027540\n" +
    "Sangmesh: +91 9353142522\n" +
    "Abdul Aziz: +91 8296683831\n" +
    "Dr. Praveen Reddy: +91 99165 42332\n\n" +
    "Official Portal: " + WEBSITE_URL + "\n" +
    "Email: " + SUPPORT_EMAIL;

  var htmlBody = buildHtmlPass(data);

  MailApp.sendEmail({
    to: String(data.email).trim(),
    subject: subject,
    body: plainText,
    htmlBody: htmlBody,
    name: "SPECTRUM 1.0 (GNDEC Bidar)"
  });
}


/* ============================================================
   GET HEALTH CHECK
   ============================================================ */

function doGet() {
  return jsonResponse({
    status: "active",
    message: "Spectrum 1.0 Registration and Email Engine is live!"
  });
}


/* ============================================================
   JSON RESPONSE
   ============================================================ */

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


/* ============================================================
   MANUAL EMAIL PREVIEW TEST
   ============================================================ */

function testEmailPreview() {
  var email = Session.getActiveUser().getEmail();

  if (!email) {
    throw new Error("Could not identify your Google account email.");
  }

  var sample = {
    email: email,
    participant_name: "Spectrum Test Participant",
    event_name: "24-Hour Hackathon",
    team_name: "Cyber Knights",
    team_members: "Red (+91 8888888888), Blue (+91 4444444444)",
    amount_paid: 1,
    order_id: "order_sample_test",
    razorpay_payment_id: "pay_sample_test",
    college: "GNDEC Bidar",
    theme: "AI & Autonomous Systems",
    accommodation: "Yes"
  };

  sendConfirmationEmail(sample);
  Logger.log("Preview email sent to: " + email);
}
