import {
  GraphQLScalarType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull
} from "graphql";

const EmailType = new GraphQLScalarType({
  name: "Email",
  serialize: value => {
    return value;
  },
  parseValue: value => {
    return value;
  },
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Query error: Can only parse strings got a: ${ast.kind}`
      );
    }

    // Regex taken from: http://stackoverflow.com/a/46181/761555
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!re.test(ast.value)) {
      throw new GraphQLError(`Query error: Not a valid Email ${[ast]}`);
    }

    return ast.value;
  }
});

export const UserInputType = new GraphQLInputObjectType({
  name: "UserInputType",
  description: "Input type for User",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: new GraphQLNonNull(EmailType) },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    twitter: { type: GraphQLString },
    facebook: { type: GraphQLString },
    website: { type: GraphQLString },
    zipcode: { type: GraphQLString },
    country: { type: GraphQLString },
    gender: { type: GraphQLString },
    token: { type: GraphQLString },
    preferredLanguage: { type: GraphQLString },
    languages: { type: new GraphQLList(GraphQLString) }
  })
});

export const GroupInputType = new GraphQLInputObjectType({
  name: "GroupInputType",
  description: "Input type for Group",
  fields: () => ({
    UserId: { type: GraphQLInt },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    color: { type: GraphQLString }
  })
});

export const PostInputType = new GraphQLInputObjectType({
  name: "PostInputType",
  description: "Input type for Post",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    color: { type: GraphQLString }
  })
});
