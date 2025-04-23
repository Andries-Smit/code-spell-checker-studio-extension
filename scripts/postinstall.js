import fs from "fs";
import path from "path";

const languages = [
  { module: "dictionary-en", destination: "en_US" },
  { module: "dictionary-en-gb", destination: "en_GB" },
  { module: "dictionary-nl", destination: "nl_NL" },
];

languages.forEach(({ module, destination }) => {
  const modulePath = path.join("./node_modules", module);
  const destDir = path.join("./public/dictionaries", destination);

  const srcAff = path.join(modulePath, "index.aff");
  const srcDic = path.join(modulePath, "index.dic");

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    fs.copyFileSync(srcAff, path.join(destDir, "index.aff"));
    fs.copyFileSync(srcDic, path.join(destDir, "index.dic"));
    console.log(`✔ Copied ${module} → ${destination}`);
  } catch (err) {
    console.error(`✖ Failed to copy from ${module}: ${err.message}`);
  }
});
