import { IOptions } from '../options-manager/options';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ExpressOptions implements IOptions {
    sectionName: string = 'Express';

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    port: number = 3000;

    @IsString()
    @IsOptional()
    namespace: string = '/';
}