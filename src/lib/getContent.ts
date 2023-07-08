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
  };
}

<<<<<<< Updated upstream
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type PortfolioEntryStaticImages = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImages";
    images: ContentfulAssetArr
  };
}
=======
type PortfolioEntryStaticImages = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImages";
    images: ContentfulAssetArr;
  };
};
>>>>>>> Stashed changes

type PortfolioEntryCarousels = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryCarousels";
    firstCarousel: ContentfulAssetArr;
    secondCarousel?: ContentfulAssetArr;
    thirdCarousel?: ContentfulAssetArr;
  };
<<<<<<< Updated upstream
}
=======
};
>>>>>>> Stashed changes

type PortfolioEntryStaticImagesCarousels = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImagesCarousels";
    images: ContentfulAssetArr;
    firstCarousel: ContentfulAssetArr;
    secondCarousel?: ContentfulAssetArr;
  };
<<<<<<< Updated upstream
}


let x: Prettify<PortfolioEntryStaticImages>;
=======
};
>>>>>>> Stashed changes

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

// export const services = (
//   await contentfulClient.getEntries<ContentfulServices>({
//     content_type: "services",
//   })
// ).items.map((item) => item.fields);

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
