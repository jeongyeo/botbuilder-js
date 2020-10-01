/**
 * @module botbuilder-dialogs
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Converter, Converters } from './converter';

/**
 * Base class for all configurable classes.
 */
export abstract class Configurable {
    /**
     * Fluent method for configuring the object.
     * @param config Configuration settings to apply.
     */
    public configure(config: object): this {
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                const setting = config[key];
                if (this.converters && this.converters[key] && typeof this.converters[key] === 'object') {
                    const converter = this.converters[key] as Converter<any, any>;
                    this[key] = converter.convert(setting);
                } else {
                    if (Array.isArray(setting)) {
                        this[key] = setting;
                    } else if (typeof setting == 'object') {
                        if (typeof this[key] == 'object') {
                            // Apply as a map update
                            for (const child in setting) {
                                if (setting.hasOwnProperty(child)) {
                                    this[key][child] = setting[child];
                                }
                            }
                        } else {
                            this[key] = setting;
                        }
                    } else if (setting !== undefined) {
                        this[key] = setting;
                    }
                }
            }
        }
        return this;
    }

    public converters?: Converters<any>;
}