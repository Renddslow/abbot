const got = require('got');
const catchify = require('catchify');
const cheerio = require('cheerio');
const form = require('form-urlencoded').default;
const { CookieJar } = require('tough-cookie');
const { promisify } = require('util');

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
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
      },
      followRedirect: false,
      body: form(data),
    }),
  );

  return loginRes.headers['set-cookie'];
};

const createGroup = async (name) => {
  const cookieJar = new CookieJar();
  const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));

  const loginCookies = await login();
  await Promise.all(
    loginCookies.map((s) => setCookie(s, 'https://groups.planningcenteronline.com')),
  );

  const data = {
    utf8: '✓',
    group: {
      name,
      group_type_id: '190252',
    },
  };

  const [, groups] = await catchify(
    got(`https://groups.planningcenteronline.com/groups`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
      },
      cookieJar,
    }),
  );

  await Promise.all(
    groups.headers['set-cookie'].map((s) =>
      setCookie(s, 'https://groups.planningcenteronline.com'),
    ),
  );

  const [, html] = await catchify(
    got(`https://groups.planningcenteronline.com/groups/new`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
      },
      cookieJar,
    }),
  );

  await Promise.all(
    html.headers['set-cookie'].map((s) => setCookie(s, 'https://groups.planningcenteronline.com')),
  );

  const year = new Date().getFullYear() + 20;
  const extraCookie = `groups_persisted_filter_params_group_type_-group_type-190252=null; path=/; expires=Tue, 16 Apr ${year} 22:53:51 GMT; secure`;
  await setCookie(extraCookie, 'https://groups.planningcenteronline.com');

  const $ = cheerio.load(html.body.toString());
  const csrf = $('[name="csrf-token"]').attr('content');

  const [, create] = await catchify(
    got(`https://groups.planningcenteronline.com/groups`, {
      method: 'POST',
      body: form(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
        'x-csrf-token': csrf,
        'x-requested-with': 'XMLHttpRequest',
        referer: 'https://groups.planningcenteronline.com/groups?group_type=190252',
        origin: 'https://groups.planningcenteronline.com',
      },
      cookieJar,
    }),
  );

  const regexpr = /Turbolinks.visit\("(.*?)"/gm;
  const [, url] = regexpr.exec(create.body.toString());
  const pathname = new URL(url).pathname;

  return pathname.split('/').slice(-1)[0];
};

module.exports.createGroup = createGroup;
