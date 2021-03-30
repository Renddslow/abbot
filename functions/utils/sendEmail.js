const got = require('got');
const catchify = require('catchify');

const sendEmail = async (to, subject, message) =>
  catchify(
    got('https://api.mailgun.net/v3/flatland.church/messages', {
      method: 'POST',
      form: {
        from: 'Flatland Church <noreply@flatland.church>',
        to,
        subject,
        html: message,
      },
      username: 'api',
      password: process.env.MAILGUN_KEY,
    }),
  );

module.exports = sendEmail;
