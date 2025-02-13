'use strict';

const Joi = require('joi')

module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user')
            })
        }
    },
    handler: async (request, h) => {

        const {User} = request.models();

        // Objection retourne des promeses, il ne faut pas oublier des les await.
        const user = await User.query().insertAndFetch({
            firstName: request.payload.firstName,
            lastName: request.payload.lastName
        });

        return user;
    }
},
    {
        method: 'GET',
        path: '/user',
        options: {
            tags: ['api'],
            validate: {
                query: Joi.object({
                    firstName: Joi.string().required().min(3).example('François').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Intel').description('Lastname of the user')
                })
            }
        },
        handler: async (request, h) => {
            const  firstName = request.query.firstName;
            const  lastName  = request.query.lastName;
            return h.response({ message: `User: ${firstName} ${lastName}` }).code(200);
        }
    }
];

