// Update package release

const Release = require("../models/release");
const { ReleaseState, ReleaseReason } = require("../common/constant");
const logger = require("../utils/log")(module);

const validStates = ReleaseState.enums.map(item => item.value);
const validReasons = ReleaseReason.enums.map(item => item.value);

// Update a supported release field for the given packageName and version.
const updateRelease = async function(packageName, version, field, value) {
  const release = await Release.fetchOneOrThrow(packageName, version);

  if (!["state", "reason"].includes(field))
    throw new Error(`unsupported release field: ${field}`);

  if (!/^-?\d+$/.test(value))
    throw new Error(`invalid ${field} value: ${value}`);

  const nextValue = Number.parseInt(value, 10);

  if (field === "state") {
    if (!validStates.includes(nextValue))
      throw new Error(`unsupported state value: ${value}`);
    release.state = nextValue;
  } else {
    if (!validReasons.includes(nextValue))
      throw new Error(`unsupported reason value: ${value}`);
    release.reason = nextValue;
  }

  await Release.save(release);
  logger.info(
    {
      rel: `${packageName}@${version}`,
      pkg: packageName,
      field,
      value: release[field],
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
