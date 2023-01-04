import { validateSync, ValidationError } from 'class-validator';
import { plainToClassFromExist } from "class-transformer";
import { IOptions } from './options';

export class OptionsManager {
    private static validationErrors: {[key: string]: ValidationError[]} = {};
    public static options: {[key: string]: IOptions} = {};


    public static readSettings<T extends IOptions>(options: T) {
        const sectionName: string = options.sectionName;
        const properties: string[] = Object.getOwnPropertyNames(options);
        let settings = {};

        properties.forEach((property) => {
            const envKey: string = sectionName.toUpperCase() + "__" + property.toUpperCase();
            const envValue: string | undefined = process.env[envKey];

            if (envValue) {
                (settings as any)[property] = envValue;
            }
        })

        options = plainToClassFromExist(options, settings);

        if (options) {
            OptionsManager.options[sectionName] = options;
        }
    };


    public static validate() {
        return new Promise((resolve, reject) => {
            let isValid: boolean = true;

            Object.keys(OptionsManager.options).forEach((key) => {
                const option = OptionsManager.options[key];
                OptionsManager.validationErrors[option.sectionName] = [];

                const validationErrors: ValidationError[] = validateSync(option);

                if (validationErrors.length === 0) {
                    return
                }

                isValid = false;
                OptionsManager.validationErrors[option.sectionName].push(...validationErrors);

                console.log(`Invalid environment variables in section ${ option.sectionName }`);
                validationErrors.forEach(err => {
                    console.log(err.constraints);
                })
            })


            if (isValid) {
                return resolve(true);
            }

            reject(new Error('Invalid environment variables'));
        })
    };
}