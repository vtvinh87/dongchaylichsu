## Character Avatar Images

Please add character avatar images to this directory. These images will be used in the chatbot's character selection UI and the dialogue modal.

Make sure the filenames match those specified in `constants.ts` within the `SPEAKER_DATA` or `AI_CHARACTERS` object, under the `avatarUrl` property.

For example:
- `quang-trung.png` for Vua Quang Trung
- `hai-ba-trung.png` for Hai Bà Trưng
- `giao-lien.png` for Lính Giao Liên

Recommended image size: Around 100x100 pixels for good quality display in dialogues, and smaller versions for icons if needed.
Supported formats: PNG, JPG, SVG. PNG with transparency is recommended for a cleaner look if your avatars have complex shapes.

**Example `SPEAKER_DATA` entry in `src/constants.ts`:**
```javascript
export const SPEAKER_DATA: Record<SpeakerKey, Speaker> = {
  'giao_lien': {
    name: 'Lính Giao Liên',
    avatarUrl: '/assets/avatars/giao-lien.png', // This path points here
  },
  // ...
};
```

If these avatar images are missing, the UI might show a placeholder or a broken image.
