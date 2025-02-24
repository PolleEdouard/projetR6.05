'use strict';

const Joi = require('joi')
const {sendMessage} = require("../services/MessageBroker");

module.exports = [

    {
        method: 'post',
        path: `/movie`,
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().min(1).example('cars').description('Title of the movie'),
                    description: Joi.string().required().min(1).example('Flash McQueen, a splendid racing car destined for success, must participate in the prestigious Piston Cup').description('Description of the movie'),
                    releaseDate: Joi.date().required(),
                    director: Joi.string().required().min(1).example('John Lasseter').description('Director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            try {
                console.log("Requête reçue pour créer un film:", request.payload);

                const { movieService } = request.server.services();
                const newMovie = await movieService.create(request.payload);

                return h.response(newMovie).code(201);
            } catch (error) {
                console.error("Erreur lors de la création du film:", error);
                return Boom.internal("Erreur interne lors de la création du film");
            }
        }
},
    {
        method: 'get',
        path: '/movie',
        options: {
            tags:['api']
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.findAll();
        }
    },
    {
        method: 'delete',
        path: '/movie/{id}',
        options: {
            tags:['api'],
            auth : {
                scope : ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                })
            }
        },
        handler: async (request, h) => {

            const { movieService } = request.services();

            return await movieService.delete(request.params.id);
        }
    },
    {
        method: 'put',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1)
                }),
                payload: Joi.object({
                    title: Joi.string().min(1).example('Cars 2').description('Title of the movie'),
                    description: Joi.string().min(1).example('Flash McQueen revient pour de nouvelles aventures.').description('Description of the movie'),
                    releaseDate: Joi.date(),
                    director: Joi.string().min(1).example('John Lasseter').description('Director of the movie'),
                })
            }
        },
        handler: async (request, h) => {
            console.log("Requête reçue pour créer un film:", request.payload);
            const { movieService } = request.services();
            return await movieService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'post',
        path: '/movie/export',
        options: {
            tags: ['api'],
            auth: {scope: ['admin']},
            handler: async (request, h) => {
                try {
                    const { movieService } = request.services();
                    const filePath = await movieService.exportFilmInCsv();


                    await sendMessage('csv_exports', {filePath, email: request.auth.credentials.email});

                    return h.response({message: "Export en cours. Vous recevrez un email sous peu."}).code(202);
                } catch (error) {
                    console.error("Erreur lors de l'export :", error);
                    return h.response({error: "Erreur lors de l'export des films."}).code(500);
                }
            }
        }
}

]