# 🎥 Video Downloader App

A blazing-fast, full-stack YouTube video downloader built with **React + Node.js + yt-dlp**.  
Easily fetch video details and download videos or audio in your preferred format.  
Now optimized with `aria2c` for turbo-charged downloads. 🚀

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Video Engine:** [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- **Speed Booster:** [aria2c](https://aria2.github.io/) (optional)

---

## 📦 Features

- 🔍 Fetch YouTube video details (title, thumbnail, available formats)
- 📥 Download video or audio in any format (MP4, MP3, WebM, etc.)
- ⚡ Optionally boost download speed with `aria2c`
- 🔄 Fully async with smooth loading indicators
- 💻 Developer-friendly API and modular code

---

## 🚀 Getting Started

### 📁 Clone the repo

```bash
git clone https://github.com/Canol001/video-downloader-app.git
cd video-downloader-app
```

---

### 📦 Install Dependencies

**Backend (Express):**
```bash
cd server
npm install
```

**Frontend (React):**
```bash
cd ../client
npm install
```

---

### ▶️ Run the App

**Start Backend:**
```bash
cd server
node index.js
```

**Start Frontend:**
```bash
cd client
npm run dev
```

---

## 🔗 API Endpoints

### `POST /api/info`

Fetch video metadata.
```json
Request Body:
{ "url": "https://youtu.be/xyz" }

Response:
{
  "title": "Video Title",
  "thumbnail": "https://image.url",
  "formats": [ { "format_id": "...", "quality": "...", ... } ]
}
```

---

### `POST /api/download`

Triggers download as a browser file stream.
```json
Request Body:
{
  "url": "https://youtu.be/xyz",
  "format": "18"
}
```

---

## ⚙️ Optional: Enable `aria2c` for Fast Downloads

1. [Install aria2](https://github.com/aria2/aria2/releases)
2. Uncomment and modify the `spawn` command in `downloadVideo` to use:

```js
spawn("aria2c", [ "--max-connection-per-server=16", "--split=16", "--out=video.mp4", url ]);
```

⚠️ Only applicable if you're downloading via direct URL (not stdout stream).

---

## 🧠 Tips

- Use formats with both audio + video for `.mp4`
- Avoid DASH-only formats unless you're merging with `ffmpeg`
- Use `yt-dlp -F <url>` in terminal to inspect formats manually

---

## 📸 Screenshot

![UI Preview](./screenshot.png)

---

## 📄 License

MIT © 2025 Venom😎
"Code hard. Download harder."
