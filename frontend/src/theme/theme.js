import { background, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
      },
      body: {
        bg: "#000009", // Fallback color
        fontFamily: "'Kavoon', sans-serif",
      },

    },
  },
});
