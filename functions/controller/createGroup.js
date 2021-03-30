const got = require('got');
const catchify = require('catchify');
const cheerio = require('cheerio');
const form = require('form-urlencoded').default;

const login = async () => {
  const [, loginPage] = await catchify(got('https://login.planningcenteronline.com/login/new'));
  const $ = cheerio.load(loginPage.body.toString());

  const authenticity_token = $('[name="authenticity_token"]').val();

  const data = {
    utf8: '&#x2713;',
    authenticity_token,
    login: process.env.USERNAME,
    password: process.env.PASSWORD,
    commit: 'Log In',
  };

  const [, loginRes] = await catchify(
    got('https://login.planningcenteronline.com/login', {
      method: 'POST',
      headers: {
        Cookie: loginPage.headers['set-cookie'],
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36',
      },
      followRedirect: false,
      body: form(data),
    }),
  );

  return loginRes.headers['set-cookie'];
};

const createGroup = async (name) => {
  const cookies = await login();

  const data = {
    utf8: '&#x2713;',
    'group[name]': name,
    'group[group_type_id]': '190252',
  };

  const [, html] = await catchify(
    got(`https://groups.planningcenteronline.com/groups/new`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36',
        Cookie: cookies,
      },
    }),
  );

  const $ = cheerio.load(html.body.toString());
  const csrf = $('[name="csrf-token"]').attr('content');

  const [, create] = await catchify(
    got(`https://groups.planningcenteronline.com/groups`, {
      method: 'POST',
      body: form(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.146 Safari/537.36',
        Cookie: [...html.headers['set-cookie'], ...cookies],
        'x-csrf-token': csrf,
        'x-requested-with': 'XMLHttpRequest',
      },
    }),
  );

  const regexpr = /Turbolinks.visit\("(.*?)"/gm;
  const [, url] = regexpr.exec(create.body.toString());
  const pathname = new URL(url).pathname;

  return pathname.split('/').slice(-1)[0];
};

module.exports.createGroup = createGroup;
