import axios from "axios";
import { useState } from "react";

interface Format {
  format_id: string;
  ext: string;
  format_note: string;
  quality: string;
  filesize: number | null;
  type: "video" | "audio" | "both";
  acodec: string;
  vcodec: string;
}

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [format, setFormat] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleFetchInfo = async () => {
    try {
      setLoadingInfo(true);
      setError(null);
      const res = await axios.post("http://localhost:5000/api/info", { url });
      setInfo(res.data);
    } catch (err) {
      setError("Failed to fetch video info. Please check the URL and try again.");
      console.error(err);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      const res = await axios.post(
        "http://localhost:5000/api/download",
        { url, format },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${info.title}.${format.includes("audio") ? "mp3" : "mp4"}`;
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError("Download failed. Please try again.");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const groupFormats = (type: "video" | "audio" | "both") =>
    info?.formats?.filter((f: Format) => f.type === type) || [];

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeff1] px-4 py-3 sm:px-10">
          <div className="flex items-center gap-4 text-[#101618]">
            <div className="size-3 sm:size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#101618] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
              Video Downloader
            </h2>
          </div>
          <a
            href="#hero"
            className="flex min-w-[64px] sm:min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 sm:h-10 px-3 sm:px-4 bg-[#dcedf3] text-[#101618] text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]"
            aria-label="Get Started"
          >
            <span className="truncate">Get Started</span>
          </a>
        </header>

        {/* Main Content */}
        <div className="px-4 sm:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Hero Section */}
            <div className="@container" id="hero">
              <div className="p-2 sm:@[480px]:p-4">
                <div
                  className="flex min-h-[360px] sm:min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat sm:@[480px]:gap-8 sm:@[480px]:rounded-xl items-center justify-center p-4"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmCI30Jw2J6tRlhQ5cdYmfJEKl0RMTl4QN7hshtatkxVpKffY2AHCoMiLJdzqIbF_GUjgi1l2J8MATxWQa2YJ3yfdEFyFtL_Kad1A2zlAX0Z4OGIvHyerhV0xEZeet9wV3Raekz575U6Jz4qHeVZlkX9dbj4xzkaGv_WPmB7582KJ2vrdk8fhb46bzxtBG1Vrb_8uQh1ulbCsqcVM6l4iOx-DYxezM3E103oKlNTE_0pmS0ev3GGlsoZQgnzYyqDRQFECbZw2_iUY")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-2xl sm:text-4xl font-black leading-tight tracking-[-0.033em] sm:@[480px]:text-5xl sm:@[480px]:font-black sm:@[480px]:leading-tight sm:@[480px]:tracking-[-0.033em]">
                      Download Videos with Ease
                    </h1>
                    <h2 className="text-white text-xs sm:text-sm font-normal leading-normal sm:@[480px]:text-base sm:@[480px]:font-normal sm:@[480px]:leading-normal">
                      Paste a video link to access its details and download in your preferred format.
                    </h2>
                  </div>
                  <label className="flex flex-col min-w-40 h-12 sm:h-14 w-full max-w-[960px] sm:max-w-[480px] sm:@[480px]:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <div
                        className="text-[#5c7d8a] flex border border-[#d4dfe2] bg-gray-50 items-center justify-center pl-[10px] sm:pl-[15px] rounded-l-xl border-r-0"
                        data-icon="MagnifyingGlass"
                        data-size="16px"
                        data-weight="regular"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16px"
                          height="16px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                        </svg>
                      </div>
                      <input
                        placeholder="Paste video link here"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101618] focus:outline-0 focus:ring-0 border border-[#d4dfe2] bg-gray-50 focus:border-[#d4dfe2] h-full placeholder:text-[#5c7d8a] px-[10px] sm:px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-xs sm:text-sm font-normal leading-normal sm:@[480px]:text-base sm:@[480px]:font-normal sm:@[480px]:leading-normal"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        aria-label="Video URL"
                      />
                      <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#d4dfe2] bg-gray-50 pr-[5px] sm:pr-[7px]">
                        <button
                          onClick={handleFetchInfo}
                          disabled={loadingInfo || !url}
                          className="flex min-w-[64px] sm:min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 sm:h-10 sm:@[480px]:h-12 px-3 sm:px-4 sm:@[480px]:px-5 bg-[#dcedf3] text-[#101618] text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] sm:@[480px]:text-base sm:@[480px]:font-bold sm:@[480px]:leading-normal sm:@[480px]:tracking-[0.015em] disabled:bg-gray-400 disabled:cursor-not-allowed"
                          aria-label="Fetch video info"
                        >
                          <span className="truncate">{loadingInfo ? "Fetching..." : "Fetch Info"}</span>
                        </button>
                      </div>
                    </div>
                    {error && (
                      <p className="mt-2 sm:mt-4 text-red-500 text-xs sm:text-sm font-medium">{error}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {info && (
              <div className="p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 rounded-xl">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#101618] text-sm sm:text-base font-bold leading-tight">{info.title}</p>
                      <p className="text-[#5c7d8a] text-xs sm:text-sm font-normal leading-normal">
                        Select a format to download the video
                      </p>
                    </div>
                    <select
                      className="w-full max-w-[960px] sm:max-w-[480px] p-2 sm:p-3 rounded-xl border border-[#d4dfe2] text-[#101618] focus:outline-none focus:ring-0 focus:border-[#d4dfe2] text-xs sm:text-sm font-normal leading-normal"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      aria-label="Select download format"
                    >
                      <option value="">Select Format</option>
                      {["both", "video", "audio"].map((type) => {
                        const formats = groupFormats(type as any);
                        return formats.length > 0 ? (
                          <optgroup key={type} label={type.toUpperCase()}>
                            {formats.map((f: Format, idx: number) => (
                              <option key={idx} value={f.format_id}>
                                {f.ext} - {f.quality} - {f.format_note} - {formatFileSize(f.filesize)}
                              </option>
                            ))}
                          </optgroup>
                        ) : null;
                      })}
                    </select>
                    <button
                      onClick={handleDownload}
                      disabled={downloading || !format}
                      className="flex min-w-[64px] sm:min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-3 sm:px-4 flex-row-reverse bg-[#eaeff1] text-[#101618] pr-2 gap-1 text-xs sm:text-sm font-medium leading-normal w-fit disabled:bg-gray-400 disabled:cursor-not-allowed"
                      aria-label="Download video"
                    >
                      <div className="text-[#101618]" data-icon="DownloadSimple" data-size="16px sm:18px" data-weight="regular">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16px"
                          height="16px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="sm:w-[18px] sm:h-[18px]"
                        >
                          <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,132.69V40a8,8,0,0,0-16,0v92.69L93.66,106.34a8,8,0,0,0-11.32,11.32Z"></path>
                        </svg>
                      </div>
                      <span className="truncate">{downloading ? "Downloading..." : "Download"}</span>
                    </button>
                  </div>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl sm:flex-1"
                    style={{ backgroundImage: `url(${info.thumbnail})` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Supported Platforms */}
            <h3 className="text-[#101618] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Supported Platforms
            </h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-2 sm:gap-3">
              {[
                {
                  name: "YouTube",
                  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/YouTube_social_white_square_%282024%29.svg/1200px-YouTube_social_white_square_%282024%29.svg.png",
                },
                {
                  name: "Facebook",
                  image: "https://store-images.s-microsoft.com/image/apps.37935.9007199266245907.b029bd80-381a-4869-854f-bac6f359c5c9.91f8693c-c75b-4050-a796-63e1314d18c9",
                },
                {
                  name: "TikTok",
                  image: "https://play-lh.googleusercontent.com/BmUViDVOKNJe0GYJe22hsr7juFndRVbvr1fGmHGXqHfJjNAXjd26bfuGRQpVrpJ6YbA=w240-h480-rw",
                },
                {
                  name: "Instagram",
                  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/960px-Instagram_logo_2022.svg.png",
                },
              ].map((platform) => (
                <div key={platform.name} className="flex flex-col gap-2 sm:gap-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                    style={{ backgroundImage: `url(${platform.image})`, backgroundColor: "#ffffff" }}
                  ></div>
                  <p className="text-[#101618] text-sm sm:text-base font-medium leading-normal text-center">{platform.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-4 sm:gap-6 px-5 py-8 sm:py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 sm:@[480px]:flex-row sm:@[480px]:justify-around">
                <a className="text-[#5c7d8a] text-sm sm:text-base font-normal leading-normal min-w-40" href="#">
                  Privacy Policy
                </a>
                <a className="text-[#5c7d8a] text-sm sm:text-base font-normal leading-normal min-w-40" href="#">
                  Terms of Service
                </a>
              </div>
              <p className="text-[#5c7d8a] text-sm sm:text-base font-normal leading-normal">
                © 2025 Video Downloader. All rights reserved.
              </p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
}