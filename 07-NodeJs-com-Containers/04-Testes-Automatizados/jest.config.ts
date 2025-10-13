// Esse arquivo foi feito manualmente, mas é possível gera-lo utilizando o comando npx jest --init

import type { Config } from 'jest'

const config: Config = {
  bail: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
}

export default config
