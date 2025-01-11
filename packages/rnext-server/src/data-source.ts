import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: ["src/entities/**/*.ts"],  // Adjust path to match your entities
});

// Initialize the DataSource
AppDataSource.initialize()
    .then(() => {
        console.log("DataSource initialized");
    })
    .catch((error) => {
        console.error("Error during DataSource initialization:", error);
    });
