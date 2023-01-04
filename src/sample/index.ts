import 'reflect-metadata';

import { SampleAppStartup } from "./example-app-startup";
import * as dotenv from 'dotenv';

// create .env file or load environment variables before app start
dotenv.config();

const app = new SampleAppStartup();
