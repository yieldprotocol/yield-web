export default {
  name: "faqs",
  title: "FAQ page",
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
      name: "heading",
      title: "Heading",
      type: "string"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "faq",
      title: "FAQs",
      type: "array",
      of: [{ type: "faq" }]
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
