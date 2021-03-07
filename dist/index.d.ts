import "fast-text-encoding";
export declare const embed: (text: string, data: string | Uint8Array, option?: {
    repeat?: number | undefined;
} | undefined) => string;
export declare const extract: (text: string, option?: {
    outputType?: "string" | "Uint8Array" | undefined;
} | undefined) => string | Uint8Array;
