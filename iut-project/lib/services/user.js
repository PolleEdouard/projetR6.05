'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

    static name = 'userService'; // ✅ Ajout du nom du service

    async create(user) {
        const { User } = this.server.models();
        const newUser = await User.query().insertAndFetch(user);

        const mailService = this.server.services().mailService;
        await mailService.sendWelcomeEmail(newUser.email, newUser.firstName);

        return newUser;
    }

    findAll() {
        const { User } = this.server.models();
        return User.query();
    }

    delete(id) {
        const { User } = this.server.models();
        return User.query().deleteById(id);
    }

    update(id, user) {
        const { User } = this.server.models();
        return User.query().findById(id).patch(user);
    }

    async login(email, password) {
        const { User } = this.server.models();
        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                scope: user.roles
            },
            {
                key: 'random_string',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }
        );

        return token;
    }
};
