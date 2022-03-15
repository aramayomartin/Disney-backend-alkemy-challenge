const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function RegisterEmail(destiny) {
  const msg = {
    to: destiny,
    from: "raularamayom@gmail.com", // Use the email address or domain you verified above
    subject: "Welcome to Disney App!",
    text: "Congratulations, now you are part of the wonderful world of Disney.",
    html: "<strong>Congratulations, now you are part of the wonderful world of Disney.</strong>",
  };
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
}

function LoginEmail(destiny) {
  const msg = {
    to: destiny,
    from: "raularamayom@gmail.com", // Use the email address or domain you verified above
    subject: "New login detected!",
    text: "Activity detected in your account.",
    html: "<strong>Activity detected in your account.</strong>",
  };
  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
}

module.exports =  { RegisterEmail, LoginEmail };
