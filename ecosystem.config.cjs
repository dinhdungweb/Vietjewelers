module.exports = {
  apps: [
    {
      name: 'vietjewelers',
      script: 'node',
      args: '--import tsx server/index.ts',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        CORS_ORIGIN: 'http://localhost:3000'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002,
        CORS_ORIGIN: 'http://localhost:3000'
      }
    }
  ]
};
