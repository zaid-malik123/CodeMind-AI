export const emailVerificationTemplate = (verificationUrl: string) => {
  return `
  <div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,sans-serif;">
    
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;">
          CodeMind AI
        </h1>
      </div>

      <!-- BODY -->
      <div style="padding:32px;text-align:center;">

        <h2 style="color:#111827;margin-bottom:10px;">
          Verify your email address
        </h2>

        <p style="color:#6b7280;font-size:14px;line-height:1.6;">
          Thanks for signing up! We’re excited to have you on board.  
          Please confirm your email to activate your account.
        </p>

        <!-- BUTTON -->
        <div style="margin:30px 0;">
          <a href="${verificationUrl}"
            style="
              background:linear-gradient(135deg,#6366f1,#4f46e5);
              color:#ffffff;
              padding:14px 28px;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
              display:inline-block;
              font-size:14px;
              box-shadow:0 4px 14px rgba(99,102,241,0.3);
            ">
            Verify Email
          </a>
        </div>

        <!-- LINK fallback -->
        <p style="font-size:12px;color:#9ca3af;word-break:break-all;">
          If the button doesn’t work, copy and paste this link:<br/>
          <a href="${verificationUrl}" style="color:#6366f1;">
            ${verificationUrl}
          </a>
        </p>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:12px;color:#9ca3af;line-height:1.5;">
          This link will expire in <b>1 hour</b>.  
          If you didn’t create this account, you can safely ignore this email.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#f9fafb;padding:16px;text-align:center;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          © ${new Date().getFullYear()} CodeMind AI. All rights reserved.
        </p>
      </div>

    </div>
  </div>
  `;
};