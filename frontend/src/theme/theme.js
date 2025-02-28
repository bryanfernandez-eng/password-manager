import { extendTheme } from "@chakra-ui/react";

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
        bg: "black",
        backgroundImage:
          "radial-gradient(circle at 56% -46%, #1200991e 1%, transparent 97.05%),  radial-gradient(circle at 149% 125%, #1200993e 16%, transparent 41.05%), radial-gradient(circle at 50% 50%, #0800991b 9%, transparent 44.05%), radial-gradient(circle at -25% 137%, #08009926 18%, transparent 54.05%)",
        backgroundSize: "100% 100%",
        animation: "gradientShift 30s ease infinite",
        "&::before": {
          content: '""',
          backdropFilter: "blur(10px)",
          pointerEvents: "none",
        },
      },
      "@keyframes gradientShift": {
        "0%, 100%": { backgroundPosition: "0% 0%" },
        "25%": { backgroundPosition: "100% 0%" },
        "50%": { backgroundPosition: "100% 100%" },
        "75%": { backgroundPosition: "0% 100%" },
      },
    },
  },
});
