import fs from "fs";
import path from "path";
import { SvgSpriteConfig } from "../types";

export async function generateTypes(
  iconNames: string[],
  config: SvgSpriteConfig,
): Promise<void> {
  ensureDirectoryExists(config.typesDir);

  if (iconNames.length === 0) {
    console.warn("⚠️ No icons found, skipping types generation");
    return;
  }

  const typesContent = generateTypesContent(iconNames);
  const typesPath = path.join(config.typesDir, "icons.d.ts");
  fs.writeFileSync(typesPath, typesContent, "utf8");

  console.log(`✅ Generated types for ${iconNames.length} icons: ${typesPath}`);
}

function generateTypesContent(iconNames: string[]): string {
  const sortedNames = iconNames.sort();
  const unionType = sortedNames.map((name) => `'${name}'`).join(" | ");

  return `// Auto-generated types for sprite icons.
// Generated at: ${new Date().toISOString()}

export type IconName = ${unionType};
`;
}

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}
