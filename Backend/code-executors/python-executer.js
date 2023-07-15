const { exec } = require("child_process");

const executePy = function(filepath){
  return new Promise(function(resolve, reject){
    exec(
      `python "${filepath}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
