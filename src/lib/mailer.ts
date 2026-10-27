import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }: { to: string, subject: string, text?: string, html?: string }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Safety guard: Strictly block sending emails to @nybinfotech.com per user policy
    if (to && to.toLowerCase().includes('@nybinfotech.com')) {
      console.warn(`[Safety Guard] Blocked outgoing email to @nybinfotech.com: ${to}`);
      return { success: false, error: 'Emails to @nybinfotech.com are blocked per security policy.' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    // Return success false instead of throwing so it doesn't crash the API route
    return { success: false, error };
  }
};
