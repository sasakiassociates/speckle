/**
 * Stream
 */

import API from './api';
import SpeckleNode from './Node';
import SpeckleObject from './Object';
import SpeckleApp from './Speckle';
import { SpeckleBaseObject } from './types';


export default class Stream extends SpeckleNode<SpeckleApp> {

    public cursor?: string;
    public items?: { id: string, name: string, updateAt: string }[];
    public totalCount?: number;

    public get app(): SpeckleApp {
        return this.parent;
    }

    public Object(id: string): SpeckleObject {
        return new SpeckleObject(id, this);
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

    protected async fetch() {
        return API.query(
            this.app.server, 
            this.app.token, 
            `query { 
              streams(query: $streamId) {
                totalCount
                cursor
                items {
                  id
                  name
                  updatedAt
                }
              }
            }`, 
            { streamId: this.id }
        );
    }

}
