import { Node, mergeAttributes, CommandProps } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType = any> {
    customImage: {
      insertCustomImage: (attrs: {
        src: string;
        alt?: string;
        title?: string;
        width?: string;
        align?: string;
      }) => ReturnType;
    };
  }
}

export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "300px" },
      // align: { default: "center" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[data-custom-image]",
        getAttrs: (el) => {
          const img = el as HTMLImageElement;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: img.style.width || "300px",
            // align: img.style.float || "center",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || "300px";

    return [
      "div",
      {
        style: `
        text-align: center;
        margin: 1rem 0;
      `,
      },
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          "data-custom-image": "true",
          style: `
          width: ${width};
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          display: inline-block;
        `,
        }),
      ],
    ];
  },
  addCommands() {
    return {
      insertCustomImage:
        (attrs: {
          src: string;
          alt?: string;
          title?: string;
          width?: string;
          align?: string;
        }) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: "customImage",
            attrs,
          });
        },
    };
  },
});
