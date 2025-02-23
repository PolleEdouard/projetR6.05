'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth: { scope: ['user','admin'] },
            validate: {
                payload: Joi.object({
                    movie_id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { favoriteService } = request.services();
                const userId = request.auth.credentials.id;
                const { movie_id } = request.payload;

                await favoriteService.addFavorite(userId, movie_id);

                return h.response({ message: 'Film ajouté aux favoris' }).code(201);
            } catch (err) {
                return err;
            }
        }
    },
    {
        method: 'get',
        path: '/favorite',
        options: {
            tags: ['api'],
            auth: { scope: ['user','admin'] }
        },
        handler: async (request, h) => {
            try {
                const { favoriteService } = request.services();
                const userId = request.auth.credentials.id;

                const favorites = await favoriteService.getFavorites(userId);

                return h.response(favorites).code(200);
            } catch (err) {
                return err;
            }
        }
    }
];
