/**
 * Version (commit)
 */

import API from './api';
import SpeckleNode from './Node';
import Project from './Project';


export type VersionData = {
    id: string;
    message: string;
    referencedObject: string;
    authorId: string;
    createdAt: string;
    branchName: string;
    sourceApplication: string;
};

export default class Version extends SpeckleNode<Project, VersionData> {

    public get url(): string {
        return `${this.project.url}/commits/${this.id}`;
    }

    public get project(): Project {
        return this.parent;
    }

    protected async fetch() {
        const res =  await API.query(
            this.project.app.server, 
            this.project.app.token, 
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
                streamId: this.project.id,
            }
        );

        return { ...res.data.stream.commit, id: this.id };
    }

    
}
