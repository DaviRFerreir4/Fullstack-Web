// npm run knex -- seed:make insert-courses (cria uma seed nova)
import { Knex } from 'knex'

// npm run knex -- seed:run (roda as seeds existentes)
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("table_name").del();

  // Inserts seed entries
  await knex('courses').insert([
    { name: 'Git' },
    { name: 'HTML' },
    { name: 'CSS' },
    { name: 'JavaScript' },
    { name: 'Node.js' },
    { name: 'Express.js' },
    { name: 'Banco de dados' },
    { name: 'React' },
  ])
}
