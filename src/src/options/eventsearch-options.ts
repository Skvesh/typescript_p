import { IOptions } from "../options-manager/options";
import { IsString } from "class-validator";

export class EventSearchOptions implements IOptions {
    readonly sectionName: string = 'EventStore';

    @IsString()
    url: string | null = null;
}