const sendEmail = require("./email");
require("dotenv").config();

(async () => {
  try {
    await sendEmail({
      email: "joelhanson002@gmail.com",
      subject: "Mailtrap Test",
      message: "Congratulations! Your email configuration is working.",
    });

    console.log("Email sent successfully.");
  } catch (err) {
    console.error(err);
  }
})();
