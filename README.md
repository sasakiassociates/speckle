# @strategies/speckle

A TypeScript client for Speckle's API. The client was designed with a node ref pattern, allowing you to build references to data nodes in the API and only resolve them when they are needed.


## Install
```
yarn add @strategies/speckle
```

## Usage

### Setup

You start by creating your client:
```ts
import { Speckle } from '@strategies/speckle';

const api = new Speckle({
	server: 'https://speckle.domain.com' // defaults to https://speckle.xyz
	token: 'geasgweagenwlenlaksegnelw'   // optional, unless private
});
```

### Reading Data

From the root object, you can resolve `streams`:  
```ts
const streams = await api.streams;
```

Once you know the `id` of the stream you want, you can create a reference to it:
```ts
const stream = api.Stream('dgaease');
```

The client uses a node ref pattern where you create reference objects that map onto the identifiable API nodes. When you created the stream above, you didn't load anything from the API yet; you have created only a reference to that node. Now that you have a reference, you can carry it around in your application until you need it, allowing you to start mapping out the API dependencies for each component in your app.

Once you need data from a reference, you can resolve it:
```ts
let streamData = await stream.get;
```

This will return data about the stream you have referenced. Once resolved, it will remain cached so that `await stream.get` will resolve immediately the next times it is called. If you need to refresh the cached data:
```ts
streamData = await stream.refresh();
```

Other information you can read regarding the stream are:
```ts
const branches = await stream.branches;
const collaborates = await stream.collaborators;
```

Other nodes you can access from the stream are:
```ts
const commit = stream.Commit('geagweweffasdf');
const obj = stream.Object('geadsnewkensd');
```

### Writing Data

Now that you have your references, we can send data back from our application into the Speckle API. Let's say we have some data:
```ts
const speckleObj = {
	id: 'geadsnewkensd',
	speckle_type: 'base',
	x: 0,
	y: 10,
	z: -5,
};
```

We can send that:
```ts
await obj.write(speckleObj);
```

We can commit that:
```ts
await stream.commit(
	obj, 
	"We're doing it!", // message, optional
	"main"             // branch, defaults to "main"
);
```

And we could do it all at once:
```ts
await stream.writeAndCommitObject(speckleObj, "We're doing it!", "main");
```

### URL

Every SpeckleNode has a `.url` getter which will provide the URL for that node in the API:
```ts
(new Speckle()).Stream('abcdefg').Object('hijklmn').url                                     // https://speckle.xyz/streams/abcdefg/objects/hijklmn
(new Speckle({ server: 'https://speckle.me.com' })).Stream('opqrstu').Commit('vwxyzab').url // https://speckle.me.com/streams/opqrstu/commits/vwxyzab
```

## Chainable and/or Composable
The goal of this client was to not just create methods that map directly onto the API endpoints, as many clients do, but to provide reference objects that can be easily passed around in your application. This allows you to write data more generically without having to worry about passing in all of the variables necessary to compose a nice long query each time. How this is organized is through the hierarchy of the API (e.g. an object node requires a stream node).  

To instantiate this hierarchy in your app, you have two ways of doing so:  
### Chaining
```ts
const objData = await (new Speckle()).Stream('aafeasf').Object('dgeadse').get;
```

### Composing
```ts
const { SpeckleStream, SpeckleObject } from '@strategies/speckle';

const objData = await (new SpeckleObject('dgeadse', new SpeckleStream('aafeasf', new Speckle()))).get;
```

## Collaborating

All collaborators welcome! Either submit issues or pull requests, or contact _strategies@sasaki.com_.

## License
MIT
