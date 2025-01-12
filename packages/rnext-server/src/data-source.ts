import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "..", "rnext", "database.sqlite"), // Use path.join for cross-platform compatibility
    synchronize: false, //todo: change this to false
    logging: true,
    entities: [path.join(__dirname, "..", "rnext", "entities", "**", "*.ts")], // Adjust entities path
});
console.log("\nDATA SOURCE PATH:::",path.join(__dirname, "..", "rnext", "entities", "**", "*.ts"));

// Initialize the DataSource
AppDataSource.initialize()
    .then(() => {
        console.log("DataSource initialized");
    })
    .catch((error) => {
        console.error("Error during DataSource initialization:", error);
    });
