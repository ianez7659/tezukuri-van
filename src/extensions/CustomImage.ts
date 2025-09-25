import { Node, mergeAttributes, CommandProps } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      insertCustomImage: (attrs: {
        src: string;
        alt?: string;
        title?: string;
        width?: string;
        align?: string;
        layout?: string;
        position?: string;
        textContent?: string;
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
      align: { default: "center" },
      layout: { default: "single" }, // "single" or "double"
      position: { default: "left" }, // "left" or "right" for double layout
      textContent: { default: "" }, // Text content for the other column
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-layout]",
        getAttrs: (el) => {
          const container = el as HTMLElement;
          const img = container.querySelector("img[data-custom-image]") as HTMLImageElement;
          if (!img) return false;
          
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: img.style.width || "300px",
            align: img.style.float || "center",
            layout: container.getAttribute("data-layout") || "single",
            position: container.getAttribute("data-position") || "left",
            textContent: container.getAttribute("data-text-content") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || "300px";
    const layout = HTMLAttributes.layout || "single";
    const position = HTMLAttributes.position || "left";
    const textContent = HTMLAttributes.textContent || "";
    const align = HTMLAttributes.align || "center";

    if (layout === "double") {
      // Double column layout
      const containerStyle = `
        margin: 1rem 0;
      `;

      const imageStyle = `
        max-width: 100%;
        height: auto;
      `;

      const textStyle = `
        font-size: 1.125rem;
        white-space: pre-wrap;
        word-wrap: break-word;
      `;

      const imageElement = [
        "img",
        mergeAttributes(HTMLAttributes, {
          "data-custom-image": "true",
          "data-layout": layout,
          "data-position": position,
          style: imageStyle,
          class: "w-full md:w-[45%]",
        }),
      ];

      const textElement = [
        "div",
        {
          "data-text-content": "true",
          style: textStyle,
          class: "w-full md:flex-1 md:min-w-[200px]",
        },
        textContent || "Enter text here...",
      ];

      // Determine image and text order based on position
      const elements =
        position === "left"
          ? [imageElement, textElement]
          : [textElement, imageElement];

      return [
        "div",
        {
          style: containerStyle,
          "data-layout": layout,
          "data-position": position,
          "data-text-content": textContent,
          class: "custom-image-container flex flex-col md:flex-row gap-2 md:gap-4",
        },
        ...elements,
      ];
    } else {
      // Single column layout (same as before)
      const containerStyle = `
        text-align: ${align};
        margin: 1rem 0;
      `;

      const imageStyle = `
        width: ${width || '300px'};
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        display: inline-block;
      `;

      return [
        "div",
        {
          style: containerStyle,
          "data-layout": layout,
        },
        [
          "img",
          mergeAttributes(HTMLAttributes, {
            "data-custom-image": "true",
            "data-layout": layout,
            style: imageStyle,
          }),
        ],
      ];
    }
  },

  addCommands() {
    return {
      insertCustomImage:
        (attrs) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: "customImage",
            attrs,
          });
        },
    };
  },
});
