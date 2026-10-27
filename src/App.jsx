import { useCallback, useMemo, useReducer, useState } from "react";
import { Heart, Search, Camera, Image as ImageIcon } from "lucide-react";
import useFetchPhotos from "./hooks/useFetchPhotos.js";

const STORAGE_KEY = "celebrare-photo-favourites";

function readSavedFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVOURITE": {
      const alreadyFavourite = state.includes(action.photoId);
      const nextState = alreadyFavourite
        ? state.filter((id) => id !== action.photoId)
        : [...state, action.photoId];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // The app remains usable even if browser storage is unavailable.
      }

      return nextState;
    }
    default:
      return state;
  }
}

function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={photo.download_url}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavourite}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition ${
            isFavourite
              ? "bg-rose-500 text-white"
              : "bg-white/95 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
          }`}
        >
          <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-semibold text-slate-800">{photo.author}</p>
        <span className="shrink-0 text-xs text-slate-400">Photo</span>
      </div>
    </article>
  );
}

export default function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchTerm, setSearchTerm] = useState("");
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    readSavedFavourites
  );

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const toggleFavourite = useCallback((photoId) => {
    dispatch({ type: "TOGGLE_FAVOURITE", photoId });
  }, []);

  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return photos;
    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, searchTerm]);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Camera size={23} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Photo Gallery</h1>
            <p className="text-sm text-slate-500">A little inspiration, one photo at a time.</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">Discover</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Explore photographs</h2>
            <p className="mt-2 text-slate-500">Search by author and save your favourites.</p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <label htmlFor="photo-search" className="sr-only">Search photos by author</label>
            <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="photo-search"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by author name..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500" aria-live="polite">
            {loading ? "Loading photos..." : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? "photo" : "photos"} shown`}
          </p>
          <p className="flex items-center gap-1.5 text-sm font-medium text-rose-500">
            <Heart size={16} fill="currentColor" />
            {favourites.length} {favourites.length === 1 ? "favourite" : "favourites"}
          </p>
        </div>

        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" role="status" aria-label="Loading photos" />
            <p className="text-sm text-slate-500">Fetching photos for you...</p>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-800">We couldn’t load the photos.</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <p className="mt-2 text-sm text-red-700">Check your internet connection and refresh the page to try again.</p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <ImageIcon size={32} className="mb-3 text-slate-400" />
            <p className="font-semibold text-slate-800">No photos found</p>
            <p className="mt-1 text-sm text-slate-500">Try searching for a different author name.</p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        Photos provided by the Picsum Photos public API.
      </footer>
    </main>
  );
}
