import express from "express";
import type {Express, Request, Response} from "express";
import {NextServer} from "next/dist/server/next";
import path from "path";
import {fileURLToPath} from 'url';
import fs from 'fs';
import {AppDataSource} from "./data-source.ts";
import schemaRouter from "./apis/schemas/schema.route.ts";
import SchemaController from "./apis/schemas/schema.controller.ts";
import apiRoutes from "./apis/api.routes.ts";

export interface RNextServerOptions {
    app?: NextServer;
}

export interface ServerError extends Error {
    code?: string;
}

export class RNextServer {
    private app?: NextServer;
    private server: Express;
    private readonly cmsBuildDir: string;

    constructor(options: RNextServerOptions) {
        this.app = options?.app;
        this.server = express();
        this.initializeMiddleware();

        AppDataSource.initialize()
            .then(() => console.log("Database connected!"))
            .catch((err) => console.error("Database connection error:", err));

        new SchemaController()._syncSchema()

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        this.cmsBuildDir = path.join(__dirname, "cms-build");

        try {
            if (!fs.existsSync(this.cmsBuildDir)) {
                console.error(`CMS build directory not found at: ${this.cmsBuildDir}`);
                throw new Error('CMS build directory not found');
            }
        } catch (error) {
            console.error('Error checking cms-build directory:', error);
        }
    }

    private initializeMiddleware = async () => {
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: true}));
    }

    public listen = async (port: number, callback?: () => void): Promise<void> => {
        try {
            if (this.app) {
                await this.app.prepare();
            }
            const handle = this.app ? this.app.getRequestHandler() : (req: Request, res: Response) => res.status(404).send('Not Found');

            this.server.get(["/rnext-admin", "/rnext-admin/"], (req, res) => {
                const indexPath = path.join(this.cmsBuildDir, "index.html");
                console.log(`Serving index.html from: ${indexPath}`);
                res.sendFile(indexPath, (err) => {
                    if (err) {
                        console.error('Error serving index.html:', err);
                        res.status(500).send('Error loading schemas panel');
                    }
                });
            });

            this.server.use(
                "/",
                (req, res, next) => {
                    if (req.path.startsWith('/assets/') || req.path === '/vite.svg') {
                        console.log(`Static request for: ${req.path}`);
                        console.log(`Looking in: ${this.cmsBuildDir}`);
                        const filePath = path.join(this.cmsBuildDir, req.path);

                        if (fs.existsSync(filePath)) {
                            res.sendFile(filePath, (err) => {
                                if (err) {
                                    console.error(`Error serving ${req.path}:`, err);
                                    res.status(500).send('Error loading asset');
                                }
                            });
                        } else {
                            console.error(`File not found: ${filePath}`);
                            next();
                        }
                    } else {
                        next();
                    }
                }
            );

            this.server.use('/rnext-admin/api', apiRoutes);
            this.server.get("/rnext-admin/*", (req, res) => {
                const indexPath = path.join(this.cmsBuildDir, "index.html");
                console.log(`Serving index.html for route ${req.path} from: ${indexPath}`);
                res.sendFile(indexPath, (err) => {
                    if (err) {
                        console.error('Error serving index.html:', err);
                        res.status(500).send('Error loading schemas panel');
                    }
                });
            });


            //@ts-ignore
            this.server.all("*", (req, res) => {
                //@ts-ignore
                return handle(req, res);
            });

            this.server
                .listen(port, () => {
                    console.log(`> Ready on http://localhost:${port}`);
                    console.log(
                        `> CMS available on http://localhost:${port}/rnext-admin`
                    );
                    console.log(`> CMS files serving from: ${this.cmsBuildDir}`);
                    if (callback) callback();
                })
                .on("error", (err: ServerError) => {
                    if (err.code === "EADDRINUSE") {
                        console.error(`Port ${port} is already in use`);
                    } else {
                        console.error("Server error:", err);
                    }
                    process.exit(1);
                });
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    };
}

const server = new RNextServer({});
server.listen(3000);