// ==============================================================================
// SPECTRUM 1.0 — GOOGLE APPS SCRIPT WEB APP & AUTOMATED CONFIRMATION EMAIL ENGINE
// ==============================================================================
// 1. Logs confirmed registrations to Google Sheets
// 2. Automatically delivers an official HTML digital confirmation pass to participant's email
// 3. Includes event coordinators (Armaandeep Singh, Sangmesh, Abdul Aziz, Dr. Praveen Reddy)
// ==============================================================================

function doPost(e) {
  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    var data = {};
    if (contents) {
      try {
        data = JSON.parse(contents);
      } catch (parseErr) {
        data = {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Standardized Official Spectrum 1.0 Google Sheet Column Headers
    var headers = [
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

    // Inspect current headers in Row 1 of the active sheet
    var lastCol = sheet.getLastColumn();
    var currentHeaders = [];
    if (lastCol > 0) {
      currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    // If sheet is empty or headers are not present, initialize official headers
    if (sheet.getLastRow() === 0 || currentHeaders.length === 0 || !currentHeaders[0]) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#2e7d32"); // Green header background
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      currentHeaders = headers;
    }

    // Send automated confirmation email
    var emailSent = trySendConfirmationEmail(data);

    // Format Leader/Participant name
    var isTeam = (data.team_name && data.team_name !== "N/A" && String(data.team_name).trim() !== "");
    var participantName = data.participant_name || "N/A";
    if (isTeam && participantName !== "N/A" && participantName.indexOf("(Leader)") === -1) {
      participantName = participantName + " (Leader)";
    }

    // Format Team Members: Red (+91 8888888888), Blue (+91 4444444444)
    var membersFormatted = "N/A";
    if (data.team_members && data.team_members !== "N/A") {
      if (Array.isArray(data.team_members)) {
        membersFormatted = data.team_members.map(function(m, idx) {
          if (typeof m === "string") return m;
          var phoneStr = "";
          if (m.phone) {
            var raw = String(m.phone).trim();
            phoneStr = raw.indexOf("+91") === 0 ? raw : "+91 " + raw.replace(/^0+/, "");
          }
          return (m.name || "Member " + (idx + 2)) + (phoneStr ? " (" + phoneStr + ")" : "");
        }).join(", ");
      } else {
        membersFormatted = String(data.team_members);
      }
    }

    // Timestamp: dd/MM/yyyy, hh:mm a in Indian Standard Time (IST)
    var timestampStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm a");

    // Fee formatted with INR symbol (e.g. ₹1)
    var feeStr = "₹" + (data.amount_paid !== undefined ? data.amount_paid : 0);

    // Clean Team Name - strictly ONLY team name
    var cleanTeamName = "N/A";
    if (data.team_name && data.team_name !== "N/A" && String(data.team_name).trim() !== "") {
      cleanTeamName = String(data.team_name).trim();
    }

    // Accommodation (Yes / No)
    var isHackathon = (data.event_name && String(data.event_name).toLowerCase().indexOf("hackathon") !== -1);
    var cleanAccommodation = "N/A";
    if (data.accommodation && data.accommodation !== "N/A") {
      cleanAccommodation = String(data.accommodation).trim();
    } else if (isHackathon) {
      cleanAccommodation = "Yes";
    }

    // Master map of all fields by semantic name
    var fieldsMap = {
      timestamp: timestampStr,
      reg_id: data.registration_id || data.order_id || "N/A",
      order_id: data.order_id || data.registration_id || "N/A",
      participant_name: participantName,
      email: data.email || "N/A",
      phone: data.phone ? "'" + String(data.phone).replace(/\s+/g, '') : "N/A",
      college: data.college || "N/A",
      event_name: data.event_name || "N/A",
      theme: data.theme || (isHackathon ? "General" : "N/A"),
      accommodation: cleanAccommodation,
      team_name: cleanTeamName,
      team_members: membersFormatted,
      fee: feeStr,
      razorpay_payment_id: data.razorpay_payment_id || "N/A",
      status: data.payment_status || "PAID",
      confirmation_email: emailSent === true ? "Sent" : "Failed"
    };

    // Dynamically align row values to exact column headers of active sheet
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

    // Apply color styling to the Confirmation Email cell (Green for Sent, Red for Failed)
    var lastRow = sheet.getLastRow();
    var emailColIdx = -1;
    for (var k = 0; k < currentHeaders.length; k++) {
      var kh = String(currentHeaders[k] || "").toLowerCase();
      if (kh.indexOf("confirm") !== -1 && kh.indexOf("email") !== -1 || kh.indexOf("email status") !== -1) {
        emailColIdx = k + 1;
        break;
      }
    }
    if (emailColIdx === -1) {
      emailColIdx = currentHeaders.length;
    }

    var emailCell = sheet.getRange(lastRow, emailColIdx);
    if (emailSent === true) {
      emailCell.setFontColor("#155724");
      emailCell.setBackground("#d4edda");
    } else {
      emailCell.setFontColor("#721c24");
      emailCell.setBackground("#f8d7da");
    }
    emailCell.setHorizontalAlignment("center");
    emailCell.setFontWeight("bold");

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      row: lastRow,
      email_sent: emailSent
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Critical doPost error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Safely attempts to send confirmation email and returns true/false without crashing
function trySendConfirmationEmail(data) {
  try {
    if (!data || !data.email || String(data.email).indexOf("@") === -1) {
      return false;
    }
    sendConfirmationEmail(data);
    return true;
  } catch (mailErr) {
    Logger.log("Email dispatch failed: " + mailErr.toString());
    return false;
  }
}

// Allows testing GET requests from browser or health checks
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Spectrum 1.0 Webhook & Automated Email Engine is live!"
  })).setMimeType(ContentService.MimeType.JSON);
}

// ==============================================================================
// REDESIGNED HTML EMAIL PASS BUILDER — Clean, Light, Professional Design
// Modern gradient header, ticket-style pass, numbered instructions, coordinator cards
// 100% Google Apps Script Compatible (no nested backticks, ES5 string concat)
// ==============================================================================
function buildHtmlPass(data) {
  data = data || {};
  var participantName = data.participant_name || "Participant";
  var firstName = participantName.split(" ")[0] || participantName;
  var eventName = data.event_name || "Official Event";
  var teamName = data.team_name && data.team_name !== "N/A" ? data.team_name : "";
  var teamMembers = data.team_members && data.team_members !== "N/A" ? data.team_members : "";
  var amount = data.amount_paid !== undefined ? data.amount_paid : 0;
  var orderId = data.order_id || data.registration_id || "N/A";
  var paymentId = data.razorpay_payment_id || "N/A";
  var college = data.college || "N/A";

  var parts = [];

  // DOCTYPE and opening
  parts.push('<!DOCTYPE html>');
  parts.push('<html lang="en">');
  parts.push('<head>');
  parts.push('  <meta charset="UTF-8">');
  parts.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  parts.push('  <meta name="color-scheme" content="light">');
  parts.push('  <title>Spectrum 1.0 - Registration Confirmed</title>');
  parts.push('</head>');
  parts.push('<body style="margin:0; padding:0; background-color:#EEF2F7; font-family:\'Segoe UI\', Helvetica, Arial, sans-serif; color:#0F172A; -webkit-text-size-adjust:100%;">');

  // Preheader (hidden preview text)
  parts.push('  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">');
  parts.push('    Your spot at Spectrum 1.0 is confirmed. Here are your pass details.');
  parts.push('  </div>');

  // Outer wrapper table
  parts.push('  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EEF2F7" style="background-color:#EEF2F7;">');
  parts.push('    <tr>');
  parts.push('      <td align="center" style="padding:24px 12px;">');

  // Main card container
  parts.push('        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#FFFFFF; border-radius:16px;" bgcolor="#FFFFFF">');

  // ──── HEADER (Gradient Banner) ────
  parts.push('          <tr>');
  parts.push('            <td bgcolor="#4338CA" style="background-color:#4338CA; background-image:linear-gradient(120deg, #4338CA 0%, #7C3AED 55%, #DB2777 100%); border-radius:16px 16px 0 0; padding:34px 32px 30px 32px; text-align:center;">');
  parts.push('              <div style="font-size:12px; font-weight:700; letter-spacing:2px; color:#FCE7F3; text-transform:uppercase;">National Level Technical &amp; Cultural Festival</div>');
  parts.push('              <div style="font-size:40px; font-weight:800; color:#FFFFFF; line-height:1.1; margin-top:8px;">Spectrum 1.0</div>');
  parts.push('              <div style="font-size:14px; color:#FDF2F8; margin-top:8px;">Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka</div>');
  parts.push('              <div style="margin-top:18px;">');
  parts.push('                <span style="display:inline-block; background-color:#FBBF24; color:#0F172A; font-size:13px; font-weight:700; padding:7px 16px; border-radius:20px;">Dec 7 &ndash; 9, 2026</span>');
  parts.push('                <span style="display:inline-block; background-color:#10B981; color:#FFFFFF; font-size:13px; font-weight:700; padding:7px 16px; border-radius:20px; margin-left:6px;">&#10003; Payment verified</span>');
  parts.push('              </div>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // ──── GREETING ────
  parts.push('          <tr>');
  parts.push('            <td style="padding:32px 32px 8px 32px;">');
  parts.push('              <div style="font-size:22px; font-weight:700; color:#0F172A;">You\'re registered, ' + firstName + '!</div>');
  parts.push('              <div style="font-size:15px; line-height:1.6; color:#475569; margin-top:10px;">');
  parts.push('                Your spot at <strong style="color:#4338CA;">Spectrum 1.0</strong> is secured. Keep this email handy and bring your college ID when you arrive on campus.');
  parts.push('              </div>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // ──── EVENT PASS CARD (Ticket Style) ────
  parts.push('          <tr>');
  parts.push('            <td style="padding:20px 32px 8px 32px;">');
  parts.push('              <div style="font-size:13px; font-weight:700; color:#DB2777; padding-bottom:10px;">&#9632;&nbsp; Your event pass</div>');
  parts.push('              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF; border:1px solid #E2E8F0; border-left:6px solid #DB2777; border-radius:12px;">');
  parts.push('                <tr>');
  parts.push('                  <td style="padding:20px 22px;">');
  parts.push('                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">');

  // Event row
  parts.push('                      <tr>');
  parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">Registered event</td>');
  parts.push('                        <td valign="top" style="padding:8px 0; font-size:15px; font-weight:700; color:#0F172A;">' + eventName + '</td>');
  parts.push('                      </tr>');

  // Participant row
  parts.push('                      <tr>');
  parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">Participant</td>');
  parts.push('                        <td valign="top" style="padding:8px 0; font-size:15px; font-weight:700; color:#4338CA;">' + participantName + '</td>');
  parts.push('                      </tr>');

  // Team row (conditional)
  if (teamName) {
    parts.push('                      <tr>');
    parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">Team</td>');
    parts.push('                        <td valign="top" style="padding:8px 0; font-size:15px; font-weight:700; color:#0D9488;">' + teamName + '</td>');
    parts.push('                      </tr>');
  }

  // Theme row (conditional for Hackathon)
  var theme = data.theme || "";
  if (theme && theme !== "N/A") {
    parts.push('                      <tr>');
    parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">Theme</td>');
    parts.push('                        <td valign="top" style="padding:8px 0; font-size:14px; font-weight:700; color:#DB2777;">' + theme + '</td>');
    parts.push('                      </tr>');
  }

  // Accommodation row (conditional for Hackathon)
  var accom = data.accommodation || "";
  if (accom && accom !== "N/A") {
    var isYes = String(accom).toLowerCase().indexOf("yes") !== -1;
    var badgeColor = isYes ? "#059669" : "#64748B";
    var badgeBg = isYes ? "#D1FAE5" : "#F1F5F9";
    var accomLabel = isYes ? "Yes (Campus Stay & Meals)" : "No (Self Arranged)";
    parts.push('                      <tr>');
    parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">Accommodation</td>');
    parts.push('                        <td valign="top" style="padding:8px 0;"><span style="display:inline-block; background-color:' + badgeBg + '; color:' + badgeColor + '; font-size:12px; font-weight:700; padding:2px 10px; border-radius:12px;">' + accomLabel + '</span></td>');
    parts.push('                      </tr>');
  }

  // Team members row (conditional)
  if (teamMembers && teamMembers !== "N/A") {
    parts.push('                      <tr>');
    parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">Team members</td>');
    parts.push('                        <td valign="top" style="padding:8px 0; font-size:14px; color:#0F172A;">' + teamMembers + '</td>');
    parts.push('                      </tr>');
  }

  // College row
  parts.push('                      <tr>');
  parts.push('                        <td width="38%" valign="top" style="padding:8px 0; font-size:13px; color:#64748B;">College</td>');
  parts.push('                        <td valign="top" style="padding:8px 0; font-size:14px; color:#0F172A;">' + college + '</td>');
  parts.push('                      </tr>');
  parts.push('                    </table>');

  // Dashed ticket divider
  parts.push('                    <div style="border-top:2px dashed #E2E8F0; margin:14px 0 14px 0; height:0; line-height:0; font-size:0;">&nbsp;</div>');

  // Fee & payment details
  parts.push('                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">');
  parts.push('                      <tr>');
  parts.push('                        <td width="38%" valign="top" style="padding:6px 0; font-size:13px; color:#64748B;">Fee paid</td>');
  parts.push('                        <td valign="top" style="padding:6px 0;">');
  parts.push('                          <span style="display:inline-block; background-color:#D1FAE5; color:#047857; font-size:14px; font-weight:700; padding:4px 12px; border-radius:20px;">&#8377;' + amount + '/-</span>');
  parts.push('                        </td>');
  parts.push('                      </tr>');
  parts.push('                      <tr>');
  parts.push('                        <td width="38%" valign="top" style="padding:6px 0; font-size:13px; color:#64748B;">Order ID</td>');
  parts.push('                        <td valign="top" style="padding:6px 0; font-family:Consolas, \'Courier New\', monospace; font-size:13px; color:#B45309;">' + orderId + '</td>');
  parts.push('                      </tr>');
  parts.push('                      <tr>');
  parts.push('                        <td width="38%" valign="top" style="padding:6px 0; font-size:13px; color:#64748B;">Payment ID</td>');
  parts.push('                        <td valign="top" style="padding:6px 0; font-family:Consolas, \'Courier New\', monospace; font-size:13px; color:#BE185D;">' + paymentId + '</td>');
  parts.push('                      </tr>');
  parts.push('                    </table>');
  parts.push('                  </td>');
  parts.push('                </tr>');
  parts.push('              </table>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // ──── CAMPUS INSTRUCTIONS (Numbered Steps) ────
  parts.push('          <tr>');
  parts.push('            <td style="padding:24px 32px 8px 32px;">');
  parts.push('              <div style="font-size:13px; font-weight:700; color:#EA580C; padding-bottom:12px;">&#9632;&nbsp; Campus instructions</div>');
  parts.push('              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">');

  // Step 1
  parts.push('                <tr>');
  parts.push('                  <td width="36" valign="top" style="padding:0 0 12px 0;">');
  parts.push('                    <div style="width:26px; height:26px; line-height:26px; border-radius:13px; background-color:#4338CA; color:#FFFFFF; font-size:13px; font-weight:700; text-align:center;">1</div>');
  parts.push('                  </td>');
  parts.push('                  <td valign="top" style="padding:0 0 12px 0; font-size:14px; line-height:1.55; color:#334155;">');
  parts.push('                    <strong style="color:#0F172A;">Dates and reporting:</strong> December 7 &ndash; 9, 2026. Reporting starts at 8:30 AM on Day 1.');
  parts.push('                  </td>');
  parts.push('                </tr>');

  // Step 2
  parts.push('                <tr>');
  parts.push('                  <td width="36" valign="top" style="padding:0 0 12px 0;">');
  parts.push('                    <div style="width:26px; height:26px; line-height:26px; border-radius:13px; background-color:#0D9488; color:#FFFFFF; font-size:13px; font-weight:700; text-align:center;">2</div>');
  parts.push('                  </td>');
  parts.push('                  <td valign="top" style="padding:0 0 12px 0; font-size:14px; line-height:1.55; color:#334155;">');
  parts.push('                    <strong style="color:#0F172A;">Venue:</strong> GNDEC Bidar, Main Gate, Bidar, Karnataka.');
  parts.push('                  </td>');
  parts.push('                </tr>');

  // Step 3
  parts.push('                <tr>');
  parts.push('                  <td width="36" valign="top" style="padding:0 0 12px 0;">');
  parts.push('                    <div style="width:26px; height:26px; line-height:26px; border-radius:13px; background-color:#DB2777; color:#FFFFFF; font-size:13px; font-weight:700; text-align:center;">3</div>');
  parts.push('                  </td>');
  parts.push('                  <td valign="top" style="padding:0 0 12px 0; font-size:14px; line-height:1.55; color:#334155;">');
  parts.push('                    <strong style="color:#0F172A;">ID required:</strong> Carry a valid physical college or institution ID card. It is compulsory for entry.');
  parts.push('                  </td>');
  parts.push('                </tr>');

  // Step 4
  parts.push('                <tr>');
  parts.push('                  <td width="36" valign="top" style="padding:0;">');
  parts.push('                    <div style="width:26px; height:26px; line-height:26px; border-radius:13px; background-color:#F97316; color:#FFFFFF; font-size:13px; font-weight:700; text-align:center;">4</div>');
  parts.push('                  </td>');
  parts.push('                  <td valign="top" style="padding:0; font-size:14px; line-height:1.55; color:#334155;">');
  parts.push('                    <strong style="color:#0F172A;">Hackathon teams:</strong> Overnight accommodation and meals are provided for registered teams.');
  parts.push('                  </td>');
  parts.push('                </tr>');
  parts.push('              </table>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // ──── COORDINATOR HELP DESK ────
  parts.push('          <tr>');
  parts.push('            <td style="padding:24px 32px 8px 32px;">');
  parts.push('              <div style="font-size:13px; font-weight:700; color:#7C3AED; padding-bottom:12px;">&#9632;&nbsp; Help desk</div>');
  parts.push('              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">');

  // Row 1: Armaandeep + Sangmesh
  parts.push('                <tr>');
  parts.push('                  <td width="50%" valign="top" style="padding:0 6px 10px 0;">');
  parts.push('                    <div style="background-color:#F0FDFA; border-left:4px solid #0D9488; border-radius:8px; padding:12px 14px;">');
  parts.push('                      <div style="font-size:11px; font-weight:700; color:#0D9488;">Student coordinator</div>');
  parts.push('                      <div style="font-size:14px; font-weight:700; color:#0F172A; margin-top:3px;">Armaandeep Singh</div>');
  parts.push('                      <div style="font-size:13px; color:#475569; margin-top:2px;">+91 8427027540</div>');
  parts.push('                    </div>');
  parts.push('                  </td>');
  parts.push('                  <td width="50%" valign="top" style="padding:0 0 10px 6px;">');
  parts.push('                    <div style="background-color:#F0FDFA; border-left:4px solid #0D9488; border-radius:8px; padding:12px 14px;">');
  parts.push('                      <div style="font-size:11px; font-weight:700; color:#0D9488;">Student coordinator</div>');
  parts.push('                      <div style="font-size:14px; font-weight:700; color:#0F172A; margin-top:3px;">Sangmesh</div>');
  parts.push('                      <div style="font-size:13px; color:#475569; margin-top:2px;">+91 9353142522</div>');
  parts.push('                    </div>');
  parts.push('                  </td>');
  parts.push('                </tr>');

  // Row 2: Abdul Aziz + Dr. Praveen Reddy
  parts.push('                <tr>');
  parts.push('                  <td width="50%" valign="top" style="padding:0 6px 0 0;">');
  parts.push('                    <div style="background-color:#F0FDFA; border-left:4px solid #0D9488; border-radius:8px; padding:12px 14px;">');
  parts.push('                      <div style="font-size:11px; font-weight:700; color:#0D9488;">Student coordinator</div>');
  parts.push('                      <div style="font-size:14px; font-weight:700; color:#0F172A; margin-top:3px;">Abdul Aziz</div>');
  parts.push('                      <div style="font-size:13px; color:#475569; margin-top:2px;">+91 8296683831</div>');
  parts.push('                    </div>');
  parts.push('                  </td>');
  parts.push('                  <td width="50%" valign="top" style="padding:0 0 0 6px;">');
  parts.push('                    <div style="background-color:#FDF2F8; border-left:4px solid #DB2777; border-radius:8px; padding:12px 14px;">');
  parts.push('                      <div style="font-size:11px; font-weight:700; color:#DB2777;">Head, CSE - AIML</div>');
  parts.push('                      <div style="font-size:14px; font-weight:700; color:#0F172A; margin-top:3px;">Dr. Praveen Reddy</div>');
  parts.push('                      <div style="font-size:13px; color:#475569; margin-top:2px;">+91 99165 42332</div>');
  parts.push('                    </div>');
  parts.push('                  </td>');
  parts.push('                </tr>');
  parts.push('              </table>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // ──── ACTION BUTTON ────
  parts.push('          <tr>');
  parts.push('            <td align="center" style="padding:26px 32px 8px 32px;">');
  parts.push('              <a href="https://spectrum10.vercel.app" style="display:inline-block; background-color:#4338CA; background-image:linear-gradient(90deg, #4338CA, #DB2777); color:#FFFFFF; text-decoration:none; font-size:15px; font-weight:700; padding:13px 28px; border-radius:24px;">Visit the Spectrum portal</a>');
  parts.push('              <div style="font-size:13px; color:#64748B; margin-top:14px;">');
  parts.push('                Questions? Email <a href="mailto:Spectrum101213@gmail.com" style="color:#4338CA; font-weight:700; text-decoration:none;">Spectrum101213@gmail.com</a>');
  parts.push('              </div>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // ──── FOOTER ────
  parts.push('          <tr>');
  parts.push('            <td bgcolor="#0F172A" style="background-color:#0F172A; border-radius:0 0 16px 16px; padding:20px 32px; text-align:center; margin-top:24px;">');
  parts.push('              <div style="font-size:13px; font-weight:700; color:#FFFFFF;">Spectrum 1.0 &middot; GNDEC Bidar</div>');
  parts.push('              <div style="font-size:12px; color:#94A3B8; margin-top:4px;">Keep this email as your entry reference on campus.</div>');
  parts.push('            </td>');
  parts.push('          </tr>');

  // Close tables
  parts.push('        </table>');
  parts.push('      </td>');
  parts.push('    </tr>');
  parts.push('  </table>');
  parts.push('</body>');
  parts.push('</html>');

  return parts.join("\n");
}

// ==============================================================================
// EMAIL DISPATCH HELPER
// ==============================================================================
function sendConfirmationEmail(data) {
  data = data || {};
  
  // Safe defaults if run directly from Apps Script editor toolbar without arguments
  if (!data.email || String(data.email).indexOf("@") === -1) {
    try {
      data.email = Session.getActiveUser().getEmail() || "thedclaw.gaming@gmail.com";
    } catch (e) {
      data.email = "thedclaw.gaming@gmail.com";
    }
    data.participant_name = data.participant_name || "Akshbir Singh Seehra";
    data.event_name = data.event_name || "24-Hour Hackathon";
    data.theme = data.theme || "AI & Autonomous Systems";
    data.amount_paid = data.amount_paid !== undefined ? data.amount_paid : 1;
    data.order_id = data.order_id || "order_manual_test_01";
    data.razorpay_payment_id = data.razorpay_payment_id || "pay_manual_test_01";
    data.college = data.college || "Guru Nanak Dev Engineering College (GNDEC), Bidar";
  }

  var recipientEmail = String(data.email).trim();
  var participantName = data.participant_name || "Participant";
  var eventName = data.event_name || "Official Event";
  var teamName = data.team_name && data.team_name !== "N/A" ? data.team_name : "";
  var teamMembers = data.team_members && data.team_members !== "N/A" ? data.team_members : "";
  var amount = data.amount_paid !== undefined ? data.amount_paid : 0;
  var orderId = data.order_id || data.registration_id || "N/A";
  var paymentId = data.razorpay_payment_id || "N/A";
  var college = data.college || "N/A";

  var subject = "🎟️ Registration Confirmed: SPECTRUM 1.0 - " + eventName;

  var plainText = "SPECTRUM 1.0 — REGISTRATION CONFIRMED\n\n"
    + "Dear " + participantName + ",\n\n"
    + "Your registration for SPECTRUM 1.0 has been successfully confirmed!\n\n"
    + "Event: " + eventName + "\n"
    + "Participant: " + participantName + "\n"
    + (teamName ? ("Team: " + teamName + "\n") : "")
    + (teamMembers && teamMembers !== "N/A" ? ("Members: " + teamMembers + "\n") : "")
    + "College / Institution: " + college + "\n"
    + "Registration Fee: INR " + amount + "/-\n"
    + "Confirmation / Order ID: " + orderId + "\n"
    + "Razorpay Payment ID: " + paymentId + "\n"
    + "Payment Status: PAID & VERIFIED\n\n"
    + "VENUE & REPORTING INSTRUCTIONS:\n"
    + "• Venue: Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka\n"
    + "• Dates: December 7 – 9, 2026 (Reporting starts at 8:30 AM on Day 1)\n"
    + "• Mandatory: Carry your valid College / Institution ID card\n"
    + "• Hackathon: Overnight campus accommodation and meals provided\n\n"
    + "OFFICIAL COORDINATORS (HELP DESK):\n"
    + "• Armaandeep Singh: +91 8427027540 (Student Coordinator)\n"
    + "• Sangmesh: +91 9353142522 (Student Coordinator)\n"
    + "• Abdul Aziz: +91 8296683831 (Student Coordinator)\n"
    + "• Dr. Praveen Reddy: +91 99165 42332 (Head, CSE - AIML)\n\n"
    + "Official Portal: https://spectrum10.vercel.app\n"
    + "Help Desk Email: Spectrum101213@gmail.com\n";

  var htmlBody = buildHtmlPass(data);

  var mailOptions = {
    to: recipientEmail,
    subject: subject,
    body: plainText,
    htmlBody: htmlBody,
    name: "SPECTRUM 1.0 (GNDEC Bidar)"
  };

  try {
    GmailApp.sendEmail(recipientEmail, subject, plainText, {
      htmlBody: htmlBody,
      name: "SPECTRUM 1.0 (GNDEC Bidar)"
    });
  } catch (gmailErr) {
    Logger.log("GmailApp failed (" + gmailErr + "), trying MailApp...");
    MailApp.sendEmail(mailOptions);
  }
}

// ==============================================================================
// 1-CLICK HEADER UPDATER
// Run this function from the Apps Script editor to update your sheet headers to the exact format
// ==============================================================================
function updateSheetHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var headers = [
    "Timestamp",
    "Reg ID",
    "Participant Name (Leader)",
    "Email",
    "Phone",
    "College",
    "Event Name",
    "Team Name",
    "Team Members",
    "Fee",
    "Razorpay Payment ID",
    "Status",
    "Confirmation Email"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#d32f2f");
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  Logger.log("Headers updated successfully to 13 official columns!");
}

// ==============================================================================
// OPTIONAL TEST HELPER
// You can select 'testSheet' and click 'Run' anytime to verify your setup.
// ==============================================================================
function testSheet() {
  var activeEmail = "";
  try {
    activeEmail = Session.getActiveUser().getEmail();
  } catch (e) {
    activeEmail = "";
  }

  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        registration_id: "REG-104921",
        order_id: "order_sample_pass_01",
        participant_name: "Ash",
        email: activeEmail || "ash@gmail.com",
        phone: "9999999999",
        college: "GNDEC Bidar",
        event_name: "24-Hour Hackathon",
        team_name: "Cyber Knights",
        team_members: "Red (+91 8888888888), Blue (+91 4444444444)",
        amount_paid: 500,
        razorpay_payment_id: "pay_P1a2b3c4",
        payment_status: "PAID"
      })
    }
  };

  var res = doPost(fakeEvent);
  Logger.log("Test Result: " + res.getContent());
}

/**
 * Utility function to immediately format the Google Sheet headers to official Green
 * and add all columns: Confirmation (Order ID), Theme, Accommodation, Team Name, Team Members, Fee, etc.
 * Also automatically repairs any misaligned existing rows!
 */
function formatAndFixSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var headers = [
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

  // 1. Format official green header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#2e7d32"); // Green header background
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  // 2. Scan and repair existing data rows if columns were previously shifted
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), headers.length);
  if (lastRow > 1) {
    var dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    var rows = dataRange.getValues();

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];

      // Identify misplaced data
      // Check if Team Name column or any column contains phone numbers / member lists
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

    // Write back cleaned and aligned rows
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

  SpreadsheetApp.flush();
  Logger.log("Google Sheet headers and rows formatted and aligned successfully!");
}

function formatSheetHeaders() {
  formatAndFixSheet();
}
