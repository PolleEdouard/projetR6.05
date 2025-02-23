'use strict';

const { Model } = require('objection');

module.exports = class Favorite extends Model {
    static get tableName() {
        return 'favorite';
    }

    static get idColumn() {
        return ['user_id', 'movie_id'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'movie_id'],
            properties: {
                user_id: { type: 'integer' },
                movie_id: { type: 'integer' }
            }
        };
    }

    static get relationMappings() {
        const User = require('./user');
        const Movie = require('./movie');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'favorite.user_id',
                    to: 'user.id'
                }
            },
            movie: {
                relation: Model.BelongsToOneRelation,
                modelClass: Movie,
                join: {
                    from: 'favorite.movie_id',
                    to: 'movie.id'
                }
            }
        };
    }
};
