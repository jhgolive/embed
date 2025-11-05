import express from "express";
import { lyricsDB } from "./lyrics.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Nightbot 문자 제한 대비 안전치
const CHUNK = 300;

app.get("/lyrics", (req, res) => {
  const rawSong = req.query.song || "";
  const song = decodeURI(rawSong.replace(/\+/g, " ")).trim();
  const part = parseInt(req.query.part || "1");

  const lyrics = lyricsDB[song];
  if (!lyrics) return res.send("등록되지 않은 곡입니다");

  const chunks = [];
  for (let i = 0; i < lyrics.length; i += CHUNK) {
    chunks.push(lyrics.slice(i, i + CHUNK));
  }

  const text = chunks[part - 1] || "";
  res.send(text);
});

app.listen(PORT, () => console.log("Lyrics server running:", PORT));
