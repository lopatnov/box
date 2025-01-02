const sass = require("sass");
const fs = require("fs");
const path = require("path");

const compileFilePath = "box-dist.scss";
const outputFilePath = "dist/box.css";

console.info(`Compiling ${compileFilePath}...`);
const result = sass.compile(compileFilePath);
console.info("File compiled successfully");

console.info(`Writing to ${outputFilePath}...`);
const dirpath = path.dirname(outputFilePath);
cleanDirIfExists(dirpath);
createDirPathIfNotExist(dirpath);
writeToFile(outputFilePath, result.css);
console.info("Done");

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
