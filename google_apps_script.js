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
    var participantName = String(data.participant_name || "N/A").trim();
    var rawTeamName = String(data.team_name || "").trim();
    var isTeam = rawTeamName !== "" && rawTeamName !== "N/A";

    if (isTeam && participantName !== "N/A" && participantName.indexOf("(Leader)") === -1) {
      participantName += " (Leader)";
    }

    var teamMembers = formatTeamMembers(data.team_members);
    var eventName = String(data.event_name || "N/A").trim();
    var isHackathon = eventName.toLowerCase().indexOf("hackathon") !== -1;

    var theme = data.theme || "General";
    var accommodation = data.accommodation || (isHackathon ? "Yes" : "N/A");

    var registrationId = data.registration_id || ("SPEC-" + String(data.order_id).slice(-6).toUpperCase());
    var amount = data.amount_paid !== undefined ? data.amount_paid : (isHackathon ? 500 : 0);

    var timestamp = Utilities.formatDate(new Date(), TIMEZONE, "dd/MM/yyyy, hh:mm a");
    var phone = data.phone ? "'" + String(data.phone).replace(/\s+/g, "") : "N/A";

    // Build fields map for robust dynamic column alignment
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
      team_name: isTeam ? rawTeamName : "N/A",
      team_members: isTeam ? teamMembers : "N/A",
      fee: "₹" + amount,
      razorpay_payment_id: data.razorpay_payment_id,
      status: "PAID",
      confirmation_email: "Pending"
    };

    // Dynamically match row values to existing sheet columns by header name
    var currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    var row = [];

    for (var colIdx = 0; colIdx < HEADERS.length; colIdx++) {
      var h = String(currentHeaders[colIdx] || HEADERS[colIdx] || "").toLowerCase().trim();
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
      } else if ((h.indexOf("confirm") !== -1 && h.indexOf("email") !== -1) || h.indexOf("email status") !== -1) {
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
        team_name: isTeam ? rawTeamName : "N/A",
        team_members: isTeam ? teamMembers : "N/A",
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
      if ((kh.indexOf("confirm") !== -1 && kh.indexOf("email") !== -1) || kh.indexOf("email status") !== -1) {
        emailColIdx = k + 1;
        break;
      }
    }
    if (emailColIdx === -1) emailColIdx = 16;

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
    var currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    var hasOrderId = false;
    var hasAccom = false;
    for (var i = 0; i < currentHeaders.length; i++) {
      var h = String(currentHeaders[i] || "").toLowerCase();
      if (h.indexOf("order") !== -1) hasOrderId = true;
      if (h.indexOf("accommodat") !== -1) hasAccom = true;
    }
    if (!hasOrderId || !hasAccom || sheet.getLastColumn() < HEADERS.length) {
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
   ONE-CLICK REPAIR TOOL
   Run manually to format headers and align all shifted data!
   ============================================================ */

function formatAndFixSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  if (lastRow > 1) {
    var rawValues = sheet.getRange(2, 1, lastRow - 1, Math.max(lastCol, HEADERS.length)).getValues();
    var fixedRows = [];

    for (var r = 0; r < rawValues.length; r++) {
      var row = rawValues[r];

      var timestamp = "";
      var regId = "";
      var orderId = "";
      var participantName = "";
      var email = "";
      var phone = "";
      var college = "";
      var eventName = "";
      var theme = "";
      var accommodation = "";
      var teamName = "";
      var teamMembers = "";
      var fee = "";
      var paymentId = "";
      var status = "PAID";
      var emailStatus = "Sent";

      for (var c = 0; c < row.length; c++) {
        var rawVal = row[c];
        var val = String(rawVal || "").trim();
        if (!val) continue;

        if (/^pay_[A-Za-z0-9]+/.test(val)) {
          paymentId = val;
        } else if (/^order_[A-Za-z0-9]+/.test(val)) {
          orderId = val;
        } else if (/^SPEC-[A-Za-z0-9-]+/i.test(val)) {
          regId = val;
        } else if (val.indexOf("@") !== -1 && val.indexOf(".") !== -1) {
          email = val;
        } else if (/^'?(\+91)?[6-9]\d{9}$/.test(val.replace(/\s+/g, ""))) {
          phone = "'" + val.replace(/['\s]/g, "");
        } else if (/^₹?\s*\d+(\.\d+)?$/.test(val) && val !== "0") {
          fee = val.indexOf("₹") === 0 ? val : "₹" + val;
        } else if (val.indexOf("(+91") !== -1 || (val.indexOf(",") !== -1 && /\d{5}/.test(val))) {
          teamMembers = val;
        } else if (/^(yes|no)(\s*\(.*\))?$/i.test(val)) {
          accommodation = /^yes/i.test(val) ? "Yes" : "No";
        } else if (/^(PAID|PENDING|FAILED)$/i.test(val)) {
          status = val.toUpperCase();
        } else if (/^(Sent|Failed|Pending)$/i.test(val)) {
          emailStatus = val;
        } else if (/hackathon|techquiz|bgmi|free fire|treasure hunt|photography|mock interview|killer game|impossible to sell/i.test(val)) {
          eventName = val;
        } else if (/agriculture|medtech|clean & green|automation|agentic|general/i.test(val)) {
          theme = val;
        } else if (Object.prototype.toString.call(rawVal) === "[object Date]" || /\d{1,2}\/\d{1,2}\/\d{4}/.test(val)) {
          timestamp = val;
        }
      }

      // Contextual fallbacks
      if (!timestamp && row[0]) timestamp = row[0];
      if (!orderId && row[2] && String(row[2]).indexOf("order_") === 0) orderId = row[2];
      if (!regId) regId = orderId ? "SPEC-" + orderId.slice(-6).toUpperCase() : "SPEC-REG-" + (r + 1);

      if (!participantName) {
        for (var pi = 1; pi <= 4; pi++) {
          var pVal = String(row[pi] || "").trim();
          if (pVal && pVal !== email && pVal !== phone && pVal.indexOf("order_") !== 0 && pVal.indexOf("pay_") !== 0 && pVal.indexOf("SPEC-") !== 0) {
            participantName = pVal;
            break;
          }
        }
      }

      if (!college) {
        for (var ci = 4; ci <= 7; ci++) {
          var cVal = String(row[ci] || "").trim();
          if (cVal && /gndec|college|institute|university|bidar/i.test(cVal)) {
            college = cVal;
            break;
          }
        }
      }
      if (!college) college = "GNDEC Bidar";

      // Team Name: short clean identifier that is distinct from teamMembers
      for (var ti = 7; ti <= 11; ti++) {
        var tVal = String(row[ti] || "").trim();
        if (tVal && tVal !== teamMembers && tVal !== eventName && tVal !== theme && tVal !== fee && tVal !== paymentId && tVal !== "PAID" && tVal.indexOf("(+91") === -1 && tVal.indexOf("@") === -1) {
          if (!teamName || teamName === "N/A") {
            teamName = tVal;
          }
        }
      }

      var isHack = String(eventName).toLowerCase().indexOf("hackathon") !== -1;
      if (!fee) fee = isHack ? "₹500" : "₹100";
      if (!accommodation) accommodation = isHack ? "Yes" : "N/A";
      if (!theme) theme = "General";
      if (!teamMembers) teamMembers = "N/A";
      if (!teamName) teamName = "N/A";

      fixedRows.push([
        timestamp,
        regId,
        orderId || "N/A",
        participantName || "N/A",
        email || "N/A",
        phone || "N/A",
        college || "N/A",
        eventName || "N/A",
        theme || "N/A",
        accommodation || "N/A",
        teamName,
        teamMembers,
        fee,
        paymentId || "N/A",
        status,
        emailStatus
      ]);
    }

    sheet.getRange(2, 1, fixedRows.length, HEADERS.length).setValues(fixedRows);
  }

  // Set official green headers
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange
    .setValues([HEADERS])
    .setFontWeight("bold")
    .setBackground(SHEET_HEADER_COLOR)
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  sheet.setFrozenRows(1);
  SpreadsheetApp.flush();
  Logger.log("Google Sheet formatted and all rows successfully aligned into 16 standard columns.");
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
  var regId = escapeHtml(data.registration_id || "N/A");

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
  html += '        <tr><td class="label">Reg ID</td><td class="value" style="color:#4338CA;letter-spacing:1px;">' + regId + '</td></tr>';
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
  html += '    <div class="coordinator"><span style="font-size:11px;color:#0D9488;">STAFF CONVENER</span><strong>Dr. Praveen Reddy</strong>+91 99165 42332</div>';
  html += '  </div>';
  html += '  <div class="footer">';
  html += '    <p>This is an automated confirmation from Spectrum 1.0 at GNDEC Bidar.</p>';
  html += '    <p><a href="' + WEBSITE_URL + '" style="color:#38BDF8;">' + WEBSITE_URL + '</a> | <a href="mailto:' + SUPPORT_EMAIL + '" style="color:#38BDF8;">' + SUPPORT_EMAIL + '</a></p>';
  html += '  </div>';
  html += '</div>';
  html += '</body>';
  html += '</html>';

  return html;
}


/* ============================================================
   EMAIL DISPATCHER
   ============================================================ */

function sendConfirmationEmail(data) {
  var subject = "Registration Confirmed - " + (data.event_name || "Spectrum 1.0") + " | Spectrum 1.0 (GNDEC Bidar)";

  var plainText =
    "SPECTRUM 1.0 REGISTRATION CONFIRMED\n" +
    "Guru Nanak Dev Engineering College, Bidar\n" +
    "December 7 - 9, 2026\n\n" +
    "Reg ID: " + (data.registration_id || "N/A") + "\n" +
    "Participant: " + (data.participant_name || "N/A") + "\n" +
    "Event: " + (data.event_name || "N/A") + "\n" +
    (data.team_name && data.team_name !== "N/A" ? "Team: " + data.team_name + "\n" : "") +
    (data.theme && data.theme !== "N/A" ? "Theme: " + data.theme + "\n" : "") +
    (data.accommodation && data.accommodation !== "N/A" ? "Accommodation: " + data.accommodation + "\n" : "") +
    (data.team_members && data.team_members !== "N/A" ? "Members: " + data.team_members + "\n" : "") +
    "Amount Paid: ₹" + (data.amount_paid || 0) + "/-\n" +
    "Order ID: " + (data.order_id || "N/A") + "\n" +
    "Payment ID: " + (data.razorpay_payment_id || "N/A") + "\n\n" +
    "VENUE & REPORTING:\n" +
    "GNDEC Bidar, Mailoor Road, Bidar, Karnataka 585403\n" +
    "Reporting: 8:30 AM, December 7, 2026\n" +
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
   MANUAL TEST RUNNER
   ============================================================ */

function testHackathonRegistration() {
  var testSuffix = Math.floor(1000 + Math.random() * 9000);

  var testPayload = {
    order_id: "order_test_hackathon_" + testSuffix,
    razorpay_payment_id: "pay_test_hackathon_" + testSuffix,
    registration_id: "SPEC-HACK-" + testSuffix,
    participant_name: "The DClaw Gaming",
    email: "thedclaw.gaming@gmail.com",
    phone: "9876543210",
    college: "Guru Nanak Dev Engineering College (GNDEC), Bidar",
    event_name: "24-Hour Hackathon",
    theme: "MedTech, HealthTech & Workplace Wellbeing",
    accommodation: "Yes",
    team_name: "DClaw Gaming Squad",
    team_members: "Member 2 (+91 9111111111), Member 3 (+91 9222222222)",
    amount_paid: 500
  };

  var fakeEvent = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };

  var response = doPost(fakeEvent);
  Logger.log("Hackathon Test Result: " + response.getContent());
}

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
    amount_paid: 500,
    order_id: "order_sample_test",
    razorpay_payment_id: "pay_sample_test",
    college: "GNDEC Bidar",
    theme: "MedTech, HealthTech & Workplace Wellbeing",
    accommodation: "Yes",
    registration_id: "SPEC-HACK-TEST01"
  };

  sendConfirmationEmail(sample);
  Logger.log("Preview email sent to: " + email);
}
