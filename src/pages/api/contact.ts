export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name')?.toString() ?? '';
  const email = data.get('email')?.toString() ?? '';
  const message = data.get('message')?.toString() ?? '';

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ success: false, error: 'Faltan campos' }), { status: 400 });
  }

  const user = import.meta.env.SMTP_USER;
  const pass = import.meta.env.SMTP_PASS;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Web Nil Mariages" <${user}>`,
    to: user,
    replyTo: email,
    subject: `Nuevo contacto de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    html: `<p><strong>Nombre:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensaje:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
