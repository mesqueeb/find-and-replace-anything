declare type Config = {
    onlyPlainObjects?: boolean;
    checkArrayValues?: boolean;
};
/**
 * Goes through an object recursively and replaces all occurences of the `find` value with `replaceWith`. Also works no non-objects.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {*} find val to find
 * @param {*} replaceWith val to replace
 * @param {Config} [config={onlyPlainObjects: false, checkArrayValues: false}]
 * @returns {*} the target with replaced values
 */
export declare function findAndReplace(target: any, find: any, replaceWith: any, config?: Config): any;
export declare function _findAndReplaceIf(target: any, checkFn: (foundVal: any, propKey: string | undefined) => any, propKey: string | undefined, config?: Config): any;
/**
 * Goes through an object recursively and replaces all props with what's is returned in the `checkFn`. Also works on non-objects. `checkFn` is triggered on every single level of any value/object.
 *
 * @export
 * @param {*} target Target can be anything
 * @param {(foundVal: any, propKey: string | undefined) => any} checkFn a function that will receive the `foundVal`
 * @param {Config} [config={onlyPlainObjects: true, checkArrayValues: false}]
 * @returns {*} the target with replaced values
 */
export declare function findAndReplaceIf(target: any, checkFn: (foundVal: any, propKey: string | undefined) => any, config?: Config): any;
export {};
