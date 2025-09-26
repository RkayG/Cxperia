// app/api/admin/send-invitation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, brandName, contactName, loginEmail, salesRep } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Cxperia <onboarding@cxperia.com>',
      to: to,
      subject: `Welcome to Cxperia - Your ${brandName} Account is Ready!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; text-align: center; color: white; }
            .content { background: #f9fafb; padding: 30px; }
            .button { background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> Welcome to Cxperia!</h1>
              <p>Your brand account for ${brandName} is ready</p>
            </div>
            
            <div class="content">
              <h2>Hello ${contactName},</h2>
              
              <p>Your BeautyConnect account has been set up by our team. You can now start creating beautiful digital experiences for your customers.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Your Login Details:</h3>
                <p><strong>Email:</strong> ${loginEmail}</p>
                <p><strong>Platform:</strong> <a href="https://beautyconnect.com/login">beautyconnect.com/login</a></p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://cxperia.com/auth/login" class="button">Access Your Dashboard</a>
              </div>

              <p>With your account, you can:</p>
              <ul>
                <li>Create QR code experiences for your products</li>
                <li>Upload tutorials and ingredient information</li>
                <li>Track customer engagement analytics</li>
                <li>Manage your brand's digital presence</li>
              </ul>

              <p><strong>Need help getting started?</strong><br>
              Your dedicated contact: ${salesRep}<br>
              Schedule a onboarding call: <a href="https://calendly.com/beautyconnect/onboarding">Book a session</a></p>
            </div>
            
            <div class="footer">
              <p>© 2024 Cxperia. All rights reserved.</p>
              <p><a href="https://cxperia.com">Visit our website</a> | <a href="mailto:support@cxperia.com">Contact support</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}