import contentful from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

interface ContentfulAbout {
  contentTypeId: "aboutPage";
  fields: {
    bioText: contentful.EntryFieldTypes.RichText;
  };
}

interface ContentfulHome {
  contentTypeId: "homePage";
  fields: {
    stillText: contentful.EntryFieldTypes.Symbol;
    firstTextEntry: contentful.EntryFieldTypes.Symbol;
    rotatingText: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>;
  };
}

interface ContentfulServices {
  contentTypeId: "services";
  fields: {
    nameOfService: contentful.EntryFieldTypes.Symbol;
    descriptionOfService: contentful.EntryFieldTypes.Text;
    slug: contentful.EntryFieldTypes.Symbol;
  };
}

interface ContentfulPortfolioEntry {
  contentTypeId: "portfolioEntry";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    slug: contentful.EntryFieldTypes.Symbol;
    image: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

// const aboutPageFields = (await contentfulClient.getEntry<ContentfulAbout>(""))
//   .fields;

// export const aboutPage = {
//   bioText: documentToHtmlString(aboutPageFields.bioText),
// };

// export const homePage = (await contentfulClient.getEntry<ContentfulHome>(""))
//   .fields;

// export const services = (
//   await contentfulClient.getEntries<ContentfulServices>({
//     content_type: "services",
//   })
// ).items.map((item) => item.fields);
