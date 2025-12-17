module.exports = {
  apps: [
    {
      name: "matthewdalby.dev",
      script: "npm",
      args: "start",
      cwd: "/Users/matthewdalby/_projects/blogs/matthewdalby.dev/app", // Make sure this is correct
      env: {
        NODE_ENV: "production",
        // Add any other environment variables here
      },
    },
  ],
};
