/**
 * Speckle
 */

import { SpeckleConfig } from './types';
import SpeckleStream from './Stream';

import API from './api';


export default class SpeckleApp {

    public readonly server: string;
    public readonly token: string;

    constructor(args: SpeckleConfig) {
        this.server = args.server || 'https://speckle.xyz';
        this.token = args.token;
    }

    public Stream(id: string): SpeckleStream {
        return new SpeckleStream(id, this);
    }

    public get streams(): Promise<object> {
        return API.query(this.server, this.token, `query {
            streams {
                totalCount
                items {
                    id
                    name
                    updatedAt
                }
            }
        }`);
    }
    
};
