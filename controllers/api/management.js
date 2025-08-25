// controllers/api/management.js
import nodemailer from "nodemailer";

export async function requestStock(req, res) {
  try {
    const { email, title, body } = req.body;
    if (!email || !title || !body) {
      return res.status(400).json({ error: "Email, title, and body are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // or another SMTP
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Lab Inventory" <${process.env.SMTP_USER}>`,
      to: email,
      subject: title,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Request email sent successfully!" });
  } catch (error) {
    console.error("Error sending stock request:", error);
    res.status(500).json({ error: "Failed to send request" });
  }
}