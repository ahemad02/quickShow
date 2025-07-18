import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const FeaturedCardSection = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-sm  border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="relative group">
        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="w-full h-64 object-cover rounded-t-lg cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-90 shadow-lg"
          src={movie.backdrop_path}
          alt={movie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 pointer-events-none rounded-t-lg"></div>
        <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded text-xs font-semibold text-gray-800 dark:text-gray-200 shadow">
          {movie.genres
            .slice(0, 2)
            .map((genre) => genre.name)
            .join(" | ")}
        </div>
      </div>
      <div className="p-5">
        <p className="mb-3 font-bold text-lg text-gray-200 dark:text-white">
          {movie.title}
        </p>
        <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
          {new Date(movie.release_date).getFullYear()} &middot;{" "}
          {timeFormat(movie.runtime)}
        </p>
        <div className="flex items-center justify-between mt-4 pb-3">
          <button
            onClick={() => {
              navigate(`/movies/${movie._id}`);
              scrollTo(0, 0);
            }}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 shadow"
          >
            Buy Tickets
          </button>
          <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1 pr-1">
            <StarIcon className="w-4 h-4 text-primary fill-primary" />
            {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCardSection;
