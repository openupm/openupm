/**
 * GitHub GraphQL API
 */
const config = require("config");
const { GraphQLClient } = require("graphql-request");

const createGqlClient = function() {
  const client = new GraphQLClient(config.gitHub.endpoint, {
    timeout: config.gitHub.timeout,
    headers: {
      authorization: "Bearer " + config.gitHub.token
    }
  });
  return client;
};

const openGraphImageUrlGql = `
  query RepoInfo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      usesCustomOpenGraphImage,
      openGraphImageUrl
    }
  }
`;

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
  openGraphImageUrlGql,
  gitFileContentGql
};
