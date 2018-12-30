import * as utils from '../utils';

describe('utils', () => {
  const stringOfEmails =
    'First Recipient <firstrecipient@gmail.com>, xdamman+org@opencollective.org, testgroup+tag1@citizenspring.be, Dimitri <dimitri@brusselstogether.org>';
  it('extract emails from string', () => {
    expect(utils.extractEmailsFromString(stringOfEmails)).toEqual([
      'firstrecipient@gmail.com',
      'xdamman+org@opencollective.org',
      'testgroup+tag1@citizenspring.be',
      'dimitri@brusselstogether.org',
    ]);
  });
  it('extract names and emails from string', () => {
    const recipients = utils.extractNamesAndEmailsFromString(stringOfEmails);
    expect(recipients).toEqual([
      { name: 'First Recipient', email: 'firstrecipient@gmail.com' },
      { email: 'xdamman+org@opencollective.org' },
      { email: 'testgroup+tag1@citizenspring.be' },
      { name: 'Dimitri', email: 'dimitri@brusselstogether.org' },
    ]);
  });

  it('parses the components of an email address', () => {
    let parsed;
    parsed = utils.parseEmailAddress('coordination@citizenspring.be');
    expect(parsed).toEqual({
      groupSlug: 'coordination',
      tags: [],
    });
    parsed = utils.parseEmailAddress('coordination+tag1+tag2@citizenspring.be');
    expect(parsed).toEqual({
      groupSlug: 'coordination',
      tags: ['tag1', 'tag2'],
    });
    parsed = utils.parseEmailAddress('coordination/posts/13@citizenspring.be');
    expect(parsed).toEqual({
      groupSlug: 'coordination',
      ThreadId: 13,
      tags: [],
    });
    parsed = utils.parseEmailAddress('coordination/posts/13/312+tag1@citizenspring.be');
    expect(parsed).toEqual({
      groupSlug: 'coordination',
      ThreadId: 13,
      PostId: 312,
      tags: ['tag1'],
    });
  });
});
