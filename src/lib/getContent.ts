import contentful from "contentful";
import snarkdown from "snarkdown";

interface ContentfulAbout {
  contentTypeId: "aboutPage";
  fields: {
    title: contentful.EntryFieldTypes.Text;
    bioText: contentful.EntryFieldTypes.Text;
    seoDescription: contentful.EntryFieldTypes.Text;
  };
}

interface ContentfulContact {
  contentTypeId: "contactPage";
  fields: {
    seoDescription: contentful.EntryFieldTypes.Text;
  };
}

interface ContentfulHome {
  contentTypeId: "homePage";
  fields: {
    stillText: contentful.EntryFieldTypes.Symbol;
    firstTextEntry: contentful.EntryFieldTypes.Symbol;
    rotatingText: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>;
    seoDescription: contentful.EntryFieldTypes.Text;
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
    seoDescription: contentful.EntryFieldTypes.Text;
  };
}

interface ContentfulServicesSection {
  contentTypeId: "services";
  fields: {
    nameOfService: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    descriptionOfService: contentful.EntryFieldTypes.Text;
    seoDescription: contentful.EntryFieldTypes.Text;
  };
}

interface ContentfulPortfolioPage {
  contentTypeId: "portfolioPage";
  fields: {
    portfolioEntries: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<
        | ContentfulPortfolioEntryStaticImages
        | ContentfulPortfolioEntryPDF
        | ContentfulPortfolioEntryCarousels
        | ContentfulPortfolioEntryStaticImagesCarousels
      >
    >;
    seoDescription: contentful.EntryFieldTypes.Text;
  };
}

interface ContentfulPortfolioEntryStaticImages {
  contentTypeId: "portfolioEntryStaticImages";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
  };
}

interface ContentfulPortfolioEntryPDF {
  contentTypeId: "portfolioEntryPdf";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
    pdf: contentful.EntryFieldTypes.AssetLink;
  };
}

interface ContentfulPortfolioEntryCarousels {
  contentTypeId: "portfolioEntryCarousels";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
    firstCarousel: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    firstCarouselMaxNumberOfSlidesToShow?: contentful.EntryFieldTypes.Integer;
    secondCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    secondCarouselMaxNumberOfSlidesToShow?: contentful.EntryFieldTypes.Integer;
    thirdCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    thirdCarouselMaxNumberOfSlidesToShow?: contentful.EntryFieldTypes.Integer;
    fourthCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    fourthCarouselMaxNumberOfSlidesToShow?: contentful.EntryFieldTypes.Integer;
  };
}

interface ContentfulPortfolioEntryStaticImagesCarousels {
  contentTypeId: "portfolioEntryStaticImagesCarousels";
  fields: {
    title: contentful.EntryFieldTypes.Symbol;
    slug: contentful.EntryFieldTypes.Symbol;
    description: contentful.EntryFieldTypes.Text;
    portfolioPageDisplayImage: contentful.EntryFieldTypes.AssetLink;
    images: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    firstCarousel: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    firstCarouselMaxNumberOfSlidesToShow?: contentful.EntryFieldTypes.Integer;
    secondCarousel?: contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.AssetLink>;
    secondCarouselMaxNumberOfSlidesToShow?: contentful.EntryFieldTypes.Integer;
  };
}

export type ContentfulAssetArr = contentful.Asset<
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>[];

interface BasePortfolioEntry {
  params: {
    slug: string;
  };
  props: {
    slug: string;
    title: string;
    description: string;
    portfolioPageDisplayImage: contentful.Asset<
      "WITHOUT_UNRESOLVABLE_LINKS",
      string
    >;
  };
}

export type PortfolioEntryStaticImages = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImages";
    images: ContentfulAssetArr;
  };
};

export type PortfolioEntryPDF = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryPdf";
    pdf: contentful.Asset<undefined, string>;
  };
};

export type PortfolioEntryCarousels = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryCarousels";
    firstCarousel: ContentfulAssetArr;
    firstCarouselMaxNumberOfSlidesToShow?: number;
    secondCarousel?: ContentfulAssetArr;
    secondCarouselMaxNumberOfSlidesToShow?: number;
    thirdCarousel?: ContentfulAssetArr;
    thirdCarouselMaxNumberOfSlidesToShow?: number;
    fourthCarousel?: ContentfulAssetArr;
    fourthCarouselMaxNumberOfSlidesToShow?: number;
  };
};

type PortfolioEntryStaticImagesCarousels = BasePortfolioEntry & {
  props: {
    type: "portfolioEntryStaticImagesCarousels";
    images: ContentfulAssetArr;
    firstCarousel: ContentfulAssetArr;
    firstCarouselMaxNumberOfSlidesToShow?: number;
    secondCarousel?: ContentfulAssetArr;
    secondCarouselMaxNumberOfSlidesToShow?: number;
  };
};

export type PortfolioEntry =
  | PortfolioEntryStaticImages
  | PortfolioEntryPDF
  | PortfolioEntryCarousels
  | PortfolioEntryStaticImagesCarousels;

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
    "<br /><br />",
  ),
  seoDescription: aboutPageFields.seoDescription,
};

export const contactPage = (
  await contentfulClient.getEntry<ContentfulContact>("2gOpJYcWh3NrhKBS0EfOwb")
).fields;

export const homePage = (
  await contentfulClient.getEntry<ContentfulHome>("dWhvw9XdtMQizE6qhrAU0")
).fields;

const servicesPageFields = (
  await contentfulClient.withoutUnresolvableLinks.getEntry<ContentfulServices>(
    "fvuXQwQG1cwAfpepI4Q0Y",
  )
).fields;

export const servicesPage = {
  title: servicesPageFields.title,
  dropdownSlug: servicesPageFields.dropdownSlug,
  primaryText: snarkdown(servicesPageFields.primaryText).replace(
    /<br \/>/g,
    "<br /><br />",
  ),
  sections: servicesPageFields.sections.map((section) => {
    if (!section) return;
    return {
      ...section.fields,
      descriptionOfService: snarkdown(
        section.fields.descriptionOfService,
      ).replace(/<br \/>/g, "<br /><br />"),
    };
  }),
  seoDescription: servicesPageFields.seoDescription,
};

export const portfolioPage = (
  await contentfulClient.withoutUnresolvableLinks.getEntry<ContentfulPortfolioPage>(
    "7gxjMKCsYhtBf71Ab9bwx9",
  )
).fields;

export const portfolioEntries = await (async () => {
  const entryFields = portfolioPage.portfolioEntries
    .map((entry) => {
      if (!entry) {
        console.log("entry is undefined");
        return;
      }
      const type = entry.sys.contentType.sys.id;
      return {
        params: {
          slug: entry.fields.slug,
        },
        props: {
          ...entry.fields,
          type,
          description: snarkdown(entry.fields.description).replace(
            /<br \/>/g,
            "<br /><br />",
          ),
        },
      };
    })
    .filter((entry): entry is PortfolioEntry => !!entry);

  return entryFields;
})();

// export const portfolioEntries = await (async () => {
//   // prettier-ignore
//   const entryCollections = await Promise.all([
//     contentfulClient.withoutUnresolvableLinks.getEntries<ContentfulPortfolioEntryStaticImages>({
//       content_type: "portfolioEntryStaticImages",
//     }),
//     contentfulClient.withoutUnresolvableLinks.getEntries<ContentfulPortfolioEntryPDF>({
//       content_type: "portfolioEntryPdf",
//     }),
//     contentfulClient.withoutUnresolvableLinks.getEntries<ContentfulPortfolioEntryCarousels>({
//       content_type: "portfolioEntryCarousels",
//     }),
//     contentfulClient.withoutUnresolvableLinks.getEntries<ContentfulPortfolioEntryStaticImagesCarousels>({
//       content_type: "portfolioEntryStaticImagesCarousels",
//     }),
//   ]);

//   const entryFields = entryCollections
//     .map((collection) => {
//       const type = collection.items[0]?.sys.contentType.sys.id;
//       return collection.items.map((entry) => ({
//         params: {
//           slug: entry.fields.slug,
//         },
//         props: {
//           ...entry.fields,
//           type,
//           description: snarkdown(entry.fields.description).replace(
//             /<br \/>/g,
//             "<br /><br />",
//           ),
//         },
//       }));
//     })
//     .flat();

//   return entryFields;
// })();
