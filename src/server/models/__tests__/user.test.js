import models from '../';
import { db } from '../../lib/test';

describe('user model', () => {
  let user, group;
  beforeAll(db.reset);
  beforeAll(async () => {
    user = await models.User.create({ email: 'user@email.com' });
    group = await user.createGroup({ slug: 'test' });
  });
  afterAll(db.close);

  it('creates a group and makes the user an ADMIN and FOLLOWER', async () => {
    const roles = await models.Member.findAll({
      attributes: ['role'],
      where: {
        GroupId: group.id,
        UserId: user.id,
      },
    }).map(r => r.role);
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('FOLLOWER');
  });

  it('follows a post', async () => {
    const post = await models.Post.create({
      UserId: user.id,
      GroupId: group.id,
      title: 'first post',
    });
    await user.follow({ PostId: post.PostId });
    const roles = await models.Member.findAll({
      attributes: ['role'],
      where: {
        UserId: user.id,
        PostId: post.PostId,
      },
    });
    expect(roles.length).toEqual(1);
    expect(roles[0].role).toEqual('FOLLOWER');
    // await user.unfollow(group.id, post.id);
  });

  it('unfollows', async () => {
    await user.unfollow({ GroupId: group.GroupId });
    const roles = await models.Member.findAll({
      attributes: ['role'],
      where: {
        GroupId: group.id,
        UserId: user.id,
      },
    });
    expect(roles.length).toEqual(1);
    expect(roles[0].role).toEqual('ADMIN');
  });
});
