/**
 * Stream
 */

import API from './api';
import SpeckleNode from './Node';
import SpeckleObject from './Object';
import SpeckleApp from './Speckle';
import SpeckleCommit from './Commit';
import { SpeckleBaseObject } from './types';


export default class Stream extends SpeckleNode<SpeckleApp> {

    public get url(): string {
        return `${this.app.server}/streams/${this.id}`;
    }

    public get app(): SpeckleApp {
        return this.parent;
    }

    public Object(id: string): SpeckleObject {
        return new SpeckleObject(id, this);
    }
    
    public Commit(id: string): SpeckleCommit {
        return new SpeckleCommit(id, this);
    }

    public async commit(obj: SpeckleObject, message: string = "data from @strategies/speckle", branchName: string = 'main') {
        return API.query(
            this.parent.server, 
            this.parent.token, 
            `mutation commitCreate($commit: CommitCreateInput!){ 
                commitCreate(commit: $commit)
            }`,
            {
                commit: {
                    streamId: this.id,
                    objectId: obj.id,
                    sourceApplication: `@strategies/speckle`,
                    branchName,
                    message,
                }
            }
        );
    }

    public async writeAndCommitObject(obj: SpeckleBaseObject, message?: string, branchName?: string): Promise<SpeckleObject> {
        const newObject = this.Object(obj.id);

        await this.commit(
            await newObject.write(obj), 
            message, 
            branchName
        );

        return newObject;
    }

    public get branches(): Promise<object> {
        return API.query(
            this.app.server, 
            this.app.token, 
            `query Stream($id: String!) {
                stream(id: $id) {
                    branches {
                        totalCount
                        items {
                            id
                            name
                            description
                            commits(limit: 4) {
                                totalCount
                                items {
                                    id
                                    authorId
                                    authorName
                                    authorAvatar
                                    createdAt
                                    message
                                    referencedObject
                                    branchName
                                    sourceApplication
                                }
                            }
                        }
                    }
                 }
            }`, 
            { id: this.id }
        );
    }

    public get collaborators(): Promise<object> {
        return API.query(
            this.app.server, 
            this.app.token, 
            `query Stream($id: String!) {
                stream(id: $id) {
                    collaborators {
                        id
                        name
                        role
                        company
                        avatar
                    }
                }
            }`, 
            { id: this.id }
        );
    }

    protected async fetch() {
        return API.query(
            this.app.server, 
            this.app.token, 
            `query Stream($id: String!) {
                stream(id: $id) {
                    id
                    name
                    description
                    isPublic
                    createdAt
                    updatedAt
                    role
                }
            }`, 
            { id: this.id }
        );
    }

}
