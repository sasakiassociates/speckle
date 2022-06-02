/**
 * Speckle
 */

import { SpeckleConfig } from './types';
import SpeckleStream from './Stream';
import SpeckleUser, { UserData } from "./User";
import API from './api';
import md5 from "md5";

export default class SpeckleApp {

    public readonly server: string;
    public readonly token?: string;

    constructor(args: SpeckleConfig) {
        this.server = args.server || 'https://speckle.xyz';
        this.token = args.token;
    }

    public get getId(): string {
        return md5((new Date()).toString());
    }

    public async User(id: string): Promise<UserData> {
        return await new SpeckleUser(id, this).get;
    }

    public Stream(id: string): SpeckleStream {
        return new SpeckleStream(id, this);
    }

    public get streams(): Promise<object> {
        return API.query(this.server, this.token, `query {
            streams {
                totalCount
                items {
                    id
                    name
                    updatedAt
                }
            }
        }`);
    }

};
