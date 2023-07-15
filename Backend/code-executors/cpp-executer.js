const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = function(codeFile) {
  const codeId = path.basename(codeFile).split(".")[0];
  const outPath = path.join(outputPath, `${codeId}.out`);
  const outputDir = path.dirname(outPath);

  return new Promise(function(resolve, reject) {
    exec(
      `g++ "${codeFile}" -o "${outPath}"`,
      function(error, stdout, stderr) {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        exec(
          `"${outPath}"`,
          { cwd: outputDir },
          function(error, stdout, stderr) {
            if (error) {
              reject({ error, stderr });
            }
            resolve(stdout);
          }
        );
      }
    );
  });
};

module.exports = {
  executeCpp,
};
