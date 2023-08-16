/**
 * Model (branch)
 */


import API from './api';
import SpeckleNode from './Node';
import Project from './Project';


export type ModelData = {
    id: string;
    name: string;
    author: {};
    versions: [];
    createdAt: string;
    activity : [];
};

export default class Model extends SpeckleNode<Project, ModelData> {

    public get url(): string {
        return `${this.project.url}/branches/${this.id}`;
    }

    public get project(): Project {
        return this.parent;
    }

    protected async fetch() {
        const res =  await API.query(
            this.project.app.server, 
            this.project.app.token, 
            `query projectCommitQuery($projectId: String!, $name: String!) {
                stream(id: $projectId) {
                    branch(name: $name) {
                      createdAt
                      description
                      name
                      author {
                        email
                        name
                        role
                        avatar
                      }
                      commits {
                        cursor
                        items {
                          id
                          authorAvatar
                          authorName
                          createdAt
                          message
                          referencedObject
                          totalChildrenCount
                        }
                        }
                      }
                    }
                  }
            }`, 
            { 
                name: this.id,
                projectId: this.project.id,
            }
        );

        // does this need to be mapped to the previous version?
        return { ...res.data.stream.commit, id: this.id };
    }

    
}
