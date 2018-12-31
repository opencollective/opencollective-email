import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';

import models, { Op } from '../models';
import { get, has, sortBy } from 'lodash';

export const NodeListType = new GraphQLObjectType({
  name: 'NodeListType',
  description: 'A result set',
  fields: () => ({
    nodes: {
      type: new GraphQLList(NodeInterfaceType),
    },
    type: {
      type: GraphQLString,
    },
    limit: {
      type: GraphQLInt,
    },
    offset: {
      type: GraphQLInt,
    },
    total: {
      type: GraphQLInt,
    },
  }),
});

export const NodeInterfaceType = new GraphQLInterfaceType({
  name: 'NodeInterface',
  description: 'Node interface used by NodeList so that we can always return a Node',
  resolveType: node => {
    switch (node.constructor.name) {
      case 'Post':
        return PostType;

      case 'Activity':
        return ActivityType;

      case 'Group':
        return GroupType;

      case 'User':
        return UserType;

      case 'Member':
        return MemberType;

      default:
        return null;
    }
  },
  fields: () => {
    return {
      id: { type: GraphQLInt },
    };
  },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  interfaces: [NodeInterfaceType],
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(post) {
          return post.id;
        },
      },
      firstName: {
        type: GraphQLString,
        resolve(user) {
          return user.firstName;
        },
      },
      lastName: {
        type: GraphQLString,
        resolve(user) {
          return user.lastName;
        },
      },
      name: {
        type: GraphQLString,
        resolve(user) {
          return user.name;
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve(user) {
          return user.createdAt;
        },
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return null; // Need to check permission to read email
        },
      },
      token: {
        type: GraphQLString,
        resolve(user, args, req) {
          if (get(req, 'remoteUser.id') === user.id) {
            return user.token;
          }
        },
      },
      description: {
        type: GraphQLString,
        resolve(user) {
          return user.description;
        },
      },
      image: {
        type: GraphQLString,
        resolve(user) {
          return user.image;
        },
      },
      website: {
        type: GraphQLString,
        resolve(user) {
          return user.website;
        },
      },
      twitter: {
        type: GraphQLString,
        resolve(user) {
          return user.twitter;
        },
      },
      facebook: {
        type: GraphQLString,
        resolve(user) {
          return user.facebook;
        },
      },
      gender: {
        type: GraphQLString,
        resolve(user) {
          return user.gender;
        },
      },
      zipcode: {
        type: GraphQLString,
        resolve(user) {
          return user.zipcode;
        },
      },
      country: {
        type: GraphQLString,
        resolve(user) {
          return user.country;
        },
      },
      preferredLanguage: {
        type: GraphQLString,
        description: 'preferred language',
        resolve(user) {
          return user.preferredLanguage;
        },
      },
      languages: {
        type: new GraphQLList(GraphQLString),
        description: 'list of languages that the user can understand',
        resolve(user) {
          return user.languages;
        },
      },
      memberships: {
        type: NodeListType,
        async resolve(user, args) {
          const query = {
            where: { UserId: user.id },
            order: [['id', 'DESC']],
            limit: args.limit,
            offset: args.offset,
          };
          const { count, rows } = await models.Member.findAndCountAll(query);
          return {
            total: count,
            nodes: rows,
            type: 'Member',
            limit: args.limit,
            offset: args.offset,
          };
        },
      },
      posts: {
        type: NodeListType,
        async resolve(user, args) {
          const query = {
            where: { UserId: user.id },
            order: [['id', 'DESC']],
            limit: args.limit,
            offset: args.offset,
          };
          const { count, rows } = await models.Post.findAndCountAll(query);
          return {
            total: count,
            nodes: rows,
            type: 'Post',
            limit: args.limit,
            offset: args.offset,
          };
        },
      },
    };
  },
});
export const MemberType = new GraphQLObjectType({
  name: 'Member',
  description: 'This represents a Membership',
  interfaces: [NodeInterfaceType],
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(member) {
          return member.id;
        },
      },
      user: {
        type: UserType,
        resolve(member) {
          return models.User.findById(member.UserId);
        },
      },
      group: {
        type: GroupType,
        resolve(member) {
          return models.Group.findById(member.GroupId);
        },
      },
      description: {
        type: GraphQLString,
        resolve(member) {
          return member.description;
        },
      },
      role: {
        type: GraphQLString,
        resolve(member) {
          return member.role;
        },
      },
    };
  },
});

export const GroupType = new GraphQLObjectType({
  name: 'Group',
  description: 'This represents a Working Group',
  interfaces: [NodeInterfaceType],
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(group) {
          return group.id;
        },
      },
      GroupId: {
        type: GraphQLInt,
        resolve(group) {
          return group.GroupId;
        },
      },
      user: {
        type: MemberType,
        resolve(group, args, req) {
          return models.User.findById(group.UserId);
        },
      },
      posts: {
        type: NodeListType,
        async resolve(group, args) {
          return group.getPosts(args);
        },
      },
      version: {
        type: GraphQLString,
        resolve(group) {
          return group.version;
        },
      },
      versions: {
        type: NodeListType,
        async resolve(group, args) {
          const query = {
            where: { GroupId: group.id },
            order: [['id', 'DESC']],
            limit: args.limit,
            offset: args.offset,
          };
          const { count, rows } = await models.Group.findAndCountAll(query);
          return {
            total: count,
            nodes: rows,
            type: 'Group',
            limit: args.limit,
            offset: args.offset,
          };
        },
      },
      slug: {
        type: GraphQLString,
        resolve(group) {
          return group.slug;
        },
      },
      name: {
        type: GraphQLString,
        resolve(group) {
          return group.name;
        },
      },
      description: {
        type: GraphQLString,
        resolve(group) {
          return group.description;
        },
      },
      color: {
        type: GraphQLString,
        resolve(group) {
          return group.color;
        },
      },
    };
  },
});

export const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'This represents a Post',
  interfaces: [NodeInterfaceType],
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(post) {
          return post.id;
        },
      },
      PostId: {
        type: GraphQLInt,
        resolve(post) {
          return post.PostId;
        },
      },
      user: {
        type: UserType,
        resolve(post, args, req) {
          return models.User.findById(post.UserId);
        },
      },
      group: {
        type: GroupType,
        resolve(post, args, req) {
          return models.Group.findById(post.GroupId);
        },
      },
      parent: {
        type: PostType,
        resolve(post) {
          return models.Post.findById(post.ParentPostId);
        },
      },
      version: {
        type: GraphQLString,
        resolve(post) {
          return post.version;
        },
      },
      versions: {
        type: NodeListType,
        async resolve(post, args) {
          const query = {
            where: { PostId: post.id },
            order: [['id', 'DESC']],
            limit: args.limit,
            offset: args.offset,
          };
          const { count, rows } = await models.Post.findAndCountAll(query);
          return {
            total: count,
            nodes: rows,
            type: 'Post',
            limit: args.limit,
            offset: args.offset,
          };
        },
      },
      replies: {
        type: NodeListType,
        async resolve(post, args) {
          const query = {
            where: { ParentPostId: post.PostId },
            order: [['id', 'ASC']],
            limit: args.limit,
            offset: args.offset,
          };
          const { count, rows } = await models.Post.findAndCountAll(query);
          return {
            total: count,
            nodes: rows,
            type: 'Post',
            limit: args.limit,
            offset: args.offset,
          };
        },
      },
      slug: {
        type: GraphQLString,
        resolve(post) {
          return post.slug;
        },
      },
      title: {
        type: GraphQLString,
        resolve(post) {
          return post.title;
        },
      },
      text: {
        type: GraphQLString,
        resolve(post) {
          return post.text;
        },
      },
      html: {
        type: GraphQLString,
        resolve(post) {
          return post.html;
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve(post) {
          return new Date(post.createdAt);
        },
      },
    };
  },
});

export const ActivityType = new GraphQLObjectType({
  name: 'Activity',
  description: 'This represents an Activity',
  interfaces: [NodeInterfaceType],
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(activity) {
          return activity.id;
        },
      },
      group: {
        type: GroupType,
        resolve(activity) {
          return models.Group.findById(activity.GroupId);
        },
      },
      post: {
        type: PostType,
        resolve(activity, args, req) {
          return models.Post.findById(activity.PostId);
        },
      },
      user: {
        type: UserType,
        resolve(activity, args, req) {
          return models.User.findById(activity.UserId);
        },
      },
      action: {
        type: GraphQLString,
        resolve(activity) {
          return activity.action;
        },
      },
    };
  },
});
