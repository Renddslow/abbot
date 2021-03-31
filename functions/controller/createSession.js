const { get } = require('dot-prop');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');

const { getFieldId } = require('./fields');
const getPermissions = require('./getPermissions');
const { apiGet } = require('../utils/api');
const sendEmail = require('../utils/sendEmail');
const template = require('./template');

const SECRET = process.env.SECRET;

const createSession = async (parent, args) => {
  const { email } = args.input;

  const [err, data] = await apiGet('people', 'people', {
    where: {
      search_name_or_email: email,
    },
    include: 'field_data',
  });

  if (err) {
    throw new Error('Not authorized');
  }

  const matches = get(data, 'data', []);
  const permissionMap = get(data, 'included', []).reduce((acc, inc) => {
    if (get(inc, 'relationships.field_definition.data.id') === getFieldId('has_app_access')) {
      acc[get(inc, 'relationships.customizable.data.id', '')] =
        get(inc, 'attributes.value') === 'true';
    }

    return acc;
  }, {});

  const permittedTokens = (
    await Promise.all(
      matches
        .filter(({ id }) => permissionMap[id])
        .map(async (person) => {
          return {
            id: person.id,
            permissions: await getPermissions(person.id),
            firstName: person.attributes.first_name,
            lastName: person.attributes.last_name,
            email,
            name: person.attributes.name,
            avatar: person.attributes.avatar,
          };
        }),
    )
  ).map((person) => ({
    token: jwt.sign(person, SECRET, { expiresIn: '.5y' }),
    ...person,
  }));

  if (!permittedTokens.length) {
    throw new Error('You may not have permission to use this app.');
  }

  // email tokens
  const message = ejs.render(template, { permittedTokens });
  await sendEmail(email, 'Your Magic Link for Flatland Relationships', message);

  const plural = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const map = {
    one: 'a',
    two: 'a couple of',
    few: 'a few',
    other: 'a handful of',
  };

  return {
    message: `We found ${map[plural.select(permittedTokens.length)]} matching account${
      permittedTokens.length > 1 ? 's' : ''
    }. We've sent an email to "${email}" with your magic link.`,
  };
};

module.exports = createSession;
