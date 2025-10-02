import { defineConfig } from "astro/config";
import type { RenderBuiltAssetUrl } from "vite";

const renderBuiltUrl: RenderBuiltAssetUrl = (
  filename,
  { type, hostId, hostType, ssr }
) => {
  // currently, this log does not appear in the "dev" or "build" console logs
  console.log("[renderBuiltUrl]: function called");
  // check if parameters match expected values
  console.log({
    filename,
    type,
    hostId,
    hostType,
    ssr,
  });
  // example return result
  return {
    relative: true,
  };
};

// https://astro.build/config
export default defineConfig({
  // disable inlining to test rewriting paths
  build: {
    inlineStylesheets: "never",
  },
  integrations: [
    // set `renderBuiltUrl` from astro integration
    {
      name: "render-built-url-astro-integration",
      hooks: {
        "astro:config:setup": ({ config }) => {
          config.vite.experimental ??= {};
          config.vite.experimental.renderBuiltUrl = renderBuiltUrl;
        },
      },
    },
  ],
  vite: {
    build: {
      // disable inlining to test rewriting paths
      assetsInlineLimit: 0,
    },
    experimental: {
      // set `renderBuiltUrl` from vite config
      renderBuiltUrl,
    },
    plugins: [
      // set `renderBuiltUrl` from vite plugin
      {
        name: "render-built-url-vite-plugin",
        config: (config) => {
          config.experimental ??= {};
          config.experimental.renderBuiltUrl = renderBuiltUrl;
        },
      },
    ],
  },
});
