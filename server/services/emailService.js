const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}) {
  const { data, error } = await resend.emails.send({
    from: "giavang.today <noreply@giavang.today>",
    to,
    subject: "Xác nhận tài khoản giavang.today",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Chào ${name || "bạn"},</h2>

        <p>
          Cảm ơn bạn đã đăng ký tài khoản tại giavang.today.
        </p>

        <p>
          Bấm vào link bên dưới để xác nhận email:
        </p>

        <p>
          <a href="${verificationUrl}">
            Xác nhận email
          </a>
        </p>

        <p>
          Link này sẽ hết hạn sau 30 phút.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

module.exports = {
  sendVerificationEmail,
};