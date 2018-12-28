import { GraphQLObjectType, GraphQLSchema } from "graphql";

import {
  TopicType,
  GroupType,
  UserType,
  MemberType,
  ActivityType
} from "./types";

import query from "./queries";
import mutation from "./mutations";

const Query = new GraphQLObjectType({
  name: "Query",
  description: "This is a root query",
  fields: () => {
    return query;
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "This is the root mutation",
  fields: () => {
    return mutation;
  }
});

const Schema = new GraphQLSchema({
  types: [TopicType, UserType, GroupType, ActivityType, MemberType],
  query: Query,
  mutation: Mutation
});

export default Schema;
