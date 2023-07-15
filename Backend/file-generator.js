const fs = require("fs");
const path = require("path");
const shortID = require('shortid');

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async function(language, code){
  const jobId = shortID();
  const filename = `${jobId}.${language}`;
  const filepath = path.join(dirCodes, filename);
  await fs.writeFileSync(filepath, code);
  return filepath;
};

module.exports = {
  generateFile,
};