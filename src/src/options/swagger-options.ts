import {IOptions} from "../options-manager/options";
import {IsOptional, IsString} from "class-validator";

export class SwaggerOptions implements IOptions {
    sectionName: string = 'Swagger';

    @IsString()
    url: string = '/swagger';

    @IsString()
    @IsOptional()
    documentation: string | null = null;
}