'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const joi = require("nodemailer/lib/mime-node");

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).example('loupe').description('Title of the movie'),
            description: Joi.string().min(1).example('oupi goupi.').description('Description of the movie'),
            releaseDate: Joi.date(),
            director: Joi.string().min(1).example('la creature').description('Director of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });

    }
    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};