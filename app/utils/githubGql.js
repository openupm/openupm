/**
 * GitHub GraphQL API
 */
const config = require("config");
const { GraphQLClient } = require("graphql-request");

const createGqlClient = function() {
  const client = new GraphQLClient(config.github.graphqlEndpoint, {
    timeout: config.github.timeout,
    headers: {
      authorization: "Bearer " + config.github.token,
    },
  });
  return client;
};

let gitFileContentGql = `
  query RepoInfo($owner: String!, $name: String!, $tree: String!) {
    repository(owner: $owner, name: $name) {
      tree: object(expression: $tree) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

module.exports = {
  createGqlClient,
  gitFileContentGql,
};
