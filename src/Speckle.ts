/**
 * Speckle
 */

import { SpeckleConfig } from './types';
import SpeckleStream from './Stream';
import SpeckleUser, { UserData } from "./User";
import API from './api';
import md5 from "md5";

export default class SpeckleApp {

    public readonly server: string = 'https://speckle.xyz';
    public readonly token?: string;

    constructor(args?: SpeckleConfig) {
        if (args) {
            this.server = args.server || this.server;
            this.token = args.token;
        }
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

    public get activeUser(): Promise<UserData>{
        return API.query(this.server, this.token, `query{
            activeUser {
                name
                avatar
                bio
                company
                email
                id
                role
                verified
                streams{
                    cursor
                    totalCount
                    items{
                        id
                        name
                        isPublic
                        size
                    }
                }

            }
        }`)
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
