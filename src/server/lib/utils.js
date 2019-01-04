import { uniq, uniqBy, get } from 'lodash';

export const isValidEmail = email => {
  if (typeof email !== 'string') return false;
  return email.match(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

export const extractEmailsFromString = str => {
  const matches = str.match(/([^<@\s]+@[^\.]+\.[^\s>,]+)/g);
  if (matches && matches.length > 0) {
    return uniq(matches.map(m => m.toLowerCase()));
  } else {
    return [];
  }
};

export const isEmpty = str => {
  return (str || '').trim() === '';
};

export const pluralize = (singular, n, pluralForm) => {
  if (n === 1) return singular;
  return pluralForm || `${singular}s`;
};

/**
 * Extracts names and emails from a string with multiple names and emails
 * @param {*} str eg. "Xavier <xavier@gmail.com>, email2@hotmail.com,"
 * @POST: [ {name, email}]
 */
export const extractNamesAndEmailsFromString = str => {
  const recipients = str.split(',').map(recipient => {
    const matches = recipient.match(/([^<]+)<([^@]+@[^\.]+\.[^>]+)>/);
    if (matches) {
      return {
        name: matches[1].trim(),
        email: matches[2].toLowerCase(),
      };
    } else {
      return {
        email: extractEmailsFromString(recipient)[0],
      };
    }
  });
  return uniqBy(recipients.filter(r => isValidEmail(r.email)), r => r.email);
};

/**
 * Parses components of an email address
 * @param {*} emailAddress
 * @PRE: :groupSlug/(:ParentPostId)?/(:PostId)?/(:action)?+tag1+tag2@domain.tld
 * @POST: { inbox, ParentPostId, PostId, tags[] }
 */
export const parseEmailAddress = emailAddress => {
  const emailTokens = emailAddress.match(/([^\+]*)(\+(.*))?@.*/);
  if (!emailTokens) {
    throw new Error('Invalid email address');
  }
  let inbox = emailTokens[1].toLowerCase();

  const parts = inbox.split('/');
  const parsed = {
    groupSlug: get(parts, '[0]'),
    tags: emailTokens[3] ? emailTokens[3].toLowerCase().split('+') : [],
  };

  if (isNaN(get(parts, '[1]'))) {
    parsed.action = get(parts, '[1]');
  } else {
    parsed.ParentPostId = Number(get(parts, '[1]'));
    if (isNaN(get(parts, '[2]'))) {
      parsed.action = get(parts, '[2]');
    } else {
      parsed.PostId = Number(get(parts, '[2]'));
      if (get(parts, '[3]')) {
        parsed.action = get(parts, '[3]');
      }
    }
  }

  return parsed;
};
