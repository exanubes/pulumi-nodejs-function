export function handler() {
  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello Typescript",
    }),
  });
}
