import fs from "fs";
import path from "path";
import { glob } from "glob";
import { optimize } from "svgo";
import { SvgSpriteConfig } from "../types";

export interface SpriteResult {
  path: string;
  icons: string[];
}

export async function generateSprites(
  config: SvgSpriteConfig,
): Promise<SpriteResult | null> {
  const svgFiles = await findSvgFiles(config.sourceDir);

  if (svgFiles.length === 0) {
    console.warn("⚠️ No SVG files found in", config.sourceDir);
    return null;
  }

  console.log(`📁 Found ${svgFiles.length} SVG files`);

  ensureDirectoryExists(config.outputDir);
  const icons: string[] = [];
  let spriteContent =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n';

  for (const filePath of svgFiles) {
    const iconName = getIconName(filePath, config.sourceDir, config.separator!);
    const svgContent = await processSvgFile(filePath, config);

    if (svgContent) {
      spriteContent += `  <symbol id="${iconName}">\n    ${svgContent}\n  </symbol>\n`;
      icons.push(iconName);
    }
  }

  spriteContent += "</svg>";

  const spritePath = path.join(config.outputDir, "sprite.svg");
  fs.writeFileSync(spritePath, spriteContent, "utf8");

  console.log(`✅ Generated sprite with ${icons.length} icons: ${spritePath}`);

  return {
    path: spritePath,
    icons,
  };
}

async function findSvgFiles(sourceDir: string): Promise<string[]> {
  const pattern = path.join(sourceDir, "**/*.svg");
  return await glob(pattern);
}

function getIconName(
  filePath: string,
  sourceDir: string,
  separator: string,
): string {
  const relativePath = path.relative(sourceDir, filePath);
  const withoutExtension = relativePath.replace(/\.svg$/, "");
  return withoutExtension.replace(/[/\\]/g, separator);
}

async function processSvgFile(
  filePath: string,
  config: SvgSpriteConfig,
): Promise<string | null> {
  try {
    const svgContent = fs.readFileSync(filePath, "utf8");

    if (!config.svgo?.enabled) {
      return extractSvgContent(svgContent);
    }

    const result = optimize(svgContent, {
      ...config.svgo.options,
      plugins: [
        "removeDoctype",
        "removeXMLProcInst",
        "removeComments",
        "removeMetadata",
        "removeTitle",
        "removeDesc",
        ...(config.svgo.options?.plugins || []),
      ],
    });

    return extractSvgContent(result.data);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return null;
  }
}

function extractSvgContent(svgString: string): string {
  const match = svgString.match(/<svg[^>]*>(.*?)<\/svg>/s);
  return match ? match[1].trim() : "";
}

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}
