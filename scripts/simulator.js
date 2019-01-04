process.env.NODE_ENV = 'test';

const util = require('util');
const spawn = require('child_process').spawn;
const prompts = require('prompts');
const sinon = require('sinon');
const sequelize = require('../src/server/models');
const libemail = require('../src/server/lib/email');
const spy = sinon.spy(libemail.default, 'send');
const testutils = require('../src/server/lib/test');
const webhookControllers = require('../src/server/controllers/webhook');
const email1 = require('../src/server/mocks/mailgun.email1.json');
const models = sequelize.sequelize.models;
const webhook = webhookControllers.default;

const groups = ['engineering'];
const users = [
  {
    name: 'Xavier',
    email: 'xavier@opencollective.com',
  },
  {
    name: 'Pia',
    email: 'pia@opencollective.com',
  },
  {
    name: 'Nick (engineering)',
    email: 'nick@opencollective.com',
  },
  {
    name: 'François (engineering)',
    email: 'francois@opencollective.com',
  },
  {
    name: 'Benjamin (engineering)',
    email: 'benjamin@opencollective.com',
  },
  {
    name: 'Cuiki (new user)',
    email: 'cuiki@opencollective.com',
  },
];

function getChoices(array) {
  const res = [];
  return array.map(key => ({ title: key.name, value: key.email }));
}

async function processResponses(responses) {
  let config = {};
  const fromUser = users.find(u => u.email === responses.fromEmail);
  const fromUsername = fromUser ? fromUser.name : responses.fromEmail.substr(0, responses.fromEmail.indexOf('@'));
  const from = `${fromUsername} <${responses.fromEmail}>`;
  const req = {
    body: {
      ...email1,
      sender: responses.fromEmail,
      'Reply-To': responses.fromEmail,
      from,
      From: from,
      recipient: responses.recipient,
      To: responses.recipient,
      Cc: responses.cc,
      subject: responses.subject,
      'stripped-text': responses.body,
      'stripped-html': `<p>${responses.body}</p>`,
    },
  };
  const res = { send: msg => console.log(msg) };
  await webhook(req, res);
  for (let i = 0; i < spy.callCount; i++) {
    console.log(' ');
    console.log(`–––––––––––––––––––– email ${i + 1} ––––––––––––––––––––`);
    console.log('To:\t\t', spy.args[i][0]);
    console.log('Cc:\t\t', spy.args[i][4].cc);
    console.log('Reply-To:\t', spy.args[i][4].headers && spy.args[i][4].headers['Reply-To']);
    console.log('Subject:\t', spy.args[i][1]);
    console.log(`Body:\n\n${spy.args[i][2]}`);
    // console.log(spy.args[i][3]); HTML
    console.log(' ');
  }
  spy.resetHistory();
}

async function setup() {
  await testutils.db.reset();
  console.log(' ');
  await models.User.bulkCreate(users.slice(0, 5));
  const group = await models.Group.create({
    UserId: 1,
    slug: groups[0],
  });
  const followers = [
    { email: 'nick@opencollective.com' },
    { email: 'francois@opencollective.com' },
    { email: 'benjamin@opencollective.com' },
  ];
  await group.addFollowers(followers);
  console.log('setup:', group.slug, 'group created with ', followers.length, 'followers');
  console.log('setup:', followers.map(f => f.email).join(', '));
  const postData = {
    UserId: 1,
    GroupId: group.id,
    title: 'First post example',
    text: 'This is a great post',
  };
  const post = await models.Post.create(postData);
  await post.addFollowers([{ email: 'xavier@opencollective.com' }]);
  console.log(`setup: post created on /${group.slug}/${post.slug}, followed by xavier@opencollective.com`);
  console.log(' ');
}

const questions = [
  {
    type: 'select',
    name: 'fromEmail',
    message: 'Pick a user',
    choices: getChoices(users),
    initial: 0,
  },
  {
    type: 'text',
    name: 'recipient',
    message: 'Recipient',
    initial: 'testgroup@citizenspring.be',
  },
  {
    type: 'text',
    name: 'cc',
    message: 'Cc',
  },
  {
    type: 'text',
    name: 'subject',
    message: 'Subject',
    initial: 'New thread',
  },
  {
    type: 'text',
    name: 'body',
    message: 'Body',
    initial: 'Hello world!\nmutiline',
  },
];

async function run() {
  const responses = await prompts(questions);
  if (Object.keys(responses).length < questions.length) {
    console.log('Interrupted');
    process.exit(0);
  }
  await processResponses(responses);
  await run();
}

async function main({ argv }) {
  // console.log('hi', argv)

  console.log('This utility makes it easy to test the webhook.');
  console.log('');
  console.log('');

  await setup();

  await run();

  return 0;
}

main(process)
  .then(process.exit)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
