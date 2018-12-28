import { uniq, uniqBy } from 'lodash';

export const extractEmailsFromString = str => {
  const matches = str.match(/([^<@\s]+@[^\.]+\.[^\s>,]+)/g);
  if (matches && matches.length > 0) {
    return uniq(matches.map(m => m.toLowerCase()));
  } else {
    return [];
  }
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
  return uniqBy(recipients, r => r.email);
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
