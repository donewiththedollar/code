const sharpLinuxX64Assets = require('../assets/sharpLinuxX64.ts').default;
const sharpLinuxMuslX64Assets = require('../assets/sharpLinuxMuslX64.ts').default;
const { materializeEmbeddedAssetGroup } = require('../nativeAssetRuntime.ts');

function isMuslHost() {
  const report = process.report?.getReport?.();
  const glibcVersionRuntime = report?.header?.glibcVersionRuntime;
  return process.platform === 'linux' && !glibcVersionRuntime;
}

function resolveRuntimeAssets() {
  if (process.platform !== 'linux' || process.arch !== 'x64') {
    return null;
  }
  return isMuslHost() ? sharpLinuxMuslX64Assets : sharpLinuxX64Assets;
}

let cachedBinding;

function loadBinding() {
  if (cachedBinding !== undefined) {
    return cachedBinding;
  }

  const runtimeAssets = resolveRuntimeAssets();
  if (!runtimeAssets) {
    throw new Error(
      `sharp native runtime is only packaged for linux-x64 and linux-x64-musl right now; received ${process.platform}-${process.arch}`,
    );
  }

  const materialized = materializeEmbeddedAssetGroup(
    `sharp-${runtimeAssets.slug}`,
    [
      {
        embeddedPath: runtimeAssets.addonPath,
        relativePath: runtimeAssets.addonRelativePath,
      },
      {
        embeddedPath: runtimeAssets.libvipsPath,
        relativePath: runtimeAssets.libvipsRelativePath,
      },
    ],
  );

  cachedBinding = require(materialized.paths[runtimeAssets.addonRelativePath]);
  return cachedBinding;
}

module.exports = loadBinding();
