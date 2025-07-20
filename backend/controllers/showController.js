import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get(
            `https://api.themoviedb.org/3/movie/now_playing`, {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });

        const movies = data.results;
        res.status(200).json({
            success: true,
            movies: movies
        });


    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });


    }

}

export const addShow = async (req, res) => {
    try {

        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findById(movieId);

        if (!movie) {
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                }),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                })

            ])

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            const moviesDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                genres: movieApiData.genres,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
                casts: movieCreditsData.cast
            }

            movie = await Movie.create(moviesDetails);


        }

        const showsToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice: showPrice,
                    occupiedSeats: {}
                })
            })
        })

        if (showsToCreate.length > 0) {
            const shows = await Show.insertMany(showsToCreate);
            res.status(200).json({
                success: true,
                shows: shows,
                message: "Shows added successfully"
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export const getShows = async (req, res) => {
    try {

        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate("movie").sort({ showDateTime: 1 });

        const uniqueShows = new Set(shows.map(show => show.movie));

        res.status(200).json({
            success: true,
            shows: Array.from(uniqueShows),
        });


    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });

        const movie = await Movie.findById(movieId);

        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.status(200).json({
            success: true,
            movie,
            dateTime,
        });



    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}