import express from "express";
import { lyricsDB } from "./lyrics.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Nightbot 문자 제한 대비 안전치
const CHUNK = 200;

app.get("/lyrics", (req, res) => {
  let rawSong = req.query.song || "";
  rawSong = decodeURI(rawSong.replace(/\+/g, " ")).trim();

  // 기본값 part=1
  let part = parseInt(req.query.part || "1");

  // 1️⃣ "part2", "part 2", "파트2" 인식
  let match = rawSong.match(/(?:part|파트)\s*([0-9]+)/i);
  if (match) {
    part = parseInt(match[1]);
    rawSong = rawSong.replace(match[0], "").trim();
  } 
  // 2️⃣ 제목 끝에 붙은 "2", "3" 같은 숫자 인식 (예: "좋은날 2")
  else {
    const numMatch = rawSong.match(/\b([0-9]+)\b$/);
    if (numMatch) {
      part = parseInt(numMatch[1]);
      rawSong = rawSong.replace(numMatch[0], "").trim();
    }
  }

  const song = rawSong;
  const lyrics = lyricsDB[song];
  if (!lyrics) return res.send("등록되지 않은 곡입니다");

  const chunks = [];
  for (let i = 0; i < lyrics.length; i += CHUNK) {
    chunks.push(lyrics.slice(i, i + CHUNK));
  }

  const text = chunks[part - 1] || "";
  res.send(text || ""); // 내용이 없으면 빈 문자열
});

app.listen(PORT, () => console.log("Lyrics server running:", PORT));
