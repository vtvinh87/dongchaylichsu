/// <reference types="react" />

// aframe.d.ts
// This file provides TypeScript definitions for A-Frame's custom HTML elements
// to be used within JSX, preventing "Property 'a-scene' does not exist on type 'JSX.IntrinsicElements'" errors.

declare global {
  namespace JSX {
      type AFrameReactAttributes = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

      interface IntrinsicElements {
        'a-scene': AFrameReactAttributes & {
          embedded?: boolean | string;
          arjs?: string;
          renderer?: string;
          'vr-mode-ui'?: string;
          'gesture-detector'?: string | boolean;
          id?: string;
          style?: React.CSSProperties;
        };
        'a-entity': AFrameReactAttributes & {
          camera?: boolean | string;
          'gltf-model'?: string;
          scale?: string;
          position?: string;
          rotation?: string;
          animation__rotate?: string;
          'gesture-handler'?: string | boolean;
        };
        'a-marker': AFrameReactAttributes & {
          type?: string;
          url?: string;
        };
        'a-assets': AFrameReactAttributes & {
          timeout?: string;
        };
        'a-asset-item': AFrameReactAttributes & {
          id?: string;
          src?: string;
          'response-type'?: string;
        };
        'a-camera': AFrameReactAttributes;
      }
  }
}
