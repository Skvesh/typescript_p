import { BaseStartup } from '../base-startup';
import { ExampleConfig } from './example-config';
import { OptionsManager } from '../src/options-manager/options-manager';

export class SampleAppStartup extends BaseStartup {
    override configureExtendedOptions(): SampleAppStartup {
        OptionsManager.readSettings<ExampleConfig>(new ExampleConfig())

        return this;
    }
}
