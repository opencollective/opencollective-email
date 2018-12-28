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
});
