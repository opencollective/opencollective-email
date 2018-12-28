import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from "graphql";

import {
  NodeInterfaceType,
  UserType,
  GroupType,
  PostType,
  NodeType,
  MemberType,
  ActivityType
} from "./types";

import models, { sequelize, Op } from "../models";

const queries = {
  /*
   * Given a GroupSlug, returns all Posts
   */
  allPosts: {
    type: new GraphQLList(NodeInterfaceType),
    args: {
      GroupSlug: { type: new GraphQLNonNull(GraphQLString) },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt }
    },
    async resolve(_, args) {
      const query = { where: {} };
      const groupId = await models.Group.findOne({
        attributes: ["id"],
        where: { slug: args.GroupSlug.toLowerCase() }
      });
      if (!groupId) {
        throw new Error("Group not found");
      }
      query.where.GroupId = group.id;
      if (args.limit) query.limit = args.limit;
      if (args.offset) query.offset = args.offset;
      query.order = [["createdAt", "DESC"]];
      return models.Post.findAll(query);
    }
  },

  Post: {
    type: PostType,
    args: {
      PostId: {
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve: async (_, args) => {
      const post = await models.Post.findOne({
        where: { PostId: args.PostId }
      });
      return post;
    }
  }
};

export default queries;
