const express = require("express");
const cors = require("cors");
const path = require("path");
const videoRoutes = require("./routes/downloader.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", videoRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("📽️ Video Downloader API is up and running!");
});

// Optional static serving - only if you're using React/Vite build output
const staticDir = path.join(__dirname, "public");
if (require("fs").existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
