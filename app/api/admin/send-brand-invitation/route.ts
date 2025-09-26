// app/api/admin/send-invitation/route.ts

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.MAIL_PORT) || 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { to, brandName, contactName, activationLink, salesRep } = await request.json() as {
      to: string;
      brandName: string;
      contactName: string;
      activationLink: string;
      salesRep: string;
    };

    await transporter.sendMail({
      from: 'Cxperia <onboarding@cxperia.com>',
      to,
      subject:  `Activate Your Cxperia Account - ${brandName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #fff; padding: 32px 0 16px 0; text-align: center; border-radius: 10px 10px 0 0; }
            .logo-img { max-width: 180px; margin-bottom: 16px; }
            .headline { background: linear-gradient(135deg, #8B5CF6); color: white; padding: 18px 0; font-size: 22px; font-weight: 600; margin-bottom: 0; }
            .content { background: #f9fafb; padding: 30px; }
            .button { background: #8B5CF6; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://cxperia.com/logo.png" alt="Cxperia Logo" class="logo-img" />
            <div class="headline">Your Cxperia Account is Ready!</div>
          </div>
          <div class="content">
            <h2>Hello ${contactName},</h2>
            <p>Your Cxperia account for <strong>${brandName}</strong> has been prepared by our team. You're one click away from accessing your dashboard.</p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${activationLink}" class="button">Activate Your Account</a>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">What happens next:</h3>
              <ol>
                <li>Click the activation button above</li>
                <li>Set your secure password</li>
                <li>Access your brand dashboard immediately</li>
                <li>Start creating beautiful product experiences</li>
              </ol>
            </div>
            <p><strong>Important:</strong> This activation link expires in 24 hours.</p>
            <p>If you have any questions, your dedicated contact is:<br>
            <strong>${salesRep}</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Cxperia. Transforming product experiences.</p>
          </div>
        </body>
        </html>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Invitation email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}