import config from 'config';

// dbShema - mongodb or mongodb+srv
export const dbShema: string = config.get('dbShema');
// dbServer - host server
export const dbServer: string = config.get('dbServer');

// dbPort - mongodb port
export const dbPort: number = config.get('dbPort');
// db - database on server
export const database: string = config.get('db');

// Root credentials
export const dbUser: string = config.get('dbUser');
export const dbPassword: string = config.get('dbPassword');

let dbAuth = '';
if (dbUser && dbPassword) {
  dbAuth = dbUser + ':' + dbPassword + '@';
}

export const dbURL = () => {
  const dbURL = `${dbShema}://${dbAuth}${dbServer}:${dbPort}/${database}?authSource=admin`;
  return dbURL;
};
