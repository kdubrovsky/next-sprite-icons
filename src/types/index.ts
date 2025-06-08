export interface SvgSpriteConfig {
  sourceDir: string;
  outputDir: string;
  typesDir: string;
  separator?: string;
  svgo?: {
    enabled?: boolean;
    options?: any;
  };
}
