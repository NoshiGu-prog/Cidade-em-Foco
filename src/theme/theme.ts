import { configureFonts, MD3LightTheme } from "react-native-paper";

export const colors = {
  background: "#e6f1f1",
  brandBlue: "#2a62a2",
  brandGreen: "#50924d",
  inputBackground: "#fbfcfc",
  checkboxFontColor: "#737373",
} as const;

const fontConfig = {
  fontFamily: "Roboto_400Regular",
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: colors.background,
    primary: colors.brandBlue,
    secondary: colors.brandGreen,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 12,
};
