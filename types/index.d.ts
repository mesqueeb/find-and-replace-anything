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
declare function findAndReplaceRecursively(target: any, find: any, replaceWith: any, config?: IConfig): any;
export default findAndReplaceRecursively;
