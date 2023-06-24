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
  contentTypeId: "servicesPage";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    dropdownSlug: contentful.EntryFieldTypes.Symbol;
    primaryText: contentful.EntryFieldTypes.Text;
    sections: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<ContentfulServicesSection>
    >;
  };
}

interface ContentfulServicesSection {
  contentTypeId: "services";
  fields: {
    nameOfService: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    descriptionOfService: contentful.EntryFieldTypes.Text;
  };
}

export interface ContentfulPortfolioEntryStaticImages {
  contentTypeId: "portfolioEntryStaticImages";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

export interface ContentfulPortfolioEntryCarousels {
  contentTypeId: "portfolioEntryCarousels";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    firstCarousel: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    secondCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    thirdCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

export interface ContentfulPortfolioEntryStaticImagesCarousels {
  contentTypeId: "portfolioEntryStaticImagesCarousels";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    firstCarousel: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    secondCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
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

const servicesPageFields = (
  await contentfulClient.withoutUnresolvableLinks.getEntry<ContentfulServices>(
    "fvuXQwQG1cwAfpepI4Q0Y"
  )
).fields;

export const servicesPage = {
  title: servicesPageFields.title,
  dropdownSlug: servicesPageFields.dropdownSlug,
  primaryText: snarkdown(servicesPageFields.primaryText).replace(
    /<br \/>/g,
    "<br /><br />"
  ),
  sections: servicesPageFields.sections.map((section) => {
    if (!section) return;
    return {
      ...section.fields,
      descriptionOfService: snarkdown(
        section.fields.descriptionOfService
      ).replace(/<br \/>/g, "<br /><br />"),
    };
  }),
};

export const portfolioEntries = await (async () => {
  const entryCollections = await Promise.all([
    contentfulClient.getEntries<ContentfulPortfolioEntryStaticImages>({
      content_type: "portfolioEntryStaticImages",
    }),
    contentfulClient.getEntries<ContentfulPortfolioEntryCarousels>({
      content_type: "portfolioEntryCarousels",
    }),
    contentfulClient.getEntries<ContentfulPortfolioEntryStaticImagesCarousels>({
      content_type: "portfolioEntryStaticImagesCarousels",
    }),
  ]);

  const entryFields = entryCollections.map((collection) =>
    collection.items.map((entry) => ({
      params: {
        slug: entry.fields.slug,
      },
      props: {
        ...omit("slug", entry.fields),
        type: entry.sys.contentType.sys.id,
        title: entry.fields.title,
        description: snarkdown(entry.fields.description).replace(
          /<br \/>/g,
          "<br /><br />"
        ),
      },
    }))
  ).flat();

  return entryFields;
})();

function omit<T extends object>(key: keyof T, obj: T) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
