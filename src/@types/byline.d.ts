/**
 * Created by maksim on 06/11/16.
 */


/// <reference path="../../node_modules/@types/node/index.d.ts"/>

declare module "byline" {

    import ReadableStream = NodeJS.ReadableStream;

    interface Options {
        [args:string]: any;
        keepEmptyLines?:boolean;
    }

    export function LineStream(options?:Options):void;

    export function createStream(readStream:ReadableStream, options);
    export {createStream as createLineStream};
}