// This file is mostly adapted from:
// https://github.com/zeit/next.js/blob/3949c82bdfe268f841178979800aa8e71bbf412c/examples/with-apollo/lib/initApollo.js

import fetch from 'cross-fetch';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

let apolloClient = null;
const graphqlUrl = publicRuntimeConfig.GRAPHQL_URL || 'http://localhost:3000/graphql/v1';
console.log('> Connection to graphql server on', graphqlUrl);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: 'Transaction',
          possibleTypes: [{ name: 'Expense' }, { name: 'Donation' }],
        },
      ],
    },
  },
});

function createClient(initialState) {
  const authLink = setContext((_, { headers }) => {
    const token = process.browser && window.localStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const cache = new InMemoryCache({
    dataIdFromObject: result =>
      `${result.__typename}:${result.id || result.name || result.slug || Math.floor(Math.random() * 1000000)}`,
    fragmentMatcher,
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(error => {
        if (error) {
          const { message, locations, path } = error;
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          return;
        }

        console.error('[GraphQL error]: Received null error');
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  const httpLink = new HttpLink({
    uri: graphqlUrl,
    fetch,
  });

  const link = ApolloLink.from([errorLink, authLink.concat(httpLink)]);

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    cache: cache.restore(initialState),
    link,
  });
}

export default function initClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createClient(initialState);
  }

  return apolloClient;
}
