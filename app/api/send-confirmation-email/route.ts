// app/api/send-confirmation-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    const { data, error } = await resend.emails.send({
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
            If you didn't create an account with BeautyConnect, please ignore this email.
          </p>
        </div>
      `
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}