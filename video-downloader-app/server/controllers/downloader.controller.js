const ytdlp = require("yt-dlp-exec"); // CommonJS import
const { spawn } = require("child_process");

// 📽️ Fetch video info
exports.getVideoInfo = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    // 🧠 Enhanced formats: audio-only, video-only, and combined
    const formats = info.formats
      .filter(f => f.ext && (f.vcodec !== "none" || f.acodec !== "none"))
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        format_note: f.format_note || "",
        quality: f.quality_label || f.abr || f.height || "Unknown",
        filesize: f.filesize || f.filesize_approx || null,
        type:
          f.vcodec === "none" ? "audio" :
          f.acodec === "none" ? "video" :
          "both",
        acodec: f.acodec,
        vcodec: f.vcodec
      }));

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      formats,
    });
  } catch (err) {
    console.error("🔥 getVideoInfo error:", err.stderr || err.message || err);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
};

// ⬇️ Download the selected format
exports.downloadVideo = async (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: "Missing url or format" });
  }

  try {
    console.log(`⏬ Downloading: ${url} with format ${format}`);

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="video.${format}.mp4"`);
    res.setHeader("Content-Type", "application/octet-stream");

    // yt-dlp stream to response
    const ytdlpProcess = spawn("yt-dlp", [
      "-f", format,
      "-o", "-", // Output to stdout
      "--no-playlist",
      "--merge-output-format", "mp4",
      url,
    ]);

    ytdlpProcess.stdout.pipe(res);

    ytdlpProcess.stderr.on("data", (data) => {
      console.error(`yt-dlp error: ${data.toString()}`);
    });

    ytdlpProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp exited with code ${code}`);
        if (!res.headersSent) {
          res.status(500).json({ error: "Download failed" });
        }
      }
    });

  } catch (err) {
    console.error("🔥 Download error:", err.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error during download" });
    }
  }
};
