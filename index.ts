import { NodejsFunction } from "@exanubes/pulumi-nodejs-function";
import { FileArchive } from "@pulumi/pulumi/asset";

const lambda = new NodejsFunction("hello_world", {
    code: new FileArchive("./functions"),
    handler: "hello_world.handler",
});

lambda.grantInvoke("apigateway.amazonaws.com");

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

export const lambda_arn = lambda.handler.arn;
