// Update package release

const Release = require("../models/release");
const { ReleaseState } = require("../common/constant");
const logger = require("../utils/log")(module);

// Update a supported release field for the given packageName and version.
const updateRelease = async function(packageName, version, field, value) {
  const release = await Release.fetchOneOrThrow(packageName, version);

  if (field !== "state") throw new Error(`unsupported release field: ${field}`);
  if (!/^-?\d+$/.test(value))
    throw new Error(`invalid state value: ${value}`);

  const nextState = Number.parseInt(value, 10);
  const validStates = ReleaseState.enums.map(item => item.value);
  if (!validStates.includes(nextState))
    throw new Error(`unsupported state value: ${value}`);

  release.state = nextState;
  await Release.save(release);
  logger.info(
    {
      rel: `${packageName}@${version}`,
      pkg: packageName,
      field,
      value: release.state,
    },
    "updated release record"
  );
};

module.exports = { updateRelease };

if (require.main === module) {
  const program = require("../utils/commander");
  let packageNameVal = null;
  let versionVal = null;
  let fieldVal = null;
  let valueVal = null;
  program
    .arguments("<packageName> <version> [field] [value]")
    .action(function(packageName, version, field, value) {
      packageNameVal = packageName;
      versionVal = version;
      fieldVal = field;
      valueVal = value;
    })
    .parse(process.argv)
    .requiredArgs(2)
    .run(async function() {
      if (fieldVal && valueVal)
        await updateRelease(packageNameVal, versionVal, fieldVal, valueVal);
      else {
        program.outputHelp();
        process.exit(1);
      }
    });
}
