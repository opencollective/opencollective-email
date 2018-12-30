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
    describe('sender is a new user', () => {
      beforeAll(async () => {
        const req = {
          body: email1,
        };
        const res = { send: () => {} };
        await webhook(req, res);
      });
      it('send an email confirmation if first time user', async () => {
        expect(sendEmailSpy.callCount).toEqual(1);
        expect(sendEmailSpy.firstCall.args[0]).toEqual(email1.sender.toLowerCase());
        expect(sendEmailSpy.firstCall.args[1]).toMatch(/Action required/);
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

    describe('sender is already a confirmed user', () => {
      beforeAll(async () => {
        sendEmailSpy.resetHistory();
        await models.User.create({ email: 'firstsender@gmail.com' });
      });

      describe('email is empty', () => {
        beforeAll(async () => {
          sendEmailSpy.resetHistory();
          const req = { body: { ...email1, 'stripped-text': '' } };
          const res = { send: () => {} };
          await webhook(req, res);
        });
        it("creates a group but doesn't create a post", async () => {
          const groupsCount = await models.Group.count();
          expect(groupsCount).toEqual(1);
          const post = await models.Post.findOne();
          expect(post).toBeNull();
          expect(sendEmailSpy.callCount).toEqual(1);
        });
      });

      describe('email is not empty', () => {
        beforeAll(async () => {
          sendEmailSpy.resetHistory();
          const req = { body: email1 };
          const res = { send: () => {} };
          await webhook(req, res);
        });

        it('creates a post', async () => {
          const post = await models.Post.findOne();
          expect(post.EmailThreadId).toEqual(email1['Message-Id']);
          expect(post.html).toEqual(email1['stripped-html']);
          expect(post.text).toEqual(email1['stripped-text']);
        });
        it('creates users for all persons cced', async () => {
          const users = await models.User.findAll({ order: [['email', 'ASC']] });
          expect(users.length).toEqual(2);
          expect(users.map(u => u.email)).toContain('firstrecipient@gmail.com');
        });

        it('creates the group and add creator and all persons cced as ADMIN and FOLLOWER of the group and the post', async () => {
          const group = await models.Group.findOne();
          const post = await models.Post.findOne();
          const postFollowers = await models.Member.findAll({ where: { PostId: post.PostId, role: 'FOLLOWER' } });
          expect(postFollowers.length).toEqual(2);
          const groupFollowers = await models.Member.findAll({ where: { GroupId: group.GroupId, role: 'FOLLOWER' } });
          expect(groupFollowers.length).toEqual(2);
          const admins = await models.Member.findAll({ where: { GroupId: group.id, role: 'ADMIN' } });
          expect(admins.length).toEqual(2);
        });

        it('sends the email to all followers of the group', async () => {
          expect(sendEmailSpy.callCount).toEqual(2);
          expect(sendEmailSpy.secondCall.args[0]).toEqual('testgroup@citizenspring.be');
          expect(sendEmailSpy.secondCall.args[4].cc).toEqual('firstrecipient@gmail.com');
          expect(sendEmailSpy.secondCall.args[2]).toMatch('Click here to stop receiving new emails sent to testgroup@');
        });

        it('unsubscribes from the group', async () => {
          // Test unsubscribe from group
          const matches = sendEmailSpy.secondCall.args[2].match(/\/api\/unfollow\?token=([^\s]+)/);
          const req = { query: { token: matches[1] } };
          const res = {
            send: msg => {
              expect(msg).toEqual('You have successfully unsubscribed from new messages sent to this group');
            },
          };
          await unfollow(req, res);
          const group = await models.Group.findOne();
          const user = await models.User.findByEmail('firstrecipient@gmail.com');
          const member = await models.Member.findOne({
            where: { role: 'FOLLOWER', UserId: user.id, GroupId: group.GroupId },
          });
          expect(member).toBeNull();
        });
      });
    });
  });

  describe('replying to first email in a thread', () => {
    let req = { body: email1 };
    const res = { send: () => {} };
    beforeAll(async () => {
      sendEmailSpy.resetHistory();
      await db.reset();
      await models.User.create({ email: 'firstsender@gmail.com' });
      // sending first email which creates one group, one post
      await webhook(req, res);
    });
    it('only send to the first sender', async () => {
      sendEmailSpy.resetHistory();
      // sending reply
      req.body = email2;
      await webhook(req, res);
      const posts = await models.Post.findAll();
      expect(posts[0].UserId).toEqual(1);
      expect(posts[1].UserId).toEqual(2);
      expect(posts[1].ParentPostId).toEqual(posts[0].PostId);
      expect(posts[1].text).toMatch(/Replying to all/);
      expect(sendEmailSpy.callCount).toEqual(1);
      expect(sendEmailSpy.firstCall.args[0]).toEqual('testgroup@citizenspring.be');
      expect(sendEmailSpy.firstCall.args[4].cc).toEqual(email1.sender);
      expect(sendEmailSpy.firstCall.args[1]).toEqual(email2.subject);
    });

    it("don't send to followers of the group that don't follow the thread", async () => {
      sendEmailSpy.resetHistory();
      const group = await models.Group.findOne();
      await group.addFollowers([{ email: 'groupfollower@gmail.com' }]);
      const post = await models.Post.findOne();
      await post.addFollowers([{ email: 'threadfollower@gmail.com' }]);
      // sending reply
      req.body = email2;
      await webhook(req, res);
      expect(sendEmailSpy.callCount).toEqual(2);
      expect([sendEmailSpy.args[0][4].cc, sendEmailSpy.args[1][4].cc]).toContain(email1.sender);
      expect([sendEmailSpy.args[0][4].cc, sendEmailSpy.args[1][4].cc]).toContain('threadfollower@gmail.com');
      expect(sendEmailSpy.firstCall.args[2]).toMatch('Click here to stop receiving new replies to this thread');
      expect(sendEmailSpy.secondCall.args[2]).toMatch('Click here to stop receiving new replies to this thread');

      // Test unsubscribe from thread
      const matches = sendEmailSpy.secondCall.args[2].match(/\/api\/unfollow\?token=([^\s]+)/);
      req.query = { token: matches[1] };
      res.send = msg => {
        expect(msg).toEqual('You have successfully unsubscribed from future updates to this thread');
      };
      await unfollow(req, res);
      const user = await models.User.findByEmail(sendEmailSpy.secondCall.args[4].cc);
      const member = await models.Member.findOne({ where: { role: 'FOLLOWER', UserId: user.id, PostId: post.PostId } });
      expect(member).toBeNull();
    });
  });
});
