import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __currentDir = dirname(fileURLToPath(import.meta.url));

export default {
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  viteFinal: async (config) => {
    // Work around for sb-original/image-context issue
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'sb-original/image-context': resolve(__currentDir, '../src/sb-original-image-context.js'),
    };
    
    // Configure Emotion for Storybook
    config.define = {
      ...config.define,
      'process.env': {},
    };

    // Configure React plugin with Emotion support
    const reactPluginIndex = config.plugins.findIndex(
      (plugin) => plugin && plugin.name === 'vite:react-babel'
    );
    
    if (reactPluginIndex !== -1) {
      config.plugins[reactPluginIndex] = {
        ...config.plugins[reactPluginIndex],
        options: {
          jsxImportSource: '@emotion/react',
          babel: {
            plugins: ['@emotion/babel-plugin'],
          },
        },
      };
    }
    
    return config;
  },
};
