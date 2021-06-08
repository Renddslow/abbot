const tough = require('tough-cookie');

exports.handler = async (event) => {
  const { token } = event.queryStringParameters;

  if (!token) {
    return Promise.resolve({
      statusCode: 400,
    });
  }

  const cookie = new tough.Cookie({
    key: '_fc-abbot-acount',
    value: token,
    maxAge: 60 * 60 * 24 * 14, // 14 days
    domain: 'flatland.church',
    httpOnly: true,
    secure: true,
  });

  return {
    statusCode: 307,
    headers: {
      'Set-Cookie': cookie.toString(),
      Location: '/relationships',
    },
  };
};
