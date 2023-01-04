import { OptionsManager } from './src/options-manager/options-manager';
import { ExpressOptions } from "./src/options/express-options";
import { SentryOptions } from "./src/options/sentry-options";
import { SwaggerOptions } from "./src/options/swagger-options";
import { EventSearchOptions } from "./src/options/eventsearch-options";
import { PrismaOptions } from "./src/options/prisma-options";

import express, { Router, Express, json } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import process from "process";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { init, captureException } from '@sentry/node'
import {CaptureContext} from "@sentry/types";
import { NodeOptions } from "@sentry/node/types/types";

type Sentry = {
    init: (options?: NodeOptions) => void,
    captureException: (exception: any, captureContext?: CaptureContext) => any
}

export class BaseStartup {
    express: Express;
    router: Router;
    sentry: Sentry;

    constructor() {
        this.express = express();
        this.router = Router();
        this.sentry = { init, captureException };

        this.configureOptions();

        OptionsManager.validate()
            .then(() => this.configureServices(), () => process.exit(1))
    }

    private async configureRouter() {
        const options: SwaggerOptions | any = OptionsManager.options.Swagger;

        this.router.get('/', (req, res) => {
            res.status(200);
        });

        this.router.get('/status', this.healthCheck);

        if (options.documentation && fs.existsSync(options.documentation)) {
            const swaggerDoc = JSON.parse(fs.readFileSync(options.documentation, 'utf-8'));

            this.router.use(
                options.url,
                async function (req: any, res: any, next: any) {
                    swaggerDoc.host = req.get('host')
                    req.swaggerDoc = swaggerDoc
                    next()
                },

                swaggerUi.serveFiles(swaggerDoc, {}),
                swaggerUi.setup()
            )
        } else {
            console.warn('No Swagger documentation file found, skipping...');
        }

        this.configureExtendedRouter();

        return this;
    }

    private configureServices() {
        const options: ExpressOptions | any = OptionsManager.options.Express;

        this.configureRouter();
        this.configureSentry();
        this.configureExpress();

        this.express.listen(options.port, () => {
            console.log(`Listening on port ${ options.port }...`)

            this.configureExtendedServices()
        })
    }

    private configureExpress() {
        const options: ExpressOptions | any = OptionsManager.options.Express;

        this.express.use(bodyParser.urlencoded({ extended: true }))
        this.express.use(bodyParser.json())
        this.express.use(bodyParser.raw())
        this.express.use(morgan('tiny'))
        this.express.use(json());

        this.express.use(
            cors({
                origin: process.env.CORS_ORIGIN,
                credentials: true,
                methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
            })
        )

        this.express.use(options.namespace, this.router);
    }

    private configureSentry() {
        const options: SentryOptions | any = OptionsManager.options.Sentry;

        this.sentry.init({
            dsn: options.dsn,
            tracesSampleRate: options.tracesSampleRate,
            environment: options.environment,
        })
    }

    private configureOptions(): BaseStartup {
        OptionsManager.readSettings<ExpressOptions>(new ExpressOptions());
        OptionsManager.readSettings<SwaggerOptions>(new SwaggerOptions());
        OptionsManager.readSettings<SentryOptions>(new SentryOptions());

        this.configureExtendedOptions();

        return this;
    }

    // Override these methods to customize startup
    protected healthCheck(req: any, res: any): void {
        res.status(200).json({ status: 'OK' })
    }

    protected configureExtendedRouter(): BaseStartup {
        return this;
    }

    protected configureExtendedOptions(): BaseStartup {
        return this;
    }

    protected configureExtendedServices(): BaseStartup {
        return this;
    }

    protected configurePrisma(): BaseStartup {
        OptionsManager.readSettings<PrismaOptions>(new PrismaOptions());

        return this;
    }

    protected configureEventStore(): BaseStartup {
        OptionsManager.readSettings<EventSearchOptions>(new EventSearchOptions());

        return this;
    }
}