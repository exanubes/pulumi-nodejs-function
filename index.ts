import {
  NodejsFunction,
  TypescriptAssetArchive,
} from "@exanubes/pulumi-nodejs-function";
import { FileArchive } from "@pulumi/pulumi/asset";

const ts_lambda = new NodejsFunction("hello_world", {
  code: new TypescriptAssetArchive("./functions/hello_typescript.ts"),
  handler: "hello_typescript.handler",
});

const js_lambda = new NodejsFunction("hello_world_js", {
  code: new FileArchive("./functions"),
  handler: "hello_world.handler",
});

ts_lambda.grantInvoke("resource-based-policy", "apigateway.amazonaws.com");

ts_lambda.addPolicy("some-policy", {
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

export const lambda_arn = ts_lambda.handler.arn;
