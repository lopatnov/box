const sass = require("sass");
const fs = require("fs");
const path = require("path");

const compileFilePath = "box-dist.scss";
const outputFilePath = "dist/box.css";
const isCompressed = process.argv.includes("--compressed");

recompile();

if (process.argv.includes("--watch")) {
  console.info("Watching for changes...");
  fs.watchFile(compileFilePath, recompile);
}

function recompile() {
  console.info(`Compiling ${compileFilePath}...`);
  const boxDist = sass.compile(compileFilePath, {
    verbose: true,
    style: isCompressed ? "compressed" : "expanded",
  });
  console.info("File compiled successfully");

  console.info(`Writing to ${outputFilePath}...`);
  const dirpath = path.dirname(outputFilePath);
  cleanDirIfExists(dirpath);
  createDirPathIfNotExist(dirpath);
  writeToFile(outputFilePath, boxDist.css);
  console.info("File written successfully");

  console.info(`Copy fonts to dist...`);
  copyFolder("./fonts", "./dist/fonts");
  console.info("Fonts copied successfully");

  console.info(`Copy SCSS files to dist...`);
  copyFile("./package.npm.json", "./dist/package.json");
  copyFile("./README.md", "./dist/README.md");
  copyFile("./box.scss", "./dist/box.scss");
  copyFolder("./reset", "./dist/reset");
  copyFolder("./typography", "./dist/typography");
  copyFolder("./themes", "./dist/themes");
  copyFolder("./elements", "./dist/elements");
  copyFolder("./layouts", "./dist/layouts");
  console.info("SCSS files copied successfully");
}

function writeToFile(filePath, data) {
  fs.writeFileSync(filePath, data, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.info("File written successfully");
    }
  });
}

function cleanDirIfExists(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        cleanDirIfExists(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

function createDirPathIfNotExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFolder(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source folder ${src} does not exist`);
    return;
  }
  createDirPathIfNotExist(dest);
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source file ${src} does not exist`);
    return;
  }
  createDirPathIfNotExist(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.info(`File copied from ${src} to ${dest}`);
}
