import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    distPath: {
      root: "dist", // Use a relative path
    },
    assetPrefix: "/jellypaws/", // This sets the public path for assets
  },
});
