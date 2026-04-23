// Default configuration - can be overridden via .env
export default {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  session: {
    // In production, SESSION_SECRET MUST be set via environment variable
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  api: {
    prefix: '/api',
    version: 'v1',
  },
  // Plugin system - enable/disable features
  plugins: {
    // Set to true to enable authentication module
    auth: false,
    // Set to true to enable database (requires DB_CONNECTION_STRING)
    database: false,
    // Note: upload plugin available but requires implementation
    // Add your plugin flags here
  },
};
