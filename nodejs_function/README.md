[![npm version](https://badge.fury.io/js/@exanubes%2Fpulumi-nodejs-function.svg)](https://badge.fury.io/js/@exanubes%2Fpulumi-nodejs-function)

# Pulumi Node.js Function

The `NodejsFunction` is a very simple component that streamlines the creation of a Node.js Lambda function in Pulumi by setting default values for architecture and runtime. It also creates an IAM role and assigns basic permissions for interacting with CloudWatch – `arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole`.

The instance includes helper methods like `addPolicy()` for creating new policies or using an existing policy's arn and attaching it to the aforementioned role.

There's also `grantInvoke()` method for assigning a resource-based policy to allow other services e.g., api gateway, to invoke the lambda.

## Usage

```typescript
import { NodejsFunction, NodejsFunctionArgs, Runtime } from '@exanubes/pulumi-nodejs-function'

const props: NodejsFunctionArgs = {
    code: new FileArchive("./functions"),
    handler: "hello_world.handler",
    runtime?: Runtime.NodeJS20,
    policy?: {
      name: "my-awesome-policy",
      policy: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: ["dynamodb:PutItem"],
                Effect: "Allow",
                Resource: "*",
            },
        ],
    },
  }
}

const lambda = new NodejsFunction('lambda', props, pulumi_resource_options);

lambda.grantInvoke('resource-based-policy', 'apigateway.amazonaws.com', 'arn');
lambda.addPolicy("some-policy", {
    name: "my-awesome-policy",
    policy: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: ["dynamodb:PutItem"],
                Effect: "Allow",
                Resource: "*",
            },
        ],
    },
});
```

## Typescript support

The `TypescriptAssetArchive` class can be used for transpiling lambda handlers written in typescript into javascript.
It's a simple wrapper around Pulumi's `AssetArchive` resource. It uses esbuild for transpiling the code to javascript and saving it in memory, creates a Pulumi `StringAsset` which is 
used to create an `AssetArchive`. The resulting file will have the same name with the extension changed from `.ts` to `.js`.
Esbuild configuration can be modified by passing a second argument


```typescript
const esbuildOptions: TypescriptAssetArchiveArgs = {}

const ts_lambda = new NodejsFunction("hello_world", {
  code: new TypescriptAssetArchive("./functions/hello_typescript.ts", esbuildOptions),
  handler: "hello_typescript.handler",
});
```