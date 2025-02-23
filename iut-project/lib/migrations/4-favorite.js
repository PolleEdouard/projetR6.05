'use strict';

module.exports = {
    async up(knex) {
    await knex.schema.createTable('favorite', (table) => {
        table.integer('user_id').unsigned().notNullable();
        table.integer('movie_id').unsigned().notNullable();
        table.foreign('user_id').references('user.id').onDelete('CASCADE');
        table.foreign('movie_id').references('movie.id').onDelete('CASCADE');
        table.primary(['user_id', 'movie_id']);
    });
},

    async down(knex) {
        await knex.schema.dropTableIfExists('favorite');
}
};
