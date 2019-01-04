import { publishEmail } from '../api';
import { createJwt } from '../../lib/auth';
import { db } from '../../lib/test';
import models from '../../models';

import nock from 'nock';
import './api.nock';

if (process.env.RECORD) {
  nock.recorder.rec();
}

describe('controllers.api', () => {
  beforeAll(db.reset);
  afterAll(db.close);
  it('fails if token has expired', async () => {
    const req = {
      query: {
        groupSlug: 'testgroup',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlSWQiOiJleUp3SWpwbVlXeHpaU3dpYXlJNklqYzJZakk0TVRKa0xUbGxOVFl0TkdGbE15MDVPREkzTFdJMFpEWXhaRGxoTjJRd1ppSXNJbk1pT2lJMllqVmpOMlF6WXprMklpd2lZeUk2SW5SaGJtdGlJbjA9IiwibWFpbFNlcnZlciI6InNlIiwiaWF0IjoxNTQ1ODk4Nzg2LCJleHAiOjE1NDU5MDIzODYsInN1YiI6ImVtYWlsQ29uZmlybWF0aW9uIn0.tJYkdkuDLnO4fIKc6Pa5kH92I-01wBeorGnBLhR-fq8',
      },
    };
    const res = {
      send: response => {},
    };
    try {
      await publishEmail(req, res);
    } catch (e) {
      expect(e.message).toEqual('The token has expired. Please resend your email to testgroup@citizenspring.be');
    }
  });

  it('publish first email in a new group', async () => {
    const tokenData = {
      messageId:
        'eyJwIjpmYWxzZSwiayI6Ijg0NWQ3Y2ZmLWRiZDgtNGIwYS1iNTZhLWUzNmZmYzNhN2E3NSIsInMiOiI1YTY3MmZjMDkxIiwiYyI6InRhbmtiIn0=',
      mailServer: 'sw',
    };
    const token = createJwt('emailConfirmation', tokenData, '1h');
    const req = {
      query: { groupSlug: 'testgroup', token },
    };
    const res = {
      redirect: path => {
        expect(path).toMatch(/^\/testgroup\/[0-9]+/);
      },
    };
    try {
      await publishEmail(req, res);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual('');
    }
    const user = await models.User.findOne();
    const post = await models.Post.findOne();
    expect(post.PostId).toEqual(1);
    expect(post.UserId).toEqual(user.id);
    const group = await models.Group.findOne();
    expect(group.slug).toEqual('testgroup');
    expect(group.UserId).toEqual(user.id);
    const activities = await models.Activity.findAll();
    expect(activities.length).toEqual(2);
  });
});
