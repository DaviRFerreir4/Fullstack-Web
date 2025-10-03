import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.timestamp('updated_at').defaultTo(knex.fn.now()).after('created_at')
  })
}

// npm run knex -- migrate:list (Mostra todas as migrations, sejam executadas ou pendentes)
// npm run knex -- migrate:down 20251003174733_add-updated-courses.ts (Desfaz as alterações causadas por uma migration específica)
// npm run knex -- migrate:rollback (Desfaz as últimas alterações causadas)
// npm run knex -- migrate:rollback --all (Desfaz todas as alterações causadas)
export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('courses', (table) => {
    table.dropColumn('updated_at')
  })
}
