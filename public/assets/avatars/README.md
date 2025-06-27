## Character Avatar Images

Please add character avatar images to this directory. These images will be used in the chatbot's character selection UI.

Make sure the filenames match those specified in `constants.ts` within the `AI_CHARACTERS` object, under the `avatarUrl` property.

For example:
- `quang-trung.png` for Vua Quang Trung
- `hai-ba-trung.png` for Hai Bà Trưng

Recommended image size: Around 40x40 pixels or 64x64 pixels for good quality display as small icons.
Supported formats: PNG, JPG, SVG. PNG with transparency is recommended for a cleaner look if your avatars have complex shapes.

**Example `AI_CHARACTERS` entry in `src/constants.ts`:**
```javascript
export const AI_CHARACTERS: Record<string, AiCharacter> = {
  'quang-trung': {
    id: 'quang-trung',
    name: 'Vua Quang Trung',
    systemInstruction: '...',
    avatarUrl: '/assets/avatars/quang-trung.png', // This path points here
    // ...
  },
  // ...
};
```

If these avatar images are missing, the chatbot will display a generic placeholder icon.
