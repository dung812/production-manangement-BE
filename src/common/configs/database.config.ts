import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export interface DatabaseConfig {
  url?: string;
  type: string;
  host: string;
  port: number;
  password: string;
  name: string;
  username: string;
  synchronize: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  const config: DatabaseConfig = {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || '',
    username: process.env.DATABASE_USERNAME || '',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };

  return config;
});

export const getTypeOrmConfig = (): DataSourceOptions => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      autoLoadEntities: true,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DATABASE_SSL_ENABLED === 'true' ? {
        rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
      } : false,
    } as DataSourceOptions;
  }

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    username: process.env.DATABASE_USERNAME || '',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || '',
    autoLoadEntities: true,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.DATABASE_SSL_ENABLED === 'true' ? {
      rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    } : false,
  } as DataSourceOptions;
};
