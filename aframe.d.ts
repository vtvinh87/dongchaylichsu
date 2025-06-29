
/// <reference types="react" />

declare global {
  namespace JSX {
      interface IntrinsicElements {
        'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          embedded?: boolean | string;
          arjs?: string;
          renderer?: string;
          'vr-mode-ui'?: string;
          'gesture-detector'?: string | boolean;
          id?: string;
          style?: React.CSSProperties;
        };
        'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          camera?: boolean | string;
          'gltf-model'?: string;
          scale?: string;
          position?: string;
          rotation?: string;
          animation__rotate?: string;
          'gesture-handler'?: string | boolean;
        };
        'a-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          type?: string;
          url?: string;
        };
        'a-assets': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          timeout?: string;
        };
        'a-asset-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          id?: string;
          src?: string;
          'response-type'?: string;
        };
        'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
  }
}
