import { uniq, uniqBy } from 'lodash';

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

export const extractInboxAndTagsFromEmailAddress = emailAddress => {
  const emailTokens = emailAddress.match(/([^\+]*)(\+(.*))?@.*/);
  if (!emailTokens) {
    throw new Error('Invalid email address');
  }
  const inbox = emailTokens[1].toLowerCase();
  const tags = emailTokens[3].toLowerCase().split('+');
  return { inbox, tags };
};
