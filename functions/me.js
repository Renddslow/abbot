const tough = require('tough-cookie');
const jwt = require('jsonwebtoken');

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

exports.handler = async (event) => {
  const cookie = tough.Cookie.parse(event.headers.Cookie || '');
  // Adding this to prevent flickering on the splash screen
  await wait(1000);

  if (!cookie) {
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

  return {
    statusCode: 200,
  };
};
