/**
 * Project (stream)
 */

import API from './api';
import Node from './Node';
import ObjectRef from './ObjectReference';
import Speckle from './Speckle';
import Version from './Version';
import { SpeckleBaseObject } from './types';


export default class extends Node<Speckle> {

    public get url(): string {
        return `${this.app.server}/streams/${this.id}`;
    }

    public get app(): Speckle {
        return this.parent;
    }

    public Object(id: string): ObjectRef {
        return new ObjectRef(id, this);
    }
    
    public Version(id: string): Version {
        return new Version(id, this);
    }

    public async commit(obj: ObjectRef, message: string = "data from @strategies/speckle", branchName: string = 'main') {
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

    public async writeAndCommitObject(obj: SpeckleBaseObject, message?: string, branchName?: string): Promise<ObjectRef> {
        const newObject = this.Object(obj.id);

        await this.commit(
            await newObject.write(obj), 
            message, 
            branchName
        );

        return newObject;
    }

    public get models(): Promise<object> {
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
