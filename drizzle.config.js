const { defineConfig } = require('drizzle-kit')

module.exports = defineConfig({
  schema: './src/db/schema.ts',
    out: './drizzle',
    driver: 'expo-sqlite',
    dialect: 'sqlite',
})