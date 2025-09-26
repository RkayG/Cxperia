// app/api/send-confirmation-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

interface RequestBody {
  email: string;
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = (await request.json()) as RequestBody;

    await transporter.sendMail({
      from: 'Cxperia <confirm@cxperia.com>',
      to: email,
      subject: 'Your Confirmation Code - Cxperia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7C3AED;">Welcome to Cxperia! </h2>
          
          <p>Your confirmation code is:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #7C3AED; letter-spacing: 8px;">
                ${code}
              </span>
            </div>
          </div>

          <p>Enter this code in your browser to confirm your email address.</p>
          
          <p><strong>This code expires in 30 minutes.</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            If you didn't create an account with Cxperia, please ignore this email.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}