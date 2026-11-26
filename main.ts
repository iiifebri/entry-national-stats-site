// NusaStat — entrypoint for the make.fun build.
//
// What this program does, in order:
//   1. Finds the repository root from this file's own location.
//   2. Copies app/ (and screenshots/, when it exists) into the output
//      directory named by MAKEFUN_OUTPUT_DIR, or "/output" by default.
//   3. Builds the entry dossier from the copied files and writes it
//      as dossier.json in the output directory.
//
// It uses only the Node standard library, touches no network, and
// anchors every path to this file so it works from any directory.
// Running it twice over the same repository writes byte-identical
// output: files are copied in sorted order and the dossier builder
// itself is deterministic.

import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyTree(sourceDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  const entries = readdirSync(sourceDir).sort();
  for (const name of entries) {
    const from = join(sourceDir, name);
    const to = join(targetDir, name);
    const info = lstatSync(from);
    if (info.isSymbolicLink()) {
      throw new Error(`${from}: a symbolic link (app/ holds plain files only)`);
    }
    if (info.isDirectory()) {
      copyTree(from, to);
    } else if (info.isFile()) {
      copyFileSync(from, to);
    }
  }
}

function main(): void {
  // Never let the output directory be the repository itself: the
  // cleanup below deletes app/ and screenshots/ inside the target.
  if (resolve(OUTPUT_DIR) === resolve(REPO_ROOT)) {
    throw new Error('MAKEFUN_OUTPUT_DIR must not be the repository root');
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const appSource = join(REPO_ROOT, 'app');
  if (!existsSync(appSource)) {
    throw new Error('app/: no such directory next to main.ts');
  }
  const appTarget = join(OUTPUT_DIR, 'app');
  rmSync(appTarget, { recursive: true, force: true });
  copyTree(appSource, appTarget);

  const shotsSource = join(REPO_ROOT, 'screenshots');
  const shotsTarget = join(OUTPUT_DIR, 'screenshots');
  rmSync(shotsTarget, { recursive: true, force: true });
  if (existsSync(shotsSource)) {
    copyTree(shotsSource, shotsTarget);
  }

  const dossier = buildDossier(OUTPUT_DIR, DOSSIER_CAPS);
  writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
}

main();
