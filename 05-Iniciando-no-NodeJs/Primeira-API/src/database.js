// Criando o arquivo de dados
import fs from 'node:fs/promises'

const DATABASE_PATH = new URL('db.json', import.meta.url)

export class Database {
  database = {}

  constructor() {
    this.persist()
  }

  persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.database))
  }

  insert(table, data) {
    if (Array.isArray(this.database[table])) {
      this.database[table].push(data)
    } else {
      this.database[table] = [data]
    }
  }

  select(table) {
    return this.database[table]
  }
}
