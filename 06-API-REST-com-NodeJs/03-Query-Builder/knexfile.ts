export default {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  useNullAsDefault: true,
  migrations: {
    extensitons: 'ts',
    directory: './src/database/migrations',
  },
  seeds: {
    extensitons: 'ts',
    directory: './src/database/seeds',
  },
}
