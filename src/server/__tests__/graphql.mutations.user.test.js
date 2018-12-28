import { graphqlQuery, db, inspectSpy, waitForCondition } from '../lib/test';
import sinon from 'sinon';
import libemail from '../lib/email';
import models from '../models';

describe('user', () => {
  let sandbox, sendEmailSpy;

  beforeAll(db.reset);
  afterAll(db.close);
  beforeAll(() => {
    sandbox = sinon.createSandbox();
    sendEmailSpy = sandbox.spy(libemail, 'send');
  });

  afterAll(() => sandbox.restore());

  describe('signin', () => {
    const signinQuery = `
    mutation signin($user: UserInputType!) {
      signin(user: $user) {
        id
        token
      }
    }
    `;

    it('creates a new user and emails a short code', async () => {
      const userData = {
        email: 'user@gmail.com',
      };
      const res = await graphqlQuery(signinQuery, { user: userData });
      expect(res.errors).toBeUndefined();
      expect(res.data.signin.id).toEqual(1);
      expect(res.data.signin.token).toBeNull;
      await waitForCondition(() => sendEmailSpy.callCount > 0);
      expect(sendEmailSpy.callCount).toEqual(1);
      expect(sendEmailSpy.firstCall.args[0]).toEqual(userData.email);
      expect(sendEmailSpy.firstCall.args[1]).toEqual('Signing in to Citizen Spring 🌱');
      expect(sendEmailSpy.firstCall.args[3]).toMatch(/[1-9][0-9]{4}/);
      const user = await models.User.findOne();
      expect(user.email).toEqual(userData.email);
      expect(user.token.length).toEqual(5);
    });

    it('fails to return a token if passed the wrong shortcode', async () => {
      const userData = {
        email: 'user2@gmail.com',
        token: '12345',
      };
      await models.User.create(userData);
      const res = await graphqlQuery(signinQuery, { user: { ...userData, token: '11111' } });
      expect(res.errors[0].message).toEqual('Invalid short code');
    });

    it('returns a long lived token when passed the right shortcode', async () => {
      const userData = {
        email: 'user3@gmail.com',
        token: '12345',
      };
      await models.User.create(userData);
      const res = await graphqlQuery(signinQuery, { user: userData });
      expect(res.errors).toBeUndefined();
      expect(res.data.signin.token.length).toBeGreaterThan(100);
      const user = await models.User.findByEmail(userData.email);
      expect(user.token).toEqual(res.data.signin.token);
    });
  });
});
