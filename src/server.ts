import dotenv from 'dotenv';
import app from './app';
import 'reflect-metadata';
import connection from './database/Connection';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev'
})

connection.create();

app.listen(3333, () => {
  console.log(process.env.DB_DATABASE);
  console.log('Running Server');
});
