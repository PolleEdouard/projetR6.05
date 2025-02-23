'use strict';

const Joi = require('joi');
const {Boom} = require("@hapi/boom");

module.exports = [{
    method: 'get',
        path: '/movies/export',
    options: {
    tags: ['api'],
        auth: { scope: ['admin'] }
},
    handler: async (request, h) => {
        try {
            const { movieService, messageBrokerService } = request.services();
            const adminEmail = request.auth.credentials.email;

            const movies = await movieService.findAll();

            await messageBrokerService.publish("csv_export", { adminEmail, movies });

            return h.response({ message: "Export en cours, vous recevrez un email." }).code(202);
        } catch (err) {
            console.error("Erreur d'export CSV:", err);
            return Boom.internal("Erreur lors de l'export CSV.");
        }
    }
}]
