# SmartWeave modules

## Overview
The goal of the project is to provide standardized modules which can be used 
by anyone.
## Installation
```
yarn add @smartweave/modules
```
## Usage
### Setting up the contract
In your project, create an `index.ts`. The modules allows you to write 
SmartWeave Contracts in Typescript. Use can use this skeleton to get started:
```typescript
import {ActionInterface, StateInterface} from "@smartweave/modules/faces";

declare const SmartWeave: any;

export async function handle(state: StateInterface, action: ActionInterface) {
  switch (action.input.function) {
   
    default:
      throw new ContractError(`${input.function} not implemented`);
  }
}
```
### Using a module
To use a module, simply import it and register it in `handle`:
```typescript
import {ActionInterface, StateInterface} from "@smartweave/modules/faces";
import {Transfer} from "@smartweave/modules/token/transfer";

export async function handle(state: StateInterface, action: ActionInterface) {
  switch (action.input.function) {
    case "transfer":
      return { state: Transfer(state, action) };
    default:
      throw new ContractError(`${input.function} not implemented`);
  }
}
```
### Building the contract
Building the contract requires an extra script. Create a `build.js` script:
```javascript
const { build } = require("esbuild");
const fs = require("fs");

(async () => {
  await build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    format: "esm",
    bundle: true,
  });

  let src = fs.readFileSync("./dist/index.js").toString();
  src = src.replace("async function handle", "export async function handle");
  src = src.replace("export {\n  handle\n};\n", "");
  fs.writeFileSync("./dist/index.js", src);
})();
```
To run the script execute:
```
node build.js
```
### Deploying the contract
Deploying the contract requires an extra script. Copy your arweave-keyfile, create a `deploy.js` script and your initial `state.json`:
```javascript
const Arweave = require("arweave");
const { createContract } = require("smartweave");
const fs = require("fs");

const client = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const wallet = JSON.parse(fs.readFileSync("./arweave.json"));
const src = fs.readFileSync("./dist/index.js");
const state = fs.readFileSync("./scripts/state.json");

(async () => {
  const id = await createContract(client, wallet, src, state);
  console.log(id);
})();

```
To run the script execute:
```
node deploy.js
```