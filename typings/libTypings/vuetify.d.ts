declare module "vuetify/es5/util/colors" {
  interface ColorDefinitionEntry {
    base: string;
    lighten5: string;
    lighten4: string;
    lighten3: string;
    lighten2: string;
    lighten1: string;
    darken1: string;
    darken2: string;
    darken3: string;
    darken4: string;
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
  }

  interface ExportedColors {
    red: ColorDefinitionEntry;
    pink: ColorDefinitionEntry;
    purple: ColorDefinitionEntry;
    deepPurple: ColorDefinitionEntry;
    indigo: ColorDefinitionEntry;
    blue: ColorDefinitionEntry;
    lightBlue: ColorDefinitionEntry;
    cyan: ColorDefinitionEntry;
    teal: ColorDefinitionEntry;
    green: ColorDefinitionEntry;
    lightGreen: ColorDefinitionEntry;
    lime: ColorDefinitionEntry;
    yellow: ColorDefinitionEntry;
    amber: ColorDefinitionEntry;
    orange: ColorDefinitionEntry;
    deepOrange: ColorDefinitionEntry;
    brown: ColorDefinitionEntry;
    blueGrey: ColorDefinitionEntry;
    grey: ColorDefinitionEntry;
    shades: ColorDefinitionEntry;
  }

  const theExport: ExportedColors;

  export default theExport;
}

declare module "vuetify/src/locale/*.js" {
  const messages: { [key: string]: string };
  export default messages;
}
