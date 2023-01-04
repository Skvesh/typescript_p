import { IOptions } from "../options-manager/options";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class SentryOptions implements IOptions {
    sectionName: string = 'Sentry';

    @IsString()
    dsn: string | null = null;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    tracesSampleRate: number = 1.0

    @IsString()
    @IsOptional()
    environment: string | null = process.env.ENV || 'develop';
}