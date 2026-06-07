import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import QRCode from "qrcode";

const repoUrl = process.argv[2] ?? "https://github.com/BlacktorDied/storyforge";
const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDir = path.join(rootDir, "public", "qr");

const baseQrOptions = {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1024,
};

const qrVariants = [
  {
    name: "light",
    color: {
      dark: "#111827",
      light: "#ffffff",
    },
  },
  {
    name: "dark",
    color: {
      dark: "#ffffff",
      light: "#111827",
    },
  },
];

await mkdir(outputDir, { recursive: true });

const outputFiles = qrVariants.flatMap(({ name, color }) => [
  {
    fileName: `storyforge-github-qr-${name}.png`,
    options: {
      ...baseQrOptions,
      color,
      type: "png",
    },
  },
  {
    fileName: `storyforge-github-qr-${name}.svg`,
    options: {
      ...baseQrOptions,
      color,
      type: "svg",
    },
  },
]);

await Promise.all(
  outputFiles.map(({ fileName, options }) =>
    QRCode.toFile(path.join(outputDir, fileName), repoUrl, options),
  ),
);

console.log(`Generated GitHub QR codes for ${repoUrl}`);
for (const { fileName } of outputFiles) {
  console.log(`Wrote public/qr/${fileName}`);
}
