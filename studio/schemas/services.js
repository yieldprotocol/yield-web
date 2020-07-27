export default {
  name: "services",
  title: "Services page",
  type: "document",
  liveEdit: false,
  // You probably want to uncomment the next line once you've made the pages documents in the Studio. This will remove the pages document type from the create-menus.
  __experimental_actions: ["update", "publish" /* "create", "delete" */],
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "slide2",
      title: "Slide 2 Use Split View",
      description:
        "If enabled, the UI will use a split panel view to highlight let's say `Digital Native` vs. `For retail`",
      type: "boolean"
    },
    {
      name: "slide2LeftTitle",
      title: "Left side title (default for non-split view)",
      type: "string"
    },
    {
      name: "slide2LeftDescription",
      title: "Left side description (default for non-split view)",
      type: "text"
    },
    {
      name: "slide2LeftImage",
      title: "Left side image (optional)",
      type: "image"
    },
    {
      name: "slide2RightTitle",
      title: "Right side title (only shows up if split view is enabled)",
      type: "string"
    },
    {
      name: "slide2RightDescription",
      title: "Right side description (only shows up if split view is enabled)",
      type: "text"
    },
    {
      name: "slide2RightImage",
      title: "Right side image (optional)",
      type: "image"
    },
    {
      name: "showStories",
      title: "Show stories (enabled by default)",
      type: "boolean"
    },
    {
      name: "storiesTitle",
      title: "Stories title",
      type: "string"
    },
    {
      name: "storiesDescription",
      title: "Stories description",
      type: "string"
    },
    {
      name: "mainCTA",
      title: "CTA at bottom of page",
      type: "string"
    },
    {
      name: "mainCTAURL",
      title: "CTA destination (goes to /contact by default)",
      type: "string"
    }
  ]
};
