import config from 'config';

export default function () {
  if (!config.get('dbServer')) {
    throw new Error('FATAL ERROR: "NOTES_MONGODB_SERVER" server enviroment varaible is not defined.');
  }
}
