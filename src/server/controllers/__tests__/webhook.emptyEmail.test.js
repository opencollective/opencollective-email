import { db, inspectSpy } from '../../lib/test';
import webhook from '../webhook';
import { unfollow } from '../api';

import sinon from 'sinon';
import libemail from '../../lib/email';
import models from '../../models';

import email1 from '../../mocks/mailgun.email1.json';
import { inspect } from 'util';

const req = { body: { ...email1, 'stripped-text': '', 'stripped-html': '' } };
const res = { send: () => {} };

describe('webhook empty email, existing user', () => {
  let sandbox, sendEmailSpy, user;

  beforeAll(db.reset);
  afterAll(db.close);

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    sendEmailSpy = sandbox.spy(libemail, 'send');
    user = await models.User.create({ email: 'firstsender@gmail.com' });
  });

  afterAll(() => sandbox.restore());

  /*
  describe('follow group', async () => {
    it('sends an email to :groupSlug/follow@domain to follow the group', async () => {
      const group = await models.Group.create({ slug: 'testgroup', UserId: user.id });
      let membership = await models.Member.findOne({
        where: { UserId: user.id, GroupId: group.GroupId, role: 'FOLLOWER' },
      });
      expect(membership).toBeNull;
      await webhook(
        {
          body: {
            ...req.body,
            recipient: 'testgroup/follow@citizenspring.be',
          },
        },
        res,
      );
      membership = await models.Member.findOne({
        where: { UserId: user.id, GroupId: group.GroupId, role: 'FOLLOWER' },
      });
      console.log(membership);
      expect(membership).notToBeNull;
    });
  });
*/
  describe('sending first email in a thread', async () => {
    beforeAll(async () => {
      sendEmailSpy.resetHistory();
    });

    it("creates a group but doesn't create a post", async () => {
      sendEmailSpy.resetHistory();
      let groupsCount = await models.Group.count();
      expect(groupsCount).toEqual(0);
      await webhook(req, res);
      const groups = await models.Group.findAll();
      expect(groups.length).toEqual(1);
      const post = await models.Post.findOne();
      expect(post).toBeNull();
      expect(sendEmailSpy.callCount).toEqual(1);
      expect(sendEmailSpy.firstCall.args[1]).toEqual('New group email created');
    });

    it('sends the group info if group already exists', async () => {
      sendEmailSpy.resetHistory();
      const group = await models.Group.create({ slug: 'testgroup2', version: 1, UserId: user.id });
      await models.Post.create({ GroupId: group.GroupId, title: 'post 1', UserId: user.id });
      await models.Post.create({ GroupId: group.GroupId, title: 'post 2', UserId: user.id });
      await models.Post.create({ GroupId: group.GroupId, title: 'post 3', UserId: user.id });
      await models.Post.create({ GroupId: group.GroupId, title: 'post 4', UserId: user.id });
      await models.Post.create({ GroupId: group.GroupId, title: 'post 5', UserId: user.id });
      const resultList = await group.getPosts();
      expect(resultList.total).toEqual(5);
      await webhook(
        {
          body: {
            ...req.body,
            recipient: 'testgroup2@citizenspring.be',
          },
        },
        res,
      );
      expect(sendEmailSpy.callCount).toEqual(1);
      expect(sendEmailSpy.firstCall.args[1]).toEqual('testgroup2 group info');
      expect(sendEmailSpy.firstCall.args[3]).toContain('testgroup2@citizenspring.be has 3 followers and 5 posts');
      await group.destroy();
      await models.Post.truncate();
    });
  });
});
