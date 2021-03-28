import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const theme = extendTheme({
  colors: {
    black: "#16161D",
    green: "#57A773",
    blue: "#08B2E3",
    red: "#EE6352",
    dark: "#484D6D",
    offWhite: "#EFE9F4",
    darkHover: "#5F8FB5",
    greenHover: "#59B470",
    "🥫": "#E47169",
    "🥫Hover": "#FF0000",
    "🧅": "#F5C49E",
    "🧅Hover": "#F9AE5F",
    "🍞": "#EDCC9B",
    "🍞Hover": "#FEE014",
    "🥕": "#FAAF7A",
    "🥕Hover": "#FFB300",
    "🥚": "#DE6FFD",
    "🥚Hover": "#EC53DC",
    "🍏": "#C4FFC8",
    "🍏Hover": "#52C838",
    "🥗": "#D1F5AD",
    "🥗Hover": "#44A82E",
    "🥩": "#FF8585",
    "🥩Hover": "#FF2C2C",
  },
  fonts,
  breakpoints,
  icons: {
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: "0 0 3000 3163",
    },
  },
});

export default theme;
