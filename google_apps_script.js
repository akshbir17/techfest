// ==============================================================================
// SPECTRUM 1.0 — GOOGLE APPS SCRIPT WEB APP & AUTOMATED CONFIRMATION EMAIL ENGINE
// ==============================================================================
// 1. Logs confirmed registrations to Google Sheets
// 2. Automatically delivers an official HTML digital confirmation pass to participant's email
// 3. Includes event coordinators (Armaandeep Singh, Sangmesh, Abdul Aziz, Dr. Praveen Reddy)
// ==============================================================================

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

    // Auto-create and format header row if sheet is fresh/empty
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
        "Payment Status",
        "Confirmation Email"
      ];
      sheet.appendRow(headers);
      
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#d32f2f");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Try sending automated confirmation email
    var emailSent = false;
    var emailError = "";
    if (data.email && String(data.email).indexOf("@") !== -1) {
      try {
        sendConfirmationEmail(data);
        emailSent = true;
      } catch (mailErr) {
        emailError = mailErr.toString();
        Logger.log("Email dispatch failed: " + emailError);
      }
    }

    // Append participant registration row to the Google Sheet
    var row = [
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.registration_id || data.order_id || "N/A",
      data.participant_name || "N/A",
      data.email || "N/A",
      data.phone ? "'" + data.phone : "N/A",
      data.college || "N/A",
      data.event_name || "N/A",
      data.team_name || "N/A",
      data.team_members || "N/A",
      data.amount_paid !== undefined ? data.amount_paid : 0,
      data.razorpay_payment_id || "N/A",
      data.payment_status || "PAID",
      emailSent ? "Sent Successfully" : (emailError ? "Failed: " + emailError : "No Email")
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      row: sheet.getLastRow(),
      email_sent: emailSent,
      email_error: emailError || null
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Critical doPost error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
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
// HTML PASS BUILDER (100% Google Apps Script Syntax Compatible - No Nested Backticks)
// ==============================================================================
function buildHtmlPass(data) {
  var participantName = data.participant_name || "Participant";
  var eventName = data.event_name || "Official Event";
  var teamName = data.team_name && data.team_name !== "N/A" ? data.team_name : "";
  var teamMembers = data.team_members && data.team_members !== "N/A" ? data.team_members : "";
  var amount = data.amount_paid !== undefined ? data.amount_paid : 0;
  var orderId = data.order_id || data.registration_id || "N/A";
  var paymentId = data.razorpay_payment_id || "N/A";
  var college = data.college || "N/A";

  var parts = [
    '<!DOCTYPE html>',
    '<html><head><meta charset="utf-8"><title>SPECTRUM 1.0 Pass</title></head>',
    '<body style="margin:0;padding:0;background-color:#08060d;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;color:#f4eacc;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#08060d;padding:24px 12px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="100%" style="max-width:620px;background-color:#120b1f;border:1px solid #00f0ff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.8);" cellspacing="0" cellpadding="0" border="0">',
    '<tr><td style="background:linear-gradient(90deg,#ff1744 0%,#d500f9 50%,#00f0ff 100%);height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>',
    '<tr><td style="padding:28px 24px 20px 24px;text-align:center;background-color:#160d26;border-bottom:1px solid rgba(255,255,255,0.08);">',
    '<div style="font-size:11px;font-weight:700;letter-spacing:3px;color:#00f0ff;text-transform:uppercase;margin-bottom:6px;">NATIONAL LEVEL TECHNICAL &amp; CULTURAL FESTIVAL</div>',
    '<h1 style="margin:0 0 6px 0;font-size:32px;font-weight:900;letter-spacing:2px;color:#ffffff;text-transform:uppercase;">SPECTRUM 1.0</h1>',
    '<p style="margin:0 0 12px 0;font-size:13px;color:#d0d0db;">Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka</p>',
    '<div style="display:inline-block;background-color:rgba(0,230,118,0.15);border:1px solid #00e676;color:#00e676;font-size:11px;font-weight:800;padding:4px 14px;border-radius:20px;letter-spacing:1.5px;text-transform:uppercase;">✓ PAYMENT VERIFIED &amp; CONFIRMED</div>',
    '</td></tr>',
    '<tr><td style="padding:24px 24px 12px 24px;">',
    '<h2 style="margin:0 0 10px 0;font-size:18px;color:#ffffff;font-weight:700;">Greetings, ' + participantName + '! ⚡</h2>',
    '<p style="margin:0;font-size:14px;line-height:1.6;color:#d4d0dc;">We are thrilled to confirm your registration for <strong style="color:#00f0ff;">SPECTRUM 1.0</strong>. Your official spot is secured. Keep this email and your credentials handy upon arrival at the campus.</p>',
    '</td></tr>',
    '<tr><td style="padding:12px 24px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#19102b;border:1px solid rgba(0,240,255,0.3);border-radius:8px;overflow:hidden;">',
    '<tr><td style="background-color:#21133b;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.08);"><span style="font-size:11px;font-weight:800;letter-spacing:1.5px;color:#ff1744;text-transform:uppercase;">OFFICIAL EVENT PASS CREDENTIALS</span></td></tr>',
    '<tr><td style="padding:16px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size:13px;">',
    '<tr><td width="38%" style="color:#9e9cb2;font-weight:600;">Registered Event:</td><td style="color:#ffffff;font-weight:800;font-size:14px;">' + eventName + '</td></tr>',
    '<tr><td style="color:#9e9cb2;font-weight:600;">Participant Name:</td><td style="color:#00f0ff;font-weight:700;">' + participantName + '</td></tr>'
  ];

  if (teamName) {
    parts.push('<tr><td style="color:#9e9cb2;font-weight:600;">Team / Squad:</td><td style="color:#ffd54f;font-weight:700;">' + teamName + '</td></tr>');
  }
  if (teamMembers && teamMembers !== 'N/A') {
    parts.push('<tr><td style="color:#9e9cb2;font-weight:600;">Team Members:</td><td style="color:#d4d0dc;">' + teamMembers + '</td></tr>');
  }

  parts.push(
    '<tr><td style="color:#9e9cb2;font-weight:600;">College / Inst.:</td><td style="color:#ffffff;">' + college + '</td></tr>',
    '<tr><td style="color:#9e9cb2;font-weight:600;">Fee Paid:</td><td style="color:#00e676;font-weight:800;font-size:14px;">INR ₹' + amount + '/-</td></tr>',
    '<tr><td style="color:#9e9cb2;font-weight:600;">Order ID:</td><td style="font-family:monospace;font-size:12px;color:#ffd54f;">' + orderId + '</td></tr>',
    '<tr><td style="color:#9e9cb2;font-weight:600;">Payment ID:</td><td style="font-family:monospace;font-size:12px;color:#ff5252;">' + paymentId + '</td></tr>',
    '</table></td></tr></table></td></tr>',
    '<tr><td style="padding:12px 24px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#170d24;border-left:4px solid #ff1744;border-radius:4px;padding:14px;">',
    '<tr><td><div style="font-size:12px;font-weight:800;color:#ff1744;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📍 Campus Instructions &amp; Entry Guidelines</div>',
    '<ul style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.6;color:#dedae6;">',
    '<li><strong>Dates &amp; Time:</strong> December 7 – 9, 2026. Reporting starts at 8:30 AM on Day 1.</li>',
    '<li><strong>Campus Venue:</strong> Guru Nanak Dev Engineering College (GNDEC), Main Gate, Bidar, Karnataka.</li>',
    '<li><strong>Mandatory ID:</strong> A valid physical College / Institution ID card is compulsory for entry.</li>',
    '<li><strong>Hackathon Teams:</strong> Overnight campus accommodation and meals provided for registered teams.</li>',
    '</ul></td></tr></table></td></tr>',
    '<tr><td style="padding:12px 24px 20px 24px;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#140d21;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:14px;">',
    '<tr><td><div style="font-size:11px;font-weight:800;color:#00f0ff;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">📞 Official Coordinator Help Desk</div>',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size:12px;color:#d0d0db;">',
    '<tr><td width="50%"><strong>Armaandeep Singh:</strong> <a href="tel:+918427027540" style="color:#00f0ff;text-decoration:none;">+91 8427027540</a></td><td width="50%"><strong>Sangmesh:</strong> <a href="tel:+919353142522" style="color:#00f0ff;text-decoration:none;">+91 9353142522</a></td></tr>',
    '<tr><td><strong>Abdul Aziz:</strong> <a href="tel:+918296683831" style="color:#00f0ff;text-decoration:none;">+91 8296683831</a></td><td><strong>Dr. Praveen Reddy:</strong> <a href="tel:+919916542332" style="color:#ff5252;text-decoration:none;">+91 99165 42332</a></td></tr>',
    '</table></td></tr></table></td></tr>',
    '<tr><td style="padding:10px 24px 24px 24px;text-align:center;">',
    '<a href="https://spectrum10.vercel.app" target="_blank" style="display:inline-block;background-color:#ff1744;color:#ffffff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:1px;padding:12px 28px;border-radius:6px;text-transform:uppercase;box-shadow:0 4px 14px rgba(255,23,68,0.4);">Visit Fest Portal</a>',
    '</td></tr>',
    '<tr><td style="background-color:#0d0717;padding:18px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:#8a889b;line-height:1.5;">',
    '<p style="margin:0 0 4px 0;">SPECTRUM 1.0 • Guru Nanak Dev Engineering College (GNDEC), Bidar</p>',
    '<p style="margin:0;">For queries, reply directly to this email or write to <a href="mailto:Spectrum101213@gmail.com" style="color:#00f0ff;text-decoration:none;">Spectrum101213@gmail.com</a></p>',
    '</td></tr>',
    '</table></td></tr></table></body></html>'
  );

  return parts.join("\n");
}

// ==============================================================================
// EMAIL DISPATCH HELPER
// ==============================================================================
function sendConfirmationEmail(data) {
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

  // Plain text fallback (essential for delivery and spam filters)
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
    + "• Dr. Praveen Reddy: +91 99165 42332 (Faculty Coordinator)\n\n"
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
// TEST HELPER 1: DIRECT EMAIL TEST
// Select 'testDirectEmail' and click 'Run'.
// ==============================================================================
function testDirectEmail() {
  var remainingQuota = MailApp.getRemainingDailyQuota();
  Logger.log("Current remaining daily email quota: " + remainingQuota);

  if (remainingQuota <= 0) {
    throw new Error("Daily email quota reached (0 remaining). Please try again tomorrow or use another Google account.");
  }

  var targets = [
    { name: "Davinder Singh", email: "davindersingh.seehr@gmail.com" },
    { name: "Akshbir Singh Seehra", email: "akshbirsingh.seehra@gmail.com" }
  ];

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];
    Logger.log(">>> Sending test pass to: " + target.email);
    sendConfirmationEmail({
      registration_id: "TEST-" + Math.floor(1000 + Math.random() * 9000),
      order_id: "order_direct_test_99",
      participant_name: target.name,
      email: target.email,
      phone: "+91 9876543210",
      college: "Guru Nanak Dev Engineering College (GNDEC), Bidar",
      event_name: "CYBER QUEST (TECHPASS)",
      team_name: "Cyber Squad",
      team_members: target.name + " (Lead), Member 2",
      amount_paid: 250,
      razorpay_payment_id: "pay_test_" + Math.floor(100000 + Math.random() * 900000),
      payment_status: "PAID"
    });
    Logger.log(">>> Successfully dispatched to: " + target.email);
  }
}

// ==============================================================================
// TEST HELPER 2: FULL WEBHOOK TEST (Logs to Sheet & Dispatches Email)
// Select 'testSheet' and click 'Run'.
// ==============================================================================
function testSheet() {
  Logger.log("Remaining daily email quota: " + MailApp.getRemainingDailyQuota());

  var testUsers = [
    {
      name: "Davinder Singh",
      email: "davindersingh.seehr@gmail.com",
      event: "CYBER QUEST (TECHNICAL CHALLENGE)",
      team: "Tech Titans",
      members: "Davinder Singh (Lead), Partner (+91 9876543210)",
      amount: 250
    },
    {
      name: "Davinder Singh (Fallback)",
      email: "davindersingh.seehra@gmail.com",
      event: "CYBER QUEST (TECHNICAL CHALLENGE)",
      team: "Tech Titans",
      members: "Davinder Singh (Lead), Partner (+91 9876543210)",
      amount: 250
    },
    {
      name: "Akshbir Singh Seehra",
      email: "akshbirsingh.seehra@gmail.com",
      event: "CODE MUTANTS / HACKATHON",
      team: "Crimson Alpha",
      members: "Akshbir Singh (Lead), Dev 2, Dev 3",
      amount: 300
    }
  ];

  for (var i = 0; i < testUsers.length; i++) {
    var user = testUsers[i];
    Logger.log("Testing doPost for: " + user.email);
    var fakeEvent = {
      postData: {
        contents: JSON.stringify({
          registration_id: "REG-TEST-" + (1001 + i),
          order_id: "order_test_pass_" + (7700 + i),
          participant_name: user.name,
          email: user.email,
          phone: "9876543210",
          college: "Guru Nanak Dev Engineering College (GNDEC), Bidar",
          event_name: user.event,
          team_name: user.team,
          team_members: user.members,
          amount_paid: user.amount,
          razorpay_payment_id: "pay_test_" + Math.floor(100000 + Math.random() * 900000),
          payment_status: "PAID"
        })
      }
    };

    var res = doPost(fakeEvent);
    Logger.log("Response for [" + user.email + "]: " + res.getContent());
  }
}
