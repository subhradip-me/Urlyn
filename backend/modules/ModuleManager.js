import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ModuleManager - Handles loading and initialization of all persona modules
 */
class ModuleManager {
  constructor() {
    this.modules = new Map();
    this.initialized = false;
  }

  /**
   * Initialize all modules
   */
  async initialize() {
    if (this.initialized) return;

    console.log('🔄 Initializing ModuleManager...');

    try {
      // Load core modules
      await this.loadCoreModules();
      
      // Load persona modules
      await this.loadPersonaModules();
      
      // Load shared modules
      await this.loadSharedModules();

      this.initialized = true;
      console.log('✅ ModuleManager initialized successfully');
      console.log(`📦 Loaded ${this.modules.size} modules`);
      
    } catch (error) {
      console.error('❌ Failed to initialize ModuleManager:', error);
      throw error;
    }
  }

  /**
   * Load core modules (auth, core features)
   */
  async loadCoreModules() {
    const coreModulePaths = [
      'auth',
      'core'
    ];

    for (const modulePath of coreModulePaths) {
      try {
        const moduleInfo = await this.loadModule(modulePath, 'core');
        this.modules.set(modulePath, moduleInfo);
        console.log(`  ✓ Loaded core module: ${modulePath}`);
      } catch (error) {
        console.error(`  ❌ Failed to load core module ${modulePath}:`, error.message);
      }
    }
  }

  /**
   * Load persona-specific modules
   */
  async loadPersonaModules() {
    const personaModulePaths = [
      'student',
      'creator', 
      'professional',
      'entrepreneur',
      'researcher'
    ];

    for (const persona of personaModulePaths) {
      try {
        const moduleInfo = await this.loadModule(persona, 'persona');
        this.modules.set(`personas/${persona}`, moduleInfo);
        console.log(`  ✓ Loaded persona module: ${persona}`);
      } catch (error) {
        console.error(`  ❌ Failed to load persona module ${persona}:`, error.message);
      }
    }
  }

  /**
   * Load shared modules (database, middleware, utils, services)
   */
  async loadSharedModules() {
    const sharedModulePaths = [
      'database',
      'middleware',
      'utils',
      'services',
      'config'
    ];

    for (const modulePath of sharedModulePaths) {
      try {
        const moduleInfo = await this.loadModule(modulePath, 'shared');
        this.modules.set(`shared/${modulePath}`, moduleInfo);
        console.log(`  ✓ Loaded shared module: ${modulePath}`);
      } catch (error) {
        console.error(`  ❌ Failed to load shared module ${modulePath}:`, error.message);
      }
    }
  }

  /**
   * Load a specific module
   */
  async loadModule(moduleName, type) {
    const moduleInfo = {
      name: moduleName,
      type: type,
      loaded: false,
      routes: null,
      controllers: null,
      services: null,
      models: null,
      error: null
    };

    try {
      let basePath;
      
      switch (type) {
        case 'core':
          basePath = path.join(__dirname, moduleName);
          break;
        case 'persona':
          basePath = path.join(__dirname, 'personas', moduleName);
          break;
        case 'shared':
          basePath = path.join(__dirname, 'shared', moduleName);
          break;
        default:
          throw new Error(`Unknown module type: ${type}`);
      }

      // Check if module directory exists
      if (!fs.existsSync(basePath)) {
        throw new Error(`Module directory not found: ${basePath}`);
      }

      // Load module components
      moduleInfo.routes = await this.loadModuleComponent(basePath, 'routes');
      moduleInfo.controllers = await this.loadModuleComponent(basePath, 'controllers');
      moduleInfo.services = await this.loadModuleComponent(basePath, 'services');
      moduleInfo.models = await this.loadModuleComponent(basePath, 'models');

      moduleInfo.loaded = true;
      
    } catch (error) {
      moduleInfo.error = error.message;
      console.error(`Failed to load module ${moduleName}:`, error.message);
    }

    return moduleInfo;
  }

  /**
   * Load a specific component of a module (routes, controllers, etc.)
   */
  async loadModuleComponent(basePath, componentType) {
    const componentPath = path.join(basePath, componentType);
    
    if (!fs.existsSync(componentPath)) {
      return null;
    }

    const files = fs.readdirSync(componentPath)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(componentPath, file));

    return files;
  }

  /**
   * Get information about a specific module
   */
  getModuleInfo(moduleName) {
    return this.modules.get(moduleName);
  }

  /**
   * Get all loaded modules
   */
  getAllModules() {
    return Array.from(this.modules.entries()).map(([name, info]) => ({
      name,
      ...info
    }));
  }

  /**
   * Get modules by type
   */
  getModulesByType(type) {
    return Array.from(this.modules.entries())
      .filter(([name, info]) => info.type === type)
      .map(([name, info]) => ({ name, ...info }));
  }

  /**
   * Check if a persona module is available
   */
  isPersonaAvailable(persona) {
    return this.modules.has(`personas/${persona}`) && 
           this.modules.get(`personas/${persona}`).loaded;
  }

  /**
   * Get available personas
   */
  getAvailablePersonas() {
    return Array.from(this.modules.keys())
      .filter(key => key.startsWith('personas/'))
      .map(key => key.replace('personas/', ''))
      .filter(persona => this.modules.get(`personas/${persona}`).loaded);
  }

  /**
   * Validate module integrity
   */
  validateModules() {
    const validationResults = {
      total: this.modules.size,
      loaded: 0,
      failed: 0,
      errors: []
    };

    for (const [name, info] of this.modules.entries()) {
      if (info.loaded) {
        validationResults.loaded++;
      } else {
        validationResults.failed++;
        validationResults.errors.push({
          module: name,
          error: info.error
        });
      }
    }

    return validationResults;
  }

  /**
   * Get module statistics
   */
  getStats() {
    const stats = {
      total: this.modules.size,
      byType: {},
      loaded: 0,
      failed: 0
    };

    for (const [name, info] of this.modules.entries()) {
      if (!stats.byType[info.type]) {
        stats.byType[info.type] = { total: 0, loaded: 0, failed: 0 };
      }
      
      stats.byType[info.type].total++;
      
      if (info.loaded) {
        stats.loaded++;
        stats.byType[info.type].loaded++;
      } else {
        stats.failed++;
        stats.byType[info.type].failed++;
      }
    }

    return stats;
  }
}

// Create singleton instance
const moduleManager = new ModuleManager();

export default moduleManager;
