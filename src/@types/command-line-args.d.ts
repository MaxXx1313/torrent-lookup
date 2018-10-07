/**
 * Created by maksim on 23/12/16.
 */


declare module "command-line-args" {

    export function commandLineArgs(definitions:Object, arg:any[]): Object;

}

declare module "command-line-usage" {

    export function commandLineUsage(sections:any[]): string;

}