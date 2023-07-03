import contentful from "contentful";
import snarkdown from "snarkdown";

interface ContentfulAbout {
  contentTypeId: "aboutPage";
  fields: {
    title: contentful.EntryFieldTypes.Text;
    bioText: contentful.EntryFieldTypes.Text;
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
    slug: contentful.EntryFieldTypes.Symbol;
    descriptionOfService: contentful.EntryFieldTypes.Text;
  };
}

interface ContentfulPortfolioEntry {
  contentTypeId: "portfolioEntry";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    slug: contentful.EntryFieldTypes.Symbol;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

const aboutPageFields = (
  await contentfulClient.getEntry<ContentfulAbout>("5nkZkXaMHCn8A5XxA3Uibv")
).fields;

export const aboutPage = {
  title: aboutPageFields.title,
  bioText: snarkdown(aboutPageFields.bioText).replace(
    /<br \/>/g,
    "<br /><br />"
  ),
};

export const homePage = (
  await contentfulClient.getEntry<ContentfulHome>("dWhvw9XdtMQizE6qhrAU0")
).fields;

export const services = (
  await contentfulClient.getEntries<ContentfulServices>({
    content_type: "services",
  })
).items.map((item) => ({
  ...item.fields,
  descriptionOfService: snarkdown(item.fields.descriptionOfService).replace(
    /<br \/>/g,
    "<br /><br />"
  ),
}));
