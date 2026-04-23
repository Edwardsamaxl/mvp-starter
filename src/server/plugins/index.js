// Plugin Manager - enables modular, decoupled architecture
export class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.loadedPlugins = [];
  }

  async load(name) {
    // Dynamic import of plugin (ESM)
    const plugin = await import(`./${name}/index.js`);
    this.plugins.set(name, plugin.default || plugin);
    this.loadedPlugins.push(name);
    console.log(`✓ Plugin loaded: ${name}`);
  }

  mount(app, config) {
    for (const [name, plugin] of this.plugins) {
      if (plugin.mount) {
        plugin.mount(app, config);
      }
    }
  }

  registerRoutes(app, config) {
    for (const [name, plugin] of this.plugins) {
      if (plugin.routes) {
        plugin.routes(app, config);
      }
    }
  }
}

// Base plugin interface
export const PluginBase = {
  name: 'base',
  mount(app, config) {},
  routes(app, config) {},
};
