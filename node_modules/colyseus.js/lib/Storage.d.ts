/**
 * We do not assign 'storage' to window.localStorage immediatelly for React
 * Native compatibility. window.localStorage is not present when this module is
 * loaded.
 */
export declare function setItem(key: string, value: string): void;
export declare function removeItem(key: string): void;
export declare function getItem(key: string, callback: Function): void;
