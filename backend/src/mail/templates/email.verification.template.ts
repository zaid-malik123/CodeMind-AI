export const emailVerificationTemplate = (
  verificationUrl: string,
) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
      <h2 style="color: #333;">Verify Your Email Address</h2>

      <p style="color: #555;">
        Thank you for signing up. Please verify your email address by clicking the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="${verificationUrl}"
          style="
            display: inline-block;
            background-color: #6366f1;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Verify Email
        </a>
      </div>

      <p style="color: #555;">
        This verification link is valid for the next 1 hour.
      </p>

      <p style="color: #555;">
        If you did not create an account, please ignore this email.
      </p>

      <p style="color: #555;">
        Best regards,<br />
        CodeMind AI Team
      </p>
    </div>
  `;
};