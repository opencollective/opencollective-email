import { omit } from 'lodash';

import { GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt } from 'graphql';

import { NodeInterfaceType, UserType, GroupType, PostType, NodeType, MemberType, ActivityType } from './types';

import { PostInputType, UserInputType, GroupInputType, MemberInputType } from './inputTypes';
import models from '../models';

const mutations = {
  signin: {
    type: UserType,
    args: {
      user: { type: new GraphQLNonNull(UserInputType) },
    },
    async resolve(_, args, req) {
      req.remoteUser = await models.User.signin(args.user);
      return req.remoteUser;
    },
  },
  createGroup: {
    type: GroupType,
    args: {
      group: { type: new GraphQLNonNull(GroupInputType) },
    },
    resolve(_, args, req) {
      console.log('>>> createGroup', args.group);
      return models.Group.create(args.group);
    },
  },
  createPost: {
    type: PostType,
    args: {
      post: { type: new GraphQLNonNull(PostInputType) },
    },
    resolve(_, args, req) {
      return models.Post.create(args.post);
    },
  },
};

export default mutations;
