import "dotenv/config";
import { DataSource } from "typeorm";

export default class PostgresTypeORMConnection {
  private static connections: Map<string, DataSource> = new Map();
  static datasource: DataSource;

  static async connection(connectionName: string = "default") {
    const ds = new DataSource({
      name: connectionName,
      type: "postgres",
      host: process.env.DATABASE__POSTGRESQL__HOST!,
      port: Number(process.env.DATABASE__POSTGRESQL__PORT) || 5432,
      username: process.env.DATABASE__POSTGRESQL__USERNAME!,
      password: process.env.DATABASE__POSTGRESQL__PASSWORD!,
      database: process.env.DATABASE__POSTGRESQL__DATABASE!,
      synchronize: process.env.DATABASE__POSTGRESQL__SYNCHRONIZE?.toLowerCase() === "true",
      logging: process.env.DATABASE__POSTGRESQL__LOGGING?.toLowerCase() === "true",
      entities: [process.env.DATABASE__POSTGRESQL__ENTITIES!],
    });

    await ds.initialize();

    PostgresTypeORMConnection.datasource = ds;
    PostgresTypeORMConnection.connections.set(connectionName, ds);

    console.log(`✅ Data Source [${connectionName}] has been initialized!`);
    return ds;
  }

  static getConnected(connectionName: string = "default"): DataSource {
    const connection = this.connections.get(connectionName);
    if (!connection) {
      throw new Error(`Connection '${connectionName}' is not connected yet!`);
    }
    return connection;
  }
}