/**
 * Commit
 */

import API from './api';
import SpeckleNode from './Node';
import SpeckleStream from './Stream';


export type CommitData = {
    id: string;
    message: string;
    referencedObject: string;
    authorId: string;
    createdAt: string;
    branchName: string;
    sourceApplication: string;
};

export default class SpeckleCommit extends SpeckleNode<SpeckleStream, CommitData> {

    public get url(): string {
        return `${this.stream.url}/commits/${this.id}`;
    }

    public get stream(): SpeckleStream {
        return this.parent;
    }

    protected async fetch() {
        const res =  await API.query(
            this.stream.app.server, 
            this.stream.app.token, 
            `query StreamCommitQuery($streamId: String!, $id: String!) {
                stream(id: $streamId) {
                    commit(id: $id) {
                        message
                        referencedObject
                        authorId
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

        return { ...res.data.stream.commit, id: this.id };
    }

    
}
