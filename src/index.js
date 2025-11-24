// const express = require("express");
// const app = express();

// const PORT = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("NodeJS App successfully deployed using Jenkins + Docker + Kubernetes!");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const os = require("os");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <h1 style="text-align:center; color:green;">🚀 Node.js App Deployed Successfully</h1>
    <p style="text-align:center;">Using <strong>Jenkins + Docker + Kubernetes</strong></p>
    <p style="text-align:center;">Pod running on: <strong>${os.hostname()}</strong></p>
    <div style="text-align:center;margin-top:20px;">
      <a href="/health" style="padding:10px 20px; background:blue; color:#fff; border-radius:6px; text-decoration:none;">Health Check</a>
      <a href="/api" style="margin-left:10px;padding:10px 20px; background:purple; color:#fff; border-radius:6px; text-decoration:none;">API</a>
    </div>
  `);
});

app.get("/health", (req, res) => {
  res.json({ status: "UP", pod: os.hostname() });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Backend API working 🔥",
    container: os.hostname(),
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


