import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { UserInputError } from 'apollo-server-express';

import { typeDefs, resolvers } from './root';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function startApolloServer(app: any): Promise<void> {
  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      const errorMessage = (error.extensions?.message as string) || error.message;

      // Si es un error de validación, mantenemos el mensaje detallado
      if (error.originalError instanceof UserInputError) {
        return {
          message: errorMessage,
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: error.extensions?.invalidArgs || [],
          },
        };
      }

      // Para otros tipos de errores, damos un mensaje más genérico
      const isUserError = error.extensions?.code === 'BAD_USER_INPUT';
      return {
        message: isUserError ? errorMessage : 'Ha ocurrido un error interno.',
        extensions: {
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        },
      };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}

export { startApolloServer };
