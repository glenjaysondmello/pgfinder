const { spawn } = require("child_process");

const chatbot =  (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    res.status(400).json({ error: "Message not Provided" });
  }

  const process = spawn("python", ["./python/run_pipeline.py", userInput]);

  processOutput = "";

  process.stdout.on("data", (data) => {
    processOutput += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  process.on("close", (code) => {
    if (code === 0) {
      res.status(200).json({ message: processOutput.trim() });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

module.exports = { chatbot };
