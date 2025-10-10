// app/api/admin/resend-activation/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { brandId } = await request.json() as {
      brandId: string;
    };

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
    }

    // 1. Get brand information
    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // 2. Check if brand is in pending_activation status
    if (brand.status !== 'pending_activation') {
      return NextResponse.json({ 
        error: 'Brand is not in pending activation status' 
      }, { status: 400 });
    }

    // 3. Get user information
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      //console.log('Failed to fetch user data', userError);
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const user = users.users.find(u => u.email === brand.contact_email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found for this brand' }, { status: 404 });
    }

    // 4. Generate new activation link
    const tempPassword = `Welcome${Math.random().toString(36).slice(2, 8)}!${Math.floor(Math.random()*100)}`;
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: brand.contact_email,
      password: tempPassword,
      options: {
        data: {
          first_name: brand.contact_name?.split(' ')[0] || '',
          last_name: brand.contact_name?.split(' ').slice(1).join(' ') || '',
          role: 'brand_admin',
          brand_id: brand.id
        },
        redirectTo: `${process.env.NEXT_PLATFORM_URL}/dashboard`
      }
    });

    if (inviteError) {
      //console.log('Failed to generate activation link', inviteError);
      return NextResponse.json({ error: 'Failed to generate activation link' }, { status: 500 });
    }

    // 5. Send activation email
    await transporter.sendMail({
      from: 'Cxperia <onboarding@cxperia.com>',
      to: brand.contact_email,
      subject: `Activate Your Cxperia Account - ${brand.name}`,
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
            .notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://cxperia.com/logo.png" alt="Cxperia Logo" class="logo-img" />
            <div class="headline">Your Cxperia Account is Ready!</div>
          </div>
          <div class="content">
            <h2>Hello ${brand.contact_name},</h2>
            <p>Your Cxperia account for <strong>${brand.name}</strong> has been prepared by our team. You're one click away from activating your account.</p>
            
            <div class="notice">
              <strong>This is a resend of your activation email.</strong><br>
              If you've already activated your account, you can ignore this email.
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${inviteData?.properties?.action_link}" class="button">Activate Your Account</a>
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
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2025 Cxperia. Transforming product experiences.</p>
          </div>
        </body>
        </html>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Activation email resent successfully' 
    });

  } catch (error: any) {
    //console.log('Resend activation email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
