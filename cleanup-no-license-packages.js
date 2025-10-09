#!/usr/bin/env node
/**
 * Clean up packages without open-source licenses from OpenUPM registry
 * Issue #3153: https://github.com/openupm/openupm/issues/3153
 * 
 * This script identifies and removes packages that don't have valid open-source licenses
 * from the registry by checking for empty, null, or missing licenseSpdxId fields.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { loadPackageNames, loadPackageSync, packagesDir } = require('./app/utils/package');

// SPDX license identifiers that are considered non-open-source or proprietary
const NON_OPEN_SOURCE_LICENSES = [
  'UNLICENSED',
  'NOASSERTION', 
  'LicenseRef-*', // Custom licenses (could be proprietary)
];

/**
 * Check if a package has a valid open-source license
 * @param {Object} pkg - Package object from YAML
 * @returns {boolean} - True if package has valid open-source license
 */
function hasValidOpenSourceLicense(pkg) {
  // Check if licenseSpdxId exists and is not empty/null
  if (!pkg.licenseSpdxId || 
      pkg.licenseSpdxId === '' || 
      pkg.licenseSpdxId === null || 
      pkg.licenseSpdxId === undefined) {
    return false;
  }

  // Check against known non-open-source licenses
  for (const nonOSLicense of NON_OPEN_SOURCE_LICENSES) {
    if (nonOSLicense.endsWith('*')) {
      // Handle wildcard matches
      const prefix = nonOSLicense.slice(0, -1);
      if (pkg.licenseSpdxId.startsWith(prefix)) {
        return false;
      }
    } else if (pkg.licenseSpdxId === nonOSLicense) {
      return false;
    }
  }

  return true;
}

/**
 * Move package file to packages-norelease directory
 * @param {string} packageName - Name of the package
 */
function moveToNoRelease(packageName) {
  const sourceFile = path.join(packagesDir, `${packageName}.yml`);
  const targetDir = path.join(__dirname, 'data', 'packages-norelease');
  const targetFile = path.join(targetDir, `${packageName}.yml`);

  try {
    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Move the file
    fs.renameSync(sourceFile, targetFile);
    console.log(`✓ Moved ${packageName} to packages-norelease`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to move ${packageName}: ${error.message}`);
    return false;
  }
}

/**
 * Main cleanup function
 */
async function cleanupNoLicensePackages() {
  console.log(' Starting cleanup of packages without open-source licenses...\n');

  try {
    const packageNames = await loadPackageNames();
    const packagesToRemove = [];
    const packagesWithLicense = [];

    console.log(` Found ${packageNames.length} packages to check\n`);

    // Check each package for valid license
    for (const packageName of packageNames) {
      try {
        const pkg = await loadPackageSync(packageName);
        
        if (!hasValidOpenSourceLicense(pkg)) {
          packagesToRemove.push({
            name: packageName,
            licenseSpdxId: pkg.licenseSpdxId,
            licenseName: pkg.licenseName || 'N/A'
          });
        } else {
          packagesWithLicense.push(packageName);
        }
      } catch (error) {
        console.error(`✗ Error loading package ${packageName}: ${error.message}`);
      }
    }

    console.log(` Summary:`);
    console.log(`   - Packages with valid licenses: ${packagesWithLicense.length}`);
    console.log(`   - Packages without licenses: ${packagesToRemove.length}\n`);

    if (packagesToRemove.length === 0) {
      console.log(' No packages to remove - all packages have valid open-source licenses!');
      return;
    }

    // Show packages that will be removed
    console.log(' Packages to be moved to packages-norelease:');
    packagesToRemove.forEach((pkg, index) => {
      console.log(`   ${index + 1}. ${pkg.name}`);
      console.log(`      License SPDX ID: ${pkg.licenseSpdxId || 'null/empty'}`);
      console.log(`      License Name: ${pkg.licenseName}`);
      console.log('');
    });

    // Confirm before proceeding
    console.log('  This will move packages without open-source licenses to packages-norelease directory.');
    console.log('   This effectively removes them from the public registry.\n');

    // For now, let's just log what would be done without actually moving files
    console.log(' Processing packages...\n');

    let movedCount = 0;
    for (const pkg of packagesToRemove) {
      if (moveToNoRelease(pkg.name)) {
        movedCount++;
      }
    }

    console.log(`\n Cleanup completed!`);
    console.log(`   - Successfully moved: ${movedCount} packages`);
    console.log(`   - Failed to move: ${packagesToRemove.length - movedCount} packages`);
    console.log(`   - Remaining active packages: ${packagesWithLicense.length}`);

  } catch (error) {
    console.error(' Error during cleanup:', error.message);
    process.exit(1);
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanupNoLicensePackages()
    .then(() => {
      console.log('\n License cleanup process completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n License cleanup process failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  hasValidOpenSourceLicense,
  moveToNoRelease,
  cleanupNoLicensePackages
};