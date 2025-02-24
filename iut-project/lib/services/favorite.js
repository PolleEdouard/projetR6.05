'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoriteService extends Service {
    static name = 'FavoriteService';


    async addFavorite(userId, movieId) {
        const { Favorite, Movie, User } = this.server.models();

        const user = await User.query().findById(userId);
        if (!user) {
            throw Boom.notFound('Utilisateur introuvable');
        }

        const movie = await Movie.query().findById(movieId);
        if (!movie) {
            throw Boom.notFound('Film introuvable');
        }

        const existingFavorite = await Favorite.query()
            .where({ user_id: userId, movie_id: movieId })
            .first();

        if (existingFavorite) {
            throw Boom.conflict('Le film est déjà dans les favoris');
        }

        return Favorite.query().insertAndFetch({ user_id: userId, movie_id: movieId });
    }

    async getFavorites(userId) {
        const { Favorite} = this.server.models();

        return Favorite.query()
            .where('user_id', userId)
            .join('movie', 'favorite.movie_id', '=', 'movie.id')
            .select('movie.*');
    }
};
