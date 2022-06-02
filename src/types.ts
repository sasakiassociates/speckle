/**
 * Types
 */

export type SpeckleConfig = {
    server?: string;
    token?: string;
}

export type SpeckleAppConfig = {
    id: string;
    name: string;
    secret: string;
}

export type SpeckleBaseObject = {
    id: string;
    speckle_type: string;
    data: object;
};
