import models from '../';
import { db } from '../../lib/test';
let user;
describe('group model', async () => {
  beforeAll(db.reset);
  beforeAll(async () => {
    user = await models.User.create({ email: 'user@gmail.com' });
  });
  afterAll(db.close);

  it('creates a new version when editing a group data', async () => {
    const group = await models.Group.create({
      slug: 'test',
      UserId: user.id,
      name: 'test group',
    });
    const newVersion = await group.edit({ description: 'new description' });
    expect(newVersion.GroupId).toEqual(1);
    expect(newVersion.version).toEqual(2);
    const versions = await models.Group.findAll({ where: { slug: 'test' } });
    expect(versions.length).toEqual(2);
    const latestVersion = await models.Group.findBySlug('test');
    expect(latestVersion.description).toEqual('new description');
  });

  describe('followers', async () => {
    let group;
    beforeAll(async () => {
      group = await user.createGroup({ slug: 'newgroup' });
      await group.addFollowers([
        { name: 'xavier', email: 'xavier@email.com' },
        { firstName: 'dimitri', email: 'dimitri@email.com' },
        { email: user.email },
      ]);
    });
    it('adds followers', async () => {
      const members = await models.Member.findAll({ where: { role: 'FOLLOWER', GroupId: group.GroupId } });
      expect(members.length).toEqual(3);
    });
    it('gets followers', async () => {
      const followers = await group.getFollowers();
      expect(followers.length).toEqual(3);
    });
  });
});
