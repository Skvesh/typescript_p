# TypeScript Boilerplate Code

TypeScript boilerplate code to generate a schlieger compatible miscroservice out of the box.

Services set up by default
* Express Server
* Swagger UI
* Sentry Log

Other basic options available
* Prisma
* EventStore

## Installation

`npm install @schlieger/bpc-typescript`

## Usage

### Basic

1. Import the `base-startup.ts` in your entry file
    * `import { BaseStartup } from 'base-startup'`
2. Load all required environment variables
    * environment variables need to have following structure
        * `SECTION__VARIABLE=<value>`
        * eg. `EXPRESS__PORT=80`
3. Create an instance of `BaseStartup`
   ```typescript
    const app = new BaseStartup();
    app.init();
    ```

### Custom Startup Class

Check [sample app](sample/index.ts) to see how to create a custom startup class.

### Using class-transformer

To use class-transformer methods you need to import `reflect-metadata` in your entry file, on the first line.
