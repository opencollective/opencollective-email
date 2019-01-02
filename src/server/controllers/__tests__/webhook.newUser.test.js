import { db, inspectSpy } from '../../lib/test';
import webhook from '../webhook';
import { unfollow } from '../api';

import sinon from 'sinon';
import libemail from '../../lib/email';
import models from '../../models';

import email1 from '../../mocks/mailgun.email1.json';
import email2 from '../../mocks/mailgun.email2.json';
import email3 from '../../mocks/mailgun.email3.json';
import email4 from '../../mocks/mailgun.email4.json';
import { inspect } from 'util';

describe('webhook email', () => {
  let sandbox, sendEmailSpy;

  beforeAll(db.reset);
  afterAll(db.close);

  beforeAll(() => {
    sandbox = sinon.createSandbox();
    sendEmailSpy = sandbox.spy(libemail, 'send');
  });

  afterAll(() => sandbox.restore());

  describe('sending first email in a thread', async () => {
    describe('email is empty', () => {
      beforeAll(async () => {
        sendEmailSpy.resetHistory();
        const req = { body: { ...email1, 'stripped-text': '', 'stripped-html': '' } };
        const res = { send: () => {} };
        await webhook(req, res);
      });
      it('sends the join group email', async () => {
        const post = await models.Post.findOne();
        expect(post).toBeNull();
        expect(sendEmailSpy.callCount).toEqual(1);
        expect(sendEmailSpy.firstCall.args[1]).toEqual('Action required: please confirm to join the testgroup group');
      });
    });

    describe('email is not empty', () => {
      beforeAll(async () => {
        sendEmailSpy.resetHistory();
        const req = {
          body: email1,
        };
        const res = { send: () => {} };
        await webhook(req, res);
      });
      it('send an email confirmation if first time user', async () => {
        expect(sendEmailSpy.callCount).toEqual(1);
        expect(sendEmailSpy.firstCall.args[0]).toEqual(email1.sender.toLowerCase());
        expect(sendEmailSpy.firstCall.args[1]).toEqual('Action required: your email is pending');
      });
      it("doesn't create any user account", async () => {
        const users = await models.User.findAll();
        expect(users.length).toEqual(0);
      });
      it("doesn't create any group", async () => {
        const groups = await models.Group.findAll();
        expect(groups.length).toEqual(0);
      });
    });
  });
});
