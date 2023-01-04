import { IOptions } from "../src/options-manager/options";
import {
    Contains,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    IsOptional,
    Min,
    Max,
    IsInt
} from 'class-validator';
import { Type } from "class-transformer";

export class ExampleConfig implements IOptions {
    readonly sectionName: string = 'example';

    @Length(10, 20)
    @IsOptional()
    title: string | null = null;

    @Contains('hello')
    @IsOptional()
    text: string | null = null;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(10)
    rating: number | null = null;

    @IsEmail()
    @IsOptional()
    email: string | null = null;

    @IsFQDN()
    @IsOptional()
    site: string | null = null;

    @IsDate()
    @IsOptional()
    createDate: Date | null = null;
}