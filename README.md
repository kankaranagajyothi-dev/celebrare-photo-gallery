# Celebrare Photo Gallery

A React + Vite photo gallery built for the Celebrare Frontend Intern pre-screening assignment.

## Features

- Fetches 30 photos from `https://picsum.photos/v2/list?limit=30`
- Loading spinner and API error message
- Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop
- Live author-name search without another API request
- Favourite toggle managed with `useReducer`
- Favourite IDs saved in `localStorage`
- Custom `useFetchPhotos` hook
- `useCallback` for the search handler and favourite action
- `useMemo` for the filtered photo list
- Tailwind CSS styling; no component library

## Requirements

Install Node.js (LTS) and npm.

## Run locally

1. Extract the ZIP file.
2. Open the extracted `celebrare-photo-gallery` folder in a terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal, usually `http://localhost:5173`.

## Build check

```bash
npm run build
```

## How the code works

- `src/hooks/useFetchPhotos.js`: requests the Picsum API when the app loads and returns `photos`, `loading`, and `error`.
- `src/App.jsx`: stores search text, filters photos, and manages favourite IDs.
- `favouritesReducer`: handles `TOGGLE_FAVOURITE`; the updated ID list is written to localStorage.
- `PhotoCard`: displays an image, author name, and favourite heart button.
- `src/index.css`: imports Tailwind CSS and sets small global defaults.

## Before submitting

- Run the app and verify the API loads.
- Search for part of an author name.
- Favourite a photo, refresh the page, and verify the heart remains selected.
- Create a public GitHub repository and push this project.
- Record the required 5-minute explanation video and upload it to Google Drive or YouTube as unlisted.
- Submit both links and one sentence about the hardest part using the Google Form supplied by the recruiter.

Be sure you understand the code and can explain it yourself before submitting.
