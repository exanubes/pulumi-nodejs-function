# Pulumi Node.js Function

Repository for a blog article about [creating custom Component Resources in Pulumi](https://exanubes.com/blog/creating-a-custom-component-resource-in-pulumi) and a supporting [video](https://youtu.be/wQ-JwIUzVUM).

`NodejsFunction` is a very simple component that streamlines the creation of a Nodejs Lambda function by setting default values for architecture and runtime. It also creates an IAM role and assigns basic permissions for interacting with CloudWatch – `arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole`.

The instance includes helper methods like `addPolicy()` for creating new policies or using an existing policy's arn and attaching it to the aforementioned role. 

There's also `grantInvoke()` method for assigning a resource-based policy to allow other services e.g., api gateway, to invoke the lambda.

[see usage](nodejs_function/README.md)
