/**
 * Render HTML email template for custom intake link
 * Styled and professional email with the custom link
 */
export function renderCustomLinkHTML(
  recipientName: string,
  customLink: string,
  expiresInDays: number,
  firstName?: string,
  lastName?: string,
  organizationName?: string
): string {
  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : recipientName;
  const orgText = organizationName ? ` from ${organizationName}` : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Intake Form</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Let's Build Your Project Together</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Complete your project intake form</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">
                Hi ${fullName}${orgText},
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #555; line-height: 1.7;">
                Thank you for your interest in working with me! I've prepared a personalized intake form to help me understand your project needs better.
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #555; line-height: 1.7;">
                Please click the button below to access your customized intake form. The form is pre-filled with your information to make the process as smooth as possible.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="text-align: center; padding: 0;">
                    <a href="${customLink}" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                      Access Your Intake Form
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 20px 0 0 0; font-size: 14px; color: #888; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <a href="${customLink}" style="color: #667eea; word-break: break-all; text-decoration: none;">${customLink}</a>
              </p>
              
              <!-- Expiry Notice -->
              <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>⏰ Note:</strong> This link will expire in ${expiresInDays} ${
    expiresInDays === 1 ? "day" : "days"
  }. If you need a new link, please contact me directly.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                Questions? Feel free to reach out!
              </p>
              <p style="margin: 0; font-size: 14px; color: #666;">
                <a href="mailto:contact@omrijukin.com" style="color: #667eea; text-decoration: none;">contact@omrijukin.com</a> | 
                <a href="https://omrijukin.com" style="color: #667eea; text-decoration: none;">omrijukin.com</a>
              </p>
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} Omri Jukin. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Render plain text version of custom link email
 */
export function renderCustomLinkText(
  recipientName: string,
  customLink: string,
  expiresInDays: number,
  firstName?: string,
  lastName?: string,
  organizationName?: string
): string {
  const fullName =
    firstName && lastName ? `${firstName} ${lastName}` : recipientName;
  const orgText = organizationName ? ` from ${organizationName}` : "";

  return `
Let's Build Your Project Together

Hi ${fullName} ${orgText}

Thank you for your interest in working with me! I've prepared a personalized intake form to help me understand your project needs better.

Please use the link below to access your customized intake form. The form is pre-filled with your information to make the process as smooth as possible.

Access Your Intake Form:
${customLink}

Note: This link will expire in ${expiresInDays} ${
    expiresInDays === 1 ? "day" : "days"
  }. If you need a new link, please contact me directly.

Questions? Feel free to reach out!
Email: contact@omrijukin.com
Website: https://omrijukin.com

© ${new Date().getFullYear()} Omri Jukin. All rights reserved.
  `.trim();
}
