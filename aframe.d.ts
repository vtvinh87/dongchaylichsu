// --- A-Frame Type Declarations for JSX ---
// This ensures TypeScript knows about the custom A-Frame elements when using them in JSX.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-marker': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-camera': any;
    }
  }
}
