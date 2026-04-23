import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from '../../config/defaults.js';
import { PluginManager } from './plugins/index.js';

const app = express();
const pluginManager = new PluginManager();

// Load enabled plugins (async)
if (config.plugins.auth) {
  await pluginManager.load('auth');
}
if (config.plugins.database) {
  await pluginManager.load('database');
}
// Note: upload plugin is available but requires implementation
// To enable, create src/server/plugins/upload/index.js

// Middleware - order matters
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(config.cors));

// Mount plugin routes
pluginManager.mount(app, config);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    plugins: pluginManager.loadedPlugins,
    timestamp: new Date().toISOString(),
  });
});

// Dynamic route loading from plugins
pluginManager.registerRoutes(app, config);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: config.server.env === 'development' ? err.message : 'Internal Server Error',
  });
});

const port = config.server.port;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📦 Loaded plugins: ${pluginManager.loadedPlugins.join(', ') || 'none'}`);
  console.log(`🔧 Environment: ${config.server.env}`);
});

export default app;
