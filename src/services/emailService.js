const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "petpal@gmail.com",
    pass: "app_password",
  },
});

exports.sendAppointmentReminder = (email, petName, date) => {
  const mailOptions = {
    from: "petpal@gmail.com",
    to: email,
    subject: "Pet Appointment Reminder",
    text: `Reminder: ${petName} has an appointment on ${date}`,
  };

  transporter.sendMail(mailOptions);
};
