import nodemailer from "nodemailer";

type Transporter = ReturnType<typeof nodemailer.createTransport>;

let transporter: Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required unless SMTP_SKIP_SEND=true.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export function verificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendVerificationEmail(to: string, code: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (process.env.SMTP_SKIP_SEND === "true") {
    console.info(`[MacroChef] Verification code for ${to}: ${code}`);
    return;
  }

  await getTransporter().sendMail({
    from,
    to,
    subject: "Verify your MacroChef email",
    text: `Your MacroChef verification code is ${code}. It expires in 30 minutes. Verify here: ${appUrl}/verify-email?email=${encodeURIComponent(to)}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17201b">
        <h1>Welcome to MacroChef</h1>
        <p>Your verification code is:</p>
        <p style="font-size:28px;font-weight:700">${code}</p>
        <p>This code expires in 30 minutes.</p>
        <p><a href="${appUrl}/verify-email?email=${encodeURIComponent(to)}">Open verification page</a></p>
      </div>
    `,
  });
}
