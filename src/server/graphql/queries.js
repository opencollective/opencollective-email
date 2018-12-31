import { GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';

import { NodeListType, UserType, GroupType, PostType, NodeType, MemberType, ActivityType } from './types';

import models, { sequelize, Op } from '../models';

const getIdFromSlug = async function(table, slug) {
  const item = await models[table].findOne({ attributes: ['id'], where: { slug } });
  if (!item) throw Error(`Cannot find ${table} with slug ${slug}`);
  return item.id;
};

const queries = {
  /*
   * Given a GroupSlug, returns all Posts
   */
  allPosts: {
    type: NodeListType,
    args: {
      groupSlug: { type: new GraphQLNonNull(GraphQLString) },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
    async resolve(_, args) {
      const query = { where: {} };
      const GroupId = await getIdFromSlug('Group', args.groupSlug);
      query.where.GroupId = GroupId;
      query.limit = args.limit || 20;
      query.offset = args.offset || 0;
      query.order = [['createdAt', 'DESC']];
      query.logging = console.log;
      console.log('>>> allPost for', args.groupSlug, query);
      const { count, rows } = await models.Post.findAndCountAll(query);
      const res = {
        total: count,
        nodes: rows,
        limit: query.limit,
        offset: query.offset,
      };
      console.log(res.nodes.map(n => n.dataValues));
      return res;
    },
  },

  Post: {
    type: PostType,
    args: {
      PostId: { type: GraphQLInt },
      postSlug: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const PostId = args.PostId || (await getIdFromSlug('Post', args.postSlug));
      const post = await models.Post.findOne({
        where: { PostId: PostId },
      });
      return post;
    },
  },

  Group: {
    type: GroupType,
    args: {
      groupSlug: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (_, args) => {
      return await models.Group.findBySlug(args.groupSlug);
    },
  },
};

export default queries;
