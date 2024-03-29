export default {
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Some frontend will require a slug to be set to be able to show the project",
      options: {
        source: "title",
        maxLength: 96
      }
    },
    {
      name: "publishedAt",
      title: "Published at",
      description: "You can use this field to schedule projects where you show them",
      type: "datetime"
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text"
    },
    {
      name: "logo",
      title: "Logo",
      description: "Use the Alt text as the brand name / company name",
      type: "mainImage"
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "mainImage"
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }]
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: "relatedStories",
      title: "Related stories",
      type: "array",
      of: [{ type: "reference", to: { type: "story" } }]
    }
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      image: "mainImage"
    },
    prepare({ title = "No title", publishedAt, image }) {
      return {
        title,
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : "Missing publishing date",
        media: image
      };
    }
  }
};
