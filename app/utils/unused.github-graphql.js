const config = require("config");
const { GraphQLClient } = require("graphql-request");

let createGraphQLClient = function() {
  let client = new GraphQLClient(config.gitHub.endpoint, {
    timeout: config.gitHub.timeout,
    headers: {
      authorization: "Bearer " + config.gitHub.token
    }
  });
  return client;
};

let repoInfo = `
query RepoInfo($owner: String!, $name: String!, $tree: String!) {
  repository(owner: $owner, name: $name) {
    url
    name
    nameWithOwner
    owner {
      avatarUrl
    }
    description
    isFork
    isArchived
    stargazers {
      totalCount
    }
    createdAt
    pushedAt
    usesCustomOpenGraphImage
    openGraphImageUrl
    licenseInfo {
      key
      name
    }
    tree:object(expression: $tree) {
      ... on Tree {
        entries {
          name
        }
      }
    }
    tags:refs(first: 20, refPrefix: "refs/tags/", orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
      nodes {
        name
      }
    }
  }
}
`;

let gitFileContent = `
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

let gitTree = `
query RepoInfo($owner: String!, $name: String!, $tree: String!) {
  repository(owner: $owner, name: $name) {
    tree: object(expression: $tree) {
      ... on Tree{
        entries{
          name
          object {
            ... on Tree {
              entries {
                name
              }
            }
          }
        }
      }
    }
  }
}
`;

module.exports = {
  createGraphQLClient,
  repoInfo,
  gitFileContent,
  gitTree
};
