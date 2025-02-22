'use strict';

const HauteCouture = require('@hapipal/haute-couture');
const Package = require('../package.json');
require('@hapipal/schmervice');
exports.plugin = {
    pkg: Package,
    register: async (server, options) => {



        await HauteCouture.compose(server, options);
    }
};
