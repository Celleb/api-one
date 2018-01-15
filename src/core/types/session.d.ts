/**
 * session.d.ts
 *
 * @author Jonas Tomanga <celleb@mrcelleb.com>
 * @copyright (c) 2017 Jonas Tomanga
 * All rights reserved
 * @license MIT
 */
export interface Session {
    uid?: string | number;
    [other: string]: any;
}