import { TextStyle } from "react-native";

export const typography: Record<string, TextStyle> = {
  largeTitle: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 14,
  },
};
