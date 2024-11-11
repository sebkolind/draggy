import {defineConfig} from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "🐲 Draggy",
  description: "The official documentation",
  base: "/draggy/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{text: "Guide", link: "/getting-started"}],

    sidebar: [
      {
        text: "Introduction",
        items: [{text: "Getting Started", link: "/getting-started"}],
      },
      {
        text: "Customization",
        collapsed: false,
        items: [
          {text: "Options", link: "/options"},
          {text: "Events", link: "/events"},
        ],
      },
      {
        text: "Examples",
        collapsed: false,
        items: [
          {text: "Custom Shadow", link: "/examples/custom-shadow"},
          {text: "Restrict a Drop", link: "/examples/restrict-a-drop"},
          {text: "Clean-up (destroy)", link: "/examples/clean-up"},
          {
            text: "Frameworks",
            items: [
              {text: "Vue", link: "/examples/vue"},
              {text: "React", link: "/examples/react"},
              {text: "Svelte", link: "/examples/svelte"},
            ],
          },
        ],
      },
      {
        text: "API",
        items: [{text: "Reference", link: "/reference"}],
      },
      {
        text: "Report an Issue",
        link: "https://github.com/sebkolind/draggy/issues",
      },
      {
        text: "Join the Community",
        link: "https://github.com/sebkolind/draggy/discussions",
      }
    ],

    socialLinks: [
      {icon: "github", link: "https://github.com/sebkolind/draggy"},
    ],
  },
});
