import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "🐲 Draggy",
  description: "The official documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Getting Started", link: "/getting-started" }],
      },
      {
        text: "Customization",
        collapsed: false,
        items: [
          { text: "Options", link: "/options" },
          { text: "Events", link: "/events" },
        ],
      },
      {
        text: "Examples",
        collapsed: false,
        items: [
          { text: "Custom Shadow", link: "/examples/custom-shadow" },
          { text: "Restrict a Drop", link: "/examples/restrict-a-drop" },
          { text: "Clean-up (destroy)", link: "/examples/clean-up" },
          {
            text: "Frameworks",
            items: [
              { text: "Vue", link: "/examples/vue" },
              { text: "React", link: "/examples/react" },
            ],
          },
        ],
      },
      {
        text: "API",
        items: [{ text: "Reference", link: "/reference" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/sebkolind/draggy" },
    ],
  },
});
