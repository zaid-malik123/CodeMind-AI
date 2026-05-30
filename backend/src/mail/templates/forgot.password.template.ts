export const otpTemplate = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #555;">You have requested to reset your password. Please use the following OTP to proceed:</p>
      <div style="background-color: #eee; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; color: #333;">${otp}</span>
      </div>
      <p style="color: #555;">This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
      <p style="color: #555;">Best regards,<br/>Your Company Team</p>
    </div>
  `;
}