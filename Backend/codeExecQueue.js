const Queue = require("bull");

const codeSchema = require("./models/code-model");
const { executeCpp } = require("./code-executors/cpp-executer");
const { executePy } = require("./code-executors/python-executer");

const codeQueue = new Queue("code-runner-queue");
const NUM_WORKERS = 5;

codeQueue.process(NUM_WORKERS, async ({ data }) => {
  const codeExecId = data.id;
  const codeExec = await codeSchema.findById(codeExecId);
  if (codeExec === undefined) {
    throw Error(`cannot find Job with id ${codeExecId}`);
  }
  try {
    let output;
    codeExec["startedAt"] = new Date();
    if (codeExec.Language === "cpp") {
      output = await executeCpp(codeExec.filePath);
    } else if (codeExec.Language === "py") {
      output = await executePy(codeExec.filePath);
    }
    codeExec["completedAt"] = new Date();
    codeExec["output"] = output;
    codeExec["status"] = "success";
    await codeExec.save();
    return true;
  } catch (err) {
    codeExec["completedAt"] = new Date();
    codeExec["output"] = JSON.stringify(err);
    codeExec["status"] = "error";
    await codeExec.save();
    throw Error(JSON.stringify(err));
  }
});

codeQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});

const addCodeToQueue = async (codeExecId) => {
  codeQueue.add({
    id: codeExecId,
  });
};

module.exports = {
  addCodeToQueue,
};