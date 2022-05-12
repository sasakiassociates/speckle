/**
 * Commit
 */

import API from './api';
import SpeckleNode from './Node';
import SpeckleStream from './Stream';


export default class SpeckleCommit extends SpeckleNode<SpeckleStream> {

    public get stream(): SpeckleStream {
        return this.parent;
    }

    protected async fetch(): Promise<object> {
        return API.query(
            this.stream.app.server, 
            this.stream.app.token, 
            `query StreamCommitQuery($streamId: String!, $id: String!) {
                stream(id: $streamId) {
                    id
                    name
                    role
                    commit(id: $id) {
                        id
                        message
                        referencedObject
                        authorName
                        authorId
                        authorAvatar
                        createdAt
                        branchName
                        sourceApplication
                    }
                }
            }`, 
            { 
                id: this.id,
                streamId: this.stream.id,
            }
        );

    }

    
}
