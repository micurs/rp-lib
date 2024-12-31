import * as path from 'jsr:@std/path';
import * as semver from '@std/semver';

type DenoJson = {
  version: string;
};

type UpdateType = 'patch' | 'minor' | 'major' | 'none';

const fileExists = async (path: string) => {
  try {
    await Deno.lstat(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * Update deno.json and package.json files with new version if greater then
 * the one in the files.
 * @param newVersion - New version to update to (as SemVer)
 * @param dstPath - Path to the project directory
 */
const updateVersion = async (newVersion: semver.SemVer, dstPath: string) => {
  const denoFile = path.join(dstPath, 'deno.json');
  const prjFile = path.join(dstPath, 'package.json');
  const newSemver = semver.format(newVersion);

  const denoJson = JSON.parse(await Deno.readTextFile(denoFile)) as DenoJson;
  const denoSemver = semver.parse(denoJson.version);

  if (semver.greaterThan(newVersion, denoSemver)) {
    denoJson.version = newSemver;
    await Deno.writeTextFile(denoFile, JSON.stringify(denoJson, null, 2));
    console.log(`✅ ${denoFile}`, '>', newSemver);
  }

  // Skip if no package.json file does not exist
  if (await fileExists(prjFile)) {
    const prjJson = JSON.parse(await Deno.readTextFile(prjFile)) as DenoJson;
    const prjSemver = semver.parse(prjJson.version);
    if (semver.greaterThan(newVersion, prjSemver)) {
      prjJson.version = newSemver;
      await Deno.writeTextFile(prjFile, JSON.stringify(prjJson, null, 2));
      console.log(`✅ ${prjFile}`, '>', newSemver);
    }
  }
};

const main = async (update: UpdateType) => {
  const mainDeno = JSON.parse(await Deno.readTextFile('./deno.json')) as unknown as DenoJson;

  const newVersion = semver.parse(mainDeno.version);
  switch (update) {
    case 'major':
      newVersion.major++;
      newVersion.minor = 0;
      newVersion.patch = 0;
      break;
    case 'minor':
      newVersion.minor++;
      newVersion.patch = 0;
      break;
    case 'patch':
      newVersion.patch++;
      break;
    case 'none':
    default:
      break;
  }
  console.log('Updating Version to:', semver.format(newVersion));

  await updateVersion(newVersion, '.');
  await updateVersion(newVersion, './lib');
  await updateVersion(newVersion, './react-lib');
};

const update = Deno.args[0] ?? 'none' as UpdateType;

await main(update);
Deno.exit(0);
