/**
 * API Node
 */

import SpeckleApp from './Speckle';
import SpeckleCommit from './Commit';
import SpeckleStream from './Stream';
import SpeckleObject from './Object';


type Nodes = SpeckleApp | SpeckleStream | SpeckleObject | SpeckleCommit;

export default abstract class SpeckleNode<T extends Nodes> {

    public readonly id: string;
    public readonly parent: T;
    protected payload: object = {};
    private _hasBeenFetched: boolean = false;

    constructor(id: string, parent: T) {
        this.id = id;
        this.parent = parent;
    }

    protected abstract fetch(): Promise<object>;

    public get data(): Promise<object> {
        return (async () => {
            if (!this.hasBeenFetched) {
                this.payload = await this.fetch();
                this._hasBeenFetched = true;
            }

            return this.payload;
        })();
    }

    public get hasBeenFetched(): boolean {
        return this._hasBeenFetched;
    }

    public async reload(): Promise<object> {
        this._hasBeenFetched = false;
        return this.data;
    }

}
