/**
 * schema-add-ons.d.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
import { Index } from '../';

export interface SchemaAddOns {
    [other: string]: any;
    ai?: boolean
}