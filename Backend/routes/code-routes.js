const router = require("express").Router();

const { generateFile } = require("../file-generator");
const { addCodeToQueue } = require("../codeExecQueue");
const codeSchema = require("../models/code-model");

router.get("/", function (req, res) {
  res.render("main");
});

router.post("/", async function (req, res) {
  const { Language, code } = req.body;

  if (code === undefined) {
    res.status(400).json({ success: false, error: "Empty code body!" });
  }

  const filePath = await generateFile(Language, code);
  const codeExec = await codeSchema.create({
    Language: Language,
    filePath: filePath,
    codeSnippet: code,
  });
  console.log(codeExec._id);

  addCodeToQueue(codeExec._id);
  res
    .status(200)
    .json({
      status: "code added to execution queue",
      submission_id: codeExec._id,
    });
});

router.get("/status", async (req, res) => {
  const codeExecId = req.query.id;
  if (codeExecId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const code = await codeSchema.findById(codeExecId);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  if (code.status === "success") {
    return res.status(200).json({ success: 'true' ,status: code.status, output: code.output });
  } else if(code.status === "pending"){
    return res.status(200).json({ success: 'true', status: code.status, output:'' });
  } else{
    res.status(200).json({ success: 'flase', status: code.status,  output: code.output})
  }
});

module.exports = router;
