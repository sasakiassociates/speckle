/**
 * API Node
 */

import SpeckleApp from './Speckle';
import SpeckleCommit from './Commit';
import SpeckleStream from './Stream';
import SpeckleObject from './Object';


type Nodes = SpeckleNode<Nodes> | SpeckleApp | SpeckleStream | SpeckleObject | SpeckleCommit;

export default abstract class SpeckleNode<Parent extends Nodes, ReturnType extends object = object> {

    public readonly id: string;
    public readonly parent: Parent;
    protected payload: ReturnType = {} as ReturnType;
    private _hasBeenFetched: boolean = false;

    constructor(id: string, parent: Parent) {
        this.id = id;
        this.parent = parent;
    }

    public abstract get url(): string;

    protected abstract fetch(): Promise<ReturnType>;

    public get get(): Promise<ReturnType> {
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

    public async refresh(): Promise<ReturnType> {
        this._hasBeenFetched = false;
        return this.payload;
    }

}
