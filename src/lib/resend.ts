import { Resend } from 'resend';

// TEMPORARY: Hardcoded API key for testing
// TODO: Fix environment variable loading issue
const RESEND_API_KEY = 're_FWQWvciz_CTzHV7G68Q1HXXdj3kSVRq7S';

console.log('🔍 Using RESEND_API_KEY:', RESEND_API_KEY ? 'Found' : 'Missing');

const resend = new Resend(RESEND_API_KEY);

export async function sendOTPEmail(email: string, otp: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CleanMatch <onboarding@resend.dev>', // Change this to your verified domain
      to: [email],
      subject: 'Your CleanMatch Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
              }
              .logo {
                font-size: 32px;
                font-weight: bold;
                color: #003d29;
                margin-bottom: 20px;
              }
              .title {
                font-size: 24px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 16px;
              }
              .message {
                font-size: 16px;
                color: #666;
                margin-bottom: 32px;
              }
              .otp-box {
                background: white;
                border-radius: 12px;
                padding: 24px;
                margin: 24px 0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .otp-code {
                font-size: 48px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #003d29;
                font-family: 'Courier New', monospace;
              }
              .expiry {
                font-size: 14px;
                color: #999;
                margin-top: 16px;
              }
              .footer {
                margin-top: 32px;
                font-size: 14px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🧺 CleanMatch</div>
              <div class="title">Verify Your Email</div>
              <div class="message">
                ${name ? `Hi ${name},` : 'Hello,'}<br>
                Thank you for signing up! Please use the verification code below to complete your registration.
              </div>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expiry">This code will expire in 10 minutes</div>
              </div>
              <div class="footer">
                If you didn't request this code, please ignore this email.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

export { resend };
