# next-sprite-icons

SVG sprite generator with TypeScript support.

## Installation

```bash
npm install next-sprite-icons
```

## Quick Start

1. **Create config file** `sprite.config.json`:
```json
{
  "sourceDir": "./icons",
  "outputDir": "./public",
  "typesDir": "./types",
  "separator": "-"
}
```

2. **Add SVG icons** to `./icons` folder

3. **Generate sprites**:
```bash
npx next-sprite-icons generate
```

4. **Create Icon component**:
```tsx
import { IconName } from './types/icons';

interface IconProps {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} fill="currentColor">
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
```

5. **Use with TypeScript autocomplete**:
```tsx
<Icon name="home" size={32} />
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceDir` | string | `"./icons"` | Source directory with SVG files |
| `outputDir` | string | `"./public"` | Output directory for sprite |
| `typesDir` | string | `"./types"` | Output directory for TypeScript types |
| `separator` | string | `"-"` | Separator for nested folder names |
| `svgo` | object | `{ enabled: true }` | SVGO optimization options |
