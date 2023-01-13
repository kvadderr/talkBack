const dotenv = require('dotenv');
dotenv.config();

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  name: 'default',
  type: 'postgres',
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRESS_PASSWORD,
  synchronize: false,
  entities: ['src/**/*.model{.ts,.js}'],
  migrations: ['typeorm_migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
  seeds: ['seeds/*{.ts,.js}'],
  cli: {
    migrationsDir: 'typeorm_migrations',
  },
};
