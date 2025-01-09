import express from "express";
import type { Express } from "express";
import { NextServer } from "next/dist/server/next";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

export interface RNextServerOptions {
    app: NextServer;
}

export interface ServerError extends Error {
    code?: string;
}

export class RNextServer {
    private app: NextServer;
    private server: Express;
    private readonly cmsBuildDir: string;

    constructor({ app }: RNextServerOptions) {
        this.app = app;
        this.server = express();

        // Handle ESM __dirname equivalent
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Set the directory for cms-build
        this.cmsBuildDir = path.join(__dirname, "cms-build");

        // Verify cms-build directory exists
        try {
            if (!fs.existsSync(this.cmsBuildDir)) {
                console.error(`CMS build directory not found at: ${this.cmsBuildDir}`);
                throw new Error('CMS build directory not found');
            }
        } catch (error) {
            console.error('Error checking cms-build directory:', error);
        }
    }

    public listen = async (port: number, callback?: () => void): Promise<void> => {
        try {
            await this.app.prepare();
            const handle = this.app.getRequestHandler();

            // Serve the index.html for the root admin route
            this.server.get(["/rnext-admin", "/rnext-admin/"], (req, res) => {
                const indexPath = path.join(this.cmsBuildDir, "index.html");
                console.log(`Serving index.html from: ${indexPath}`);
                res.sendFile(indexPath, (err) => {
                    if (err) {
                        console.error('Error serving index.html:', err);
                        res.status(500).send('Error loading admin panel');
                    }
                });
            });

            // Serve static assets from cms-build directory
            this.server.use(
                "/",
                (req, res, next) => {
                    // Only handle requests for assets and vite.svg
                    if (req.path.startsWith('/assets/') || req.path === '/vite.svg') {
                        console.log(`Static request for: ${req.path}`);
                        console.log(`Looking in: ${this.cmsBuildDir}`);
                        const filePath = path.join(this.cmsBuildDir, req.path);

                        // Check if file exists
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

            // Handle all other admin routes - serve index.html for client-side routing
            this.server.get("/rnext-admin/*", (req, res) => {
                const indexPath = path.join(this.cmsBuildDir, "index.html");
                console.log(`Serving index.html for route ${req.path} from: ${indexPath}`);
                res.sendFile(indexPath, (err) => {
                    if (err) {
                        console.error('Error serving index.html:', err);
                        res.status(500).send('Error loading admin panel');
                    }
                });
            });

            // Handle Next.js requests
            this.server.all("*", (req, res) => {
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