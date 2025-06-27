// aframe.d.ts
// This file provides TypeScript definitions for A-Frame's custom HTML elements
// to be used within JSX, preventing "Property 'a-scene' does not exist on type 'JSX.IntrinsicElements'" errors.

declare global {
  namespace JSX {
    // Define a shorthand for the common React attributes for A-Frame elements.
    type AFrameReactAttributes = import('react').DetailedHTMLProps<import('react').HTMLAttributes<HTMLElement>, HTMLElement>;

    interface IntrinsicElements {
      'a-scene': AFrameReactAttributes & {
        embedded?: boolean;
        arjs?: string;
        renderer?: string;
        'vr-mode-ui'?: string;
        'gesture-detector'?: boolean;
        id?: string;
        style?: import('react').CSSProperties;
      };
      'a-entity': AFrameReactAttributes & {
        camera?: boolean;
        'gltf-model'?: string;
        scale?: string;
        position?: string;
        rotation?: string;
        animation__rotate?: string;
        'gesture-handler'?: boolean;
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
