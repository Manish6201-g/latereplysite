# 🎶 Late Reply Site

A small interactive “late reply” surprise built to make someone smile. It’s a 3-step message flow with smooth animations, and then a final screen that plays a song while animated lyrics appear.

---

## ✨ Features

- **Multi-screen flow** (step-by-step UI)
  - **Screen 1:** playful teasing message + continue button
  - **Screen 2:** “waiting forever” note + continue button
  - **Screen 3:** forgiveness / “I can’t stay mad” moment + continue button
- **Final experience (`FinalScreen`)**
  - Plays **`public/music.mp3`** automatically
  - Shows **animated lyric lines** (timed progression)
  - Displays **`public/sticker.webp`** as a themed sticker
  - Ends with a **full-screen black overlay** once the lyrics finish
- **Motion & polish**
  - `framer-motion` entrance/exit transitions between screens
  - Subtle looping icon animations on the intermediate screens

---

## 🛠 Tech Stack

- **Next.js** (React + App Router)
- **React**
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **lucide-react** (icons)

---

## 📁 Project Structure (high level)

- `src/app/page.jsx`
  - Holds the screen step state and swaps between `Screen1`, `Screen2`, `Screen3`, and `FinalScreen`
- `src/components/Screen1.jsx`
- `src/components/Screen2.jsx`
- `src/components/Screen3.jsx`
- `src/components/FinalScreen.jsx`
  - Handles audio playback, lyric timing, sticker, and final overlay

---

## 🖥 Local Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open: **http://localhost:3000**

---

## 🎛️ Assets Used

- `public/music.mp3` — background audio for the final screen
- `public/sticker.webp` — sticker image shown during the final screen

---

## ⚠️ License & Usage

This project is intended for **personal use only**.

- You **cannot** post, upload, or share this project online in any form (e.g., Instagram reels, YouTube videos, websites, or any public platform).
- Using this free code publicly is **prohibited**.

Any violation may be treated as **copyright infringement**.