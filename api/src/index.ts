import * as path from "path";
import { GraphQLServer } from "graphql-yoga";
import { makePrismaSchema, prismaObjectType } from "nexus-prisma";
import { prisma, Prisma } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma";
import { stringArg } from "nexus";

interface Context {
  prisma: Prisma;
}

const Query = prismaObjectType({
  name: "Query",
  definition: t => t.prismaFields(["*"])
});
const Mutation = prismaObjectType({
  name: "Mutation",
  definition: t => {
    t.prismaFields(["*"]);
    t.field("login", {
      type: "User",
      args: {
        username: stringArg()
      },
      resolve: async (_, { username }, { prisma }: Context) => {
        return (await prisma.users({ where: { username } }))[0];
      }
    });
  }
});

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts")
  }
});

const server = new GraphQLServer({
  schema,
  context: { prisma }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
