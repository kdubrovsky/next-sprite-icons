#!/usr/bin/env node

import { Command } from "commander";
import { loadConfig } from "../utils/config";
import { generateSprites } from "../generators/sprite.generator";
import { generateTypes } from "../generators/types.generator";

const program = new Command();

program
  .name("next-sprite-icons")
  .description("SVG sprite generator")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate SVG sprites and types")
  .option("-c, --config <path>", "Config file path", "sprite.config.json")
  .action(async () => {
    try {
      console.log("🚀 Starting SVG sprite generation...");

      const config = loadConfig(process.cwd());
      console.log("📋 Config loaded:", {
        sourceDir: config.sourceDir,
        outputDir: config.outputDir,
      });

      const spriteResult = await generateSprites(config);

      if (!spriteResult) {
        console.error("❌ No sprites generated");
        process.exit(1);
      }

      await generateTypes(spriteResult.icons, config);

      console.log("✅ Generation completed successfully!");
    } catch (error) {
      console.error("❌ Generation failed:", error);
      process.exit(1);
    }
  });

program.parse();
