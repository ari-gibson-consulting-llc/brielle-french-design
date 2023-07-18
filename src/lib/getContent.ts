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

interface ContentfulPortfolioPage {
  contentTypeId: "portfolioPage";
  fields: {
    portfolioEntries: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<
        | ContentfulPortfolioEntryStaticImages
        | ContentfulPortfolioEntryCarousels
        | ContentfulPortfolioEntryStaticImagesCarousels
      >
    >;
  };
}

export interface ContentfulPortfolioEntryStaticImages {
  contentTypeId: "portfolioEntryStaticImages";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

export interface ContentfulPortfolioEntryCarousels {
  contentTypeId: "portfolioEntryCarousels";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
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
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    firstCarousel: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    secondCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

type ContentfulAssetArr = (
  | contentful.UnresolvedLink<"Asset">
  | contentful.Asset<undefined, string>
)[];

interface BasePortfolioEntry {
  params: {
    slug: string;
  };
  props: {
    title: string;
    description: string;
    portfolioPageDisplayImage: contentful.Asset<undefined, string>;
  };
}

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type PortfolioEntryStaticImages = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImages";
    images: ContentfulAssetArr;
  };
};

type PortfolioEntryCarousels = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryCarousels";
    firstCarousel: ContentfulAssetArr;
    secondCarousel?: ContentfulAssetArr;
    thirdCarousel?: ContentfulAssetArr;
  };
};

type PortfolioEntryStaticImagesCarousels = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImagesCarousels";
    images: ContentfulAssetArr;
    firstCarousel: ContentfulAssetArr;
    secondCarousel?: ContentfulAssetArr;
  };
};

let x: Prettify<PortfolioEntryStaticImages>;

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

export const portfolioPage = (
  await contentfulClient.getEntry<ContentfulPortfolioPage>(
    "7gxjMKCsYhtBf71Ab9bwx9"
  )
).fields;

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

  entryCollections[0].items[0].fields;

  const entryFields = entryCollections
    .map((collection) => {
      const type = collection.items[0].sys.contentType.sys.id;
      return collection.items.map((entry) => ({
        params: {
          slug: entry.fields.slug,
        },
        props: {
          // ...omit("slug", entry.fields),
          ...entry.fields,
          type,
          title: entry.fields.title,
          description: snarkdown(entry.fields.description).replace(
            /<br \/>/g,
            "<br /><br />"
          ),
        },
      }));
    })
    .flat();

  return entryFields;
})();

function omit<T extends object>(key: keyof T, obj: T) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
