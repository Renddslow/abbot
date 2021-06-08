const jwt = require('jsonwebtoken');
const Cookie = require('cookie');

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

exports.handler = async (event) => {
  const cookie = Cookie.parse(event.headers.cookie || '');
  // Adding this to prevent flickering on the splash screen
  await wait(1000);

  if (!cookie || !cookie['_fc-abbot-acount']) {
    return Promise.resolve({
      statusCode: 401,
      body: JSON.stringify({
        errors: [
          {
            id: new Date().getTime().toString(16),
            code: 'NotLoggedInError',
            status: 401,
            title: 'Not Logged In',
            detail: `https://i.kym-cdn.com/photos/images/newsfeed/001/535/068/29d.jpg`,
          },
        ],
      }),
    });
  }

  try {
    const data = jwt.verify(cookie['_fc-abbot-acount'], process.env.SECRET);
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify(data),
    });
  } catch (e) {
    return Promise.resolve({
      statusCode: 400,
    });
  }
};
