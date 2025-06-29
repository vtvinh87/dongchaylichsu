/// <reference types="react" />

// This simplified version should avoid any potential type conflicts.
// It uses `any` to bypass detailed prop checking for A-Frame components,
// which is a common and effective way to resolve these JSX-related TS errors.
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

// The empty export is important to make this a module.
export {};
