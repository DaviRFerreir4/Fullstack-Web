// npm run knex -- migrate:make create-courses
import type { Knex } from 'knex'

// Executa o comando - npm run knex -- migrate:latest (roda todas as migrations)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary(),
      table.text('name').notNullable(),
      table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

// Cancela a execução do comando
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('courses')
}
