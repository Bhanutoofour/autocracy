import { ReactNode } from "react";
import {
  BooleanInput,
  ReferenceArrayInput,
  required,
  SelectArrayInput,
  TextInput,
} from "react-admin";
import { Alert, Box, Chip, Divider, Stack, Typography } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { RichTextInput } from "./RichTextInput";

const sectionSx = {
  border: "1px solid #e5e7eb",
  borderRadius: 2,
  backgroundColor: "#fff",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
  p: { xs: 2, md: 3 },
};

const twoColumnSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
};

const wideInputSx = {
  "& .MuiInputBase-root": {
    borderRadius: 1.5,
    backgroundColor: "#fff",
  },
};

type BlogFormSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
};

const BlogFormSection = ({
  eyebrow,
  title,
  description,
  icon,
  children,
}: BlogFormSectionProps) => (
  <Box sx={sectionSx}>
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          display: "grid",
          placeItems: "center",
          backgroundColor: "#eef6ff",
          color: "#0b5cab",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "#667085",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#101828" }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#667085", maxWidth: 760 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
    <Divider sx={{ mb: 2.5 }} />
    {children}
  </Box>
);

export const validateBlogForm = (values: Record<string, any>): any => {
  const errors: Record<string, string> = {};

  if (!values.title || values.title.trim() === "") {
    errors.title = "Title is required";
  }
  if (!values.slug || values.slug.trim() === "") {
    errors.slug = "Slug is required";
  }
  if (!values.description || values.description.trim() === "") {
    errors.description = "Description is required";
  }
  if (!values.banner || values.banner.trim() === "") {
    errors.banner = "Banner image is required";
  }
  if (!values.bannerAltText || values.bannerAltText.trim() === "") {
    errors.bannerAltText = "Banner alt text is required";
  }
  if (!values.content || values.content.trim() === "") {
    errors.content = "Content is required";
  }

  return errors;
};

export const transformBlogPayload = (data: Record<string, any>) => {
  const nextData = { ...data };

  const seoMetadata: Record<string, string> = {};
  if (nextData.seoPageTitle) seoMetadata.pageTitle = nextData.seoPageTitle;
  if (nextData.seoPageDescription) {
    seoMetadata.pageDescription = nextData.seoPageDescription;
  }
  if (nextData.seoPageKeywords) seoMetadata.pageKeywords = nextData.seoPageKeywords;
  if (nextData.seoSocialTitle) seoMetadata.socialTitle = nextData.seoSocialTitle;
  if (nextData.seoSocialDescription) {
    seoMetadata.socialDescription = nextData.seoSocialDescription;
  }
  if (nextData.seoSocialImage) seoMetadata.socialImage = nextData.seoSocialImage;

  if (Object.keys(seoMetadata).length > 0) {
    nextData.seoMetadata = seoMetadata;
  } else {
    delete nextData.seoMetadata;
  }

  delete nextData.seoPageTitle;
  delete nextData.seoPageDescription;
  delete nextData.seoPageKeywords;
  delete nextData.seoSocialTitle;
  delete nextData.seoSocialDescription;
  delete nextData.seoSocialImage;

  if (nextData.slug) {
    nextData.slug = nextData.slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }

  return nextData;
};

export const BlogFormIntro = ({ mode }: { mode: "create" | "edit" }) => (
  <Box
    sx={{
      borderRadius: 2,
      background: "linear-gradient(135deg, #0f172a 0%, #184e77 100%)",
      color: "#fff",
      p: { xs: 2.5, md: 3.5 },
      mb: 3,
    }}
  >
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "center" }}
    >
      <Box>
        <Typography variant="overline" sx={{ color: "#b9e6fe", fontWeight: 800 }}>
          Blog CMS
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 0 }}>
          {mode === "create" ? "Create a new article" : "Refine this article"}
        </Typography>
        <Typography sx={{ color: "#d1e9ff", maxWidth: 720, mt: 0.75 }}>
          Build publish-ready stories with relationships, search metadata, and rich
          editorial content in one workflow.
        </Typography>
      </Box>
      <Chip
        label={mode === "create" ? "Draft by default" : "Live controls"}
        sx={{
          backgroundColor: "rgba(255,255,255,0.14)",
          color: "#fff",
          fontWeight: 800,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />
    </Stack>
  </Box>
);

export const BlogFormFields = ({ mode }: { mode: "create" | "edit" }) => (
  <Stack spacing={3} sx={{ width: "100%" }}>
    <BlogFormIntro mode={mode} />

    <BlogFormSection
      eyebrow="Step 1"
      title="Story basics"
      description="Set the headline, URL, summary, and publish state visitors will see across the site."
      icon={<ArticleOutlinedIcon fontSize="small" />}
    >
      <Stack spacing={2}>
        <Box sx={twoColumnSx}>
          <TextInput source="title" validate={required()} fullWidth sx={wideInputSx} />
          <TextInput
            source="slug"
            validate={required()}
            fullWidth
            helperText="Example: excavator-buying-guide"
            sx={wideInputSx}
          />
        </Box>
        <TextInput
          source="description"
          multiline
          rows={3}
          validate={required()}
          fullWidth
          helperText="A short summary used in cards, filters, and fallback SEO."
          sx={wideInputSx}
        />
        <BooleanInput
          source="published"
          defaultValue={mode === "create" ? false : undefined}
          helperText="Keep off until the article is reviewed."
        />
      </Stack>
    </BlogFormSection>

    <BlogFormSection
      eyebrow="Step 2"
      title="Media"
      description="Add a banner image path or URL and describe it clearly for accessibility and SEO."
      icon={<ImageOutlinedIcon fontSize="small" />}
    >
      <Box sx={twoColumnSx}>
        <TextInput
          source="banner"
          label="Banner image path or URL"
          validate={required()}
          fullWidth
          helperText="Use an existing public asset path or CDN URL."
          sx={wideInputSx}
        />
        <TextInput
          source="bannerAltText"
          label="Banner alt text"
          validate={required()}
          fullWidth
          helperText="Describe the image, not the article title."
          sx={wideInputSx}
        />
      </Box>
    </BlogFormSection>

    <BlogFormSection
      eyebrow="Step 3"
      title="Catalog relationships"
      description="Connect this article to industries, product groups, and models so filters and related posts stay useful."
      icon={<HubOutlinedIcon fontSize="small" />}
    >
      <Box sx={twoColumnSx}>
        <ReferenceArrayInput source="industryIds" reference="industries" label="Industries">
          <SelectArrayInput optionText="title" fullWidth sx={wideInputSx} />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="productIds" reference="products" label="Products">
          <SelectArrayInput optionText="title" fullWidth sx={wideInputSx} />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="modelIds" reference="models" label="Models">
          <SelectArrayInput optionText="modelTitle" fullWidth sx={wideInputSx} />
        </ReferenceArrayInput>
      </Box>
    </BlogFormSection>

    <BlogFormSection
      eyebrow="Step 4"
      title="Article content"
      description="Use headings, lists, images, and links to shape the final published article."
      icon={<TuneOutlinedIcon fontSize="small" />}
    >
      <Alert severity="info" sx={{ mb: 2, borderRadius: 1.5 }}>
        The rich text content is stored as the public article body and rendered on
        the blog detail page.
      </Alert>
      <RichTextInput source="content" validate={required()} />
    </BlogFormSection>

    <BlogFormSection
      eyebrow="Step 5"
      title="SEO and sharing"
      description="Tune search and social previews. Empty fields fall back to the article title, summary, and banner."
      icon={<SearchOutlinedIcon fontSize="small" />}
    >
      <Stack spacing={2.5}>
        <Box sx={twoColumnSx}>
          <TextInput
            source="seoPageTitle"
            label="Page title"
            placeholder="Blog title | Autocracy Machinery"
            fullWidth
            sx={wideInputSx}
          />
          <TextInput
            source="seoPageKeywords"
            label="Keywords"
            placeholder="excavator, construction equipment"
            fullWidth
            sx={wideInputSx}
          />
        </Box>
        <TextInput
          source="seoPageDescription"
          label="Page description"
          multiline
          rows={3}
          fullWidth
          sx={wideInputSx}
        />
        <Box sx={twoColumnSx}>
          <TextInput
            source="seoSocialTitle"
            label="Social title"
            fullWidth
            sx={wideInputSx}
          />
          <TextInput
            source="seoSocialImage"
            label="Social image URL"
            fullWidth
            sx={wideInputSx}
          />
        </Box>
        <TextInput
          source="seoSocialDescription"
          label="Social description"
          multiline
          rows={3}
          fullWidth
          sx={wideInputSx}
        />
      </Stack>
    </BlogFormSection>
  </Stack>
);
