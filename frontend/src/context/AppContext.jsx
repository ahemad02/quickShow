import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [shows, setShows] = useState([]);

  const [favoritesMovies, setFavoritesMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { isLoaded, user } = useUser();

  const { getToken } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        toast.error("You are not an admin");
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("You are not authorized as admin");
        navigate("/");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }

      setIsAdmin(false);
    }
  };
  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");

      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      if (isLoaded) {
        const { data } = await axios.get("/api/user/favorites", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });

        if (data.success) {
          setFavoritesMovies(data.movies);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user && location.pathname.startsWith("/admin")) {
      fetchIsAdmin();
    }
    if (isLoaded && user) {
      fetchFavoriteMovies();
    }
  }, [isLoaded, user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    fetchFavoriteMovies,
    favoritesMovies,
    fetchShows,
    shows,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
