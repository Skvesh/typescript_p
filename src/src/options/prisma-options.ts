import { IOptions } from "../options-manager/options";
import { IsOptional, IsString } from 'class-validator';

export class PrismaOptions implements IOptions {
    readonly sectionName: string = 'Prisma';

    @IsString()
    @IsOptional()
    provider: string = 'postgres';

    @IsString()
    url: string | null = null;
}