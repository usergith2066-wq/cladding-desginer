export interface DesignParameters {
  // Cladding / Background
  claddingMaterial: 'Solid' | 'Timber effect' | 'Marble effect' | 'Louvers';
  claddingFinish: 'Glossy' | 'Matte' | 'Brushed Metal';
  claddingColor: string;
  claddingPattern: 'Horizontal panels' | 'Vertical panels' | 'Geometric squares';
  claddingGrooveColor: string;

  // Cornice & Frame
  cornicePosition: 'Top Cap' | 'Full Box' | 'Top and Bottom';
  corniceShape: 'Flat' | 'Extruded' | 'Chamfered/Slanted' | 'Stepped';
  corniceColor: string;
  corniceIntegratedLight: 'None' | 'LED Profile' | 'Downlights';

  // Main Typography
  mainText: string;
  mainTextFontType: 'Naskh' | 'Thuluth' | 'Kufi' | 'Freehand/Neon' | 'Serif' | 'Sans Serif';
  mainTextLetterType: '3D Box letters' | 'Flat cut' | 'Stencil/Cut-out';
  mainTextMaterial: 'Acrylic' | 'Stainless Steel (Gold/Silver)' | 'Painted Zinc';
  mainTextLightingType: 'Front-lit' | 'Back-lit/Halo' | 'Full-lit' | 'None';
  mainTextColor: string;
  mainTextReturnColor: string;

  // Subtext & Logos
  subText: string;
  subTextPosition: 'Below main text' | 'Right of sign' | 'Left of sign';
  subTextStyle: 'Small 3D letters' | 'Vinyl sticker' | 'Lightbox';
  logoStyle: 'None' | '3D' | 'Flat print';
  logoPosition: 'Above text' | 'Beside text' | 'Integrated with text';

  // Columns
  columnsCladding: 'None' | 'Fully Cladded' | 'Paint only';
  columnsDesign: 'Same as main sign' | 'Contrasting color';
  columnsDecor: 'None' | 'Vertical LED strips' | 'Sconces';

  // Soffit
  soffitColor: string;
  soffitSpotlightsCount: number;
  soffitLightColorTemp: 'Cool White' | 'Warm White';

  // Extras
  extrasScreen: 'None' | 'Scrolling LED Sign';
  extrasAwning: 'None' | 'Fabric Awning' | 'Metal Awning';
  extrasWindowGraphics: 'None' | 'Yes';
  
  // General
  openings: number;
}
