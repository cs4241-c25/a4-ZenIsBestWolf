import mongoose from 'mongoose';
import 'dotenv/config';

class DB {
  private connection: typeof mongoose | undefined;
  public constructor(uri?: string) {
    void mongoose
      .connect(uri ?? process.env.MONGO_URI ?? '')
      .then((connection) => {
        this.connection = connection;
        console.log('Established connection to MongoDB.');
      })
      .catch(() => {
        throw new Error(
          `An error occurred while trying to establish a connection to MongoDB. ${uri === undefined && process.env.MONGO_URI === undefined ? 'No URI was provided.' : `Is the URI correct? URI: ${uri ?? process.env.MONGO_URI}`}`,
        );
      });
  }

  public getConnection() {
    if (!this.connection) {
      throw new Error(`Database is not connected.`);
    }

    return this.connection;
  }
}

let initializedDatabase: DB | undefined = undefined;

export const initDB = (uri?: string) => {
  if (!initializedDatabase) {
    initializedDatabase = new DB(uri);
  }

  return initializedDatabase;
};
