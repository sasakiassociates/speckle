/**
 * Author
 */

import API from './api';
import SpeckleNode from './Node';
import SpeckleApp from "./Speckle";

export type UserData = {
    id: string;
    email: string;
    name: string;
    bio: string;
    company: string;
    avatar: string;
    verified: string;
    profiles: string;
    role: string;
    suuid: string;
};

export default class SpeckleUser extends SpeckleNode<SpeckleApp, UserData> {

    public get url(): string {
        return this.app.server;
    }

    public get app(): SpeckleApp {
        return this.parent;
    }

    protected async fetch() {
        if (this.app.token === null) {
            console.log("Token is necessary for fetching User Data")
            return
        }

        const res = await API.query(
            this.app.server,
            this.app.token,
            `query User($id: String!) {
                user(id: $id) {
                    id
                    email
                    name
                    bio
                    company
                    avatar
                    verified
                    profiles
                    role
                    suuid
                }
            }`,
            {
                id: this.id,
            }
        );

        return { ...res.data, id: this.id };

    }


}
