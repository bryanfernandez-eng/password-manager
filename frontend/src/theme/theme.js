import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    flickr: {
      pink: "#FF0084",
      blue: "#0063DC",
      darkGray: "#222222",
      lightGray: "#F3F3F3",
      white: "#FFFFFF",
    },
  },
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
        bg: "#222222", 
        color: "#F3F3F3", 
        fontFamily: "'Proxima Nova', sans-serif",
      },
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: "#FF0084",
          color: "white",
          _hover: {
            bg: "#E5007A", 
          },
        },
        secondary: {
          bg: "#0063DC", 
          color: "white",
          _hover: {
            bg: "#0056BE", 
          },
        },
        outline: {
          borderColor: "#FF0084",
          color: "#FF0084",
          _hover: {
            bg: "rgba(255, 0, 132, 0.1)",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Heading: {
      baseStyle: {
        color: "#F3F3F3",
      },
    },
    Link: {
      baseStyle: {
        color: "#0063DC", 
        _hover: {
          color: "#FF0084",
          textDecoration: "none",
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "gray.600",
            _hover: {
              borderColor: "#FF0084",
            },
            _focus: {
              borderColor: "#FF0084",
              boxShadow: "0 0 0 1px #FF0084",
            },
          },
        },
      },
      defaultProps: {
        variant: "outline",
      },
    },
  },
});