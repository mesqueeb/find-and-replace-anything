declare type IConfig = {
    onlyPlainObjects: boolean;
};
/**
 * Goes through an object recursively and replaces all occurences of the `find` value with `replaceWith`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} find val to find
 * @param {*} replaceWith val to replace
 * @param {IConfig} [config={onlyPlainObjects: false}]
 * @returns {*} the target with replaced values
 */
export declare function findAndReplace(target: any, find: any, replaceWith: any, config?: IConfig): any;
/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} checkFn a function that will receive the `foundVal`
 * @returns {*} the target with replaced values
 */
export declare function findAndReplaceIf(target: any, checkFn: (foundVal: any) => any): any;
export {};
