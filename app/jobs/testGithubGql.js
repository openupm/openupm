/**
 * Test GQL
 **/

const { createGqlClient, gitFileContentGql } = require("../utils/githubGql");

const testGql = async function() {
  console.log("testGql");
  try {
    const data = await createGqlClient().request(gitFileContentGql, {
      owner: "favoyang",
      name: "unity-addressable-importer",
      tree: "master:README.md"
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

if (require.main === module) {
  let program = require("../utils/commander");
  program.parse(process.argv).run(async function() {
    await testGql();
  });
}
