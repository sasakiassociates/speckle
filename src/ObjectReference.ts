/**
 * Object Reference
 */

import ObjectLoader from '@speckle/objectloader';

import API from './api';
import Node from './Node';
import Project from './Project';
import { SpeckleBaseObject } from './types';
import md5 from "md5";


export default class ObjectReference extends Node<Project> {

    protected readonly loader: any;

    constructor(id: string | undefined, stream: Project) {
        if (id === undefined)
            id = md5((new Date()).toString());

        super(id, stream);

        this.loader = new ObjectLoader({
            serverUrl: stream.app.server,
            token: stream.app.token,
            streamId: stream.id,
            objectId: id,
        });
    }

    public get url(): string  {
        return `${this.project.url}/objects/${this.id}`;
    }

    public get project(): Project {
        return this.parent;
    }


    public async write(obj: SpeckleBaseObject): Promise<ObjectReference> {
        await API.query(
            this.project.app.server,
            this.project.app.token,
            `mutation objectCreate ($object: ObjectCreateInput!) {
                objectCreate(objectInput: $object)
            }`,
            {
                object: {
                    streamId: this.project.id,
                    objects: [obj],
                },
            }
        );

        this.payload = obj;
        //this._hasBeenFetched = true;

        return this;
    }

    public iterator() {
        return this.loader.getObjectIterator();
    }

    protected async fetch(): Promise<object> {
        return this.loader.getAndConstructObject();
    }


}
