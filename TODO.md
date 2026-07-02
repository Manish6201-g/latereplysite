# TODO - Late Reply Site Improvements

## Step 1: Install dependencies (already attempted)
- Run `npm ci` / `npm install`

## Step 2: Fix autoplay + lyric timing UX (FinalScreen)
- ✅ Add user-gesture “Tap to start music”
- ✅ Start audio + timers after gesture
- ✅ Keep autoplay attempt as best-effort

## Step 3: Add prefers-reduced-motion support
- ✅ Use Framer Motion `useReducedMotion()`
- ✅ Disable infinite animations and heavy blur/filter transitions

## Step 4: Fix/replace invalid Tailwind class
- ✅ Replace `min-h-100` wrapper with a valid `min-h-[...]`

## Step 5: Improve end overlay (FinalScreen)
- ✅ Replace blocking empty black overlay with a visible end card
- ✅ Add Replay + Close

## Step 6: Reduce heavy blur/filter defaults
- ✅ Lower blur radii and lyric blur via reduced-motion


## Step 7: DRY step animation wrapper (optional but recommended)
- Create shared `AnimatedStep` component and refactor Screen1/2/3

## Step 8: Test
- Run `npm run dev` and verify flow on desktop + mobile
- Check reduced-motion in OS settings

