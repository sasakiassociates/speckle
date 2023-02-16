/**
 * SpeckleObject
 */

import ObjectLoader from '@speckle/objectloader';

import API from './api';
import SpeckleNode from './Node';
import SpeckleStream from './Stream';
import { SpeckleBaseObject } from './types';
import md5 from "md5";


export default class SpeckleObject extends SpeckleNode<SpeckleStream> {

    protected readonly loader: any;

    constructor(id: string | undefined, stream: SpeckleStream) {
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
        return `${this.stream.url}/objects/${this.id}`;
    }

    public get stream(): SpeckleStream {
        return this.parent;
    }


    public async write(obj: SpeckleBaseObject): Promise<SpeckleObject> {
        await API.query(
            this.stream.app.server,
            this.stream.app.token,
            `mutation objectCreate ($object: ObjectCreateInput!) {
                objectCreate(objectInput: $object)
            }`,
            {
                object: {
                    streamId: this.stream.id,
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
