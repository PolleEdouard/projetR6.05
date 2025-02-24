'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

module.exports = class MovieService extends Service {
    static name = 'MovieService';

    async create(movie) {
        const { Movie } = this.server.models();
        const newMovie = await Movie.query().insertAndFetch(movie);
        const userService = this.server.services().userService;
        const mailService = this.server.services().mailService;

        const users = await userService.findAll();

        const userList = users.map(user => ({
            email: user.email,
            username: user.username
        }));

        await mailService.sendNewMovieEmail(userList, newMovie.title);

        return newMovie;
    }
    findAll(){
        const { Movie } = this.server.models();
        return Movie.query();
    }
    delete(id) {
        const { Movie } = this.server.models();
        return Movie.query().deleteById(id);
    }
    async exportFilmInCsv() {
        const { Movie } = this.server.models();
        const movies = await Movie.query();

        if (!movies || movies.length === 0) {
            throw new Error("Aucun film trouvé pour l'export.");
        }


        const exportDir = path.join(__dirname, '../exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const parser = new Parser();
        const csv = parser.parse(movies);

        const filePath = path.join(exportDir, `ListeFilms_${Date.now()}.csv`);
        fs.writeFileSync(filePath, csv);

        return filePath;
    }
    async update(movieId, movieData) {
        const { Movie, Favorite, User } = this.server.models();
        const mailService = this.server.services().mailService;

        const movie = await Movie.query().findById(movieId);
        if (!movie) {
            throw Boom.notFound("Film introuvable");
        }


        const updatedMovie = await Movie.query().patchAndFetchById(movieId, movieData);


        const favorites = await Favorite.query().where({ movie_id: movieId }).select("user_id");

        if (favorites.length > 0) {
            const userIds = favorites.map(fav => fav.user_id);

            const users = await User.query().whereIn("id", userIds).select("email", "username");

            const userList = users.map(user => ({
                email: user.email,
                username: user.username
            }));

            await mailService.sendModifFavoriteMail(userList, updatedMovie.title);
        }

        return updatedMovie;
    }


}