import fs from "fs";
import path from "path";
import { SvgSpriteConfig } from "../types";

const DEFAULT_CONFIG: SvgSpriteConfig = {
  sourceDir: "./icons",
  outputDir: "./public",
  typesDir: "./types",
  separator: "-",
  svgo: {
    enabled: true,
    options: {},
  },
};

export function loadConfig(
  projectRoot: string = process.cwd(),
): SvgSpriteConfig {
  const configPath = path.join(projectRoot, "sprite.config.json");

  if (!fs.existsSync(configPath)) {
    console.warn("⚠️ sprite.config.json not found, using default config");
    return DEFAULT_CONFIG;
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf8");
    const userConfig = JSON.parse(configContent);

    return { ...DEFAULT_CONFIG, ...userConfig };
  } catch (error) {
    console.error("🚫 Error reading sprite.config.json:", error);
    return DEFAULT_CONFIG;
  }
}
