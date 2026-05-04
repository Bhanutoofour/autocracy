import { useEffect } from "react";
import {
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  FunctionField,
  List,
  SearchInput,
  TextField,
  TopToolbar,
  useNotify,
  useRedirect,
} from "react-admin";
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const filters = [
  <SearchInput key="q" source="q" alwaysOn placeholder="Search blogs" />,
];

const BlogListActions = () => (
  <TopToolbar>
    <CreateButton icon={<AddCircleOutlineIcon />} label="New Blog" />
  </TopToolbar>
);

const BlogBulkActionButtons = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: unknown) => void;
}) => (
  <BulkDeleteButton
    mutationOptions={{
      onSuccess,
      onError,
    }}
    mutationMode="pessimistic"
  />
);

const BlogTitleField = ({ record }: { record?: Record<string, any> }) => {
  if (!record) return null;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 280 }}>
      <Avatar
        variant="rounded"
        src={record.banner}
        sx={{
          width: 56,
          height: 42,
          borderRadius: 1,
          backgroundColor: "#eef2f6",
          color: "#667085",
        }}
      >
        <ImageOutlinedIcon fontSize="small" />
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#101828",
            fontWeight: 800,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 360,
          }}
          title={record.title}
        >
          {record.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#667085",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 360,
          }}
          title={record.description}
        >
          {record.description}
        </Typography>
      </Box>
    </Stack>
  );
};

const StatusField = ({ record }: { record?: Record<string, any> }) => (
  <Chip
    label={record?.published ? "Published" : "Draft"}
    size="small"
    sx={{
      minWidth: 86,
      fontWeight: 800,
      borderRadius: 1,
      backgroundColor: record?.published ? "#dcfce7" : "#fff7ed",
      color: record?.published ? "#166534" : "#9a3412",
    }}
  />
);

const SeoField = ({ record }: { record?: Record<string, any> }) => {
  const seoCount = [
    record?.seoPageTitle,
    record?.seoPageDescription,
    record?.seoPageKeywords,
    record?.seoSocialTitle,
    record?.seoSocialDescription,
    record?.seoSocialImage,
  ].filter(Boolean).length;

  return (
    <Tooltip title={`${seoCount} SEO fields completed`}>
      <Chip
        label={seoCount >= 3 ? "Strong" : seoCount > 0 ? "Partial" : "Fallback"}
        size="small"
        sx={{
          minWidth: 82,
          fontWeight: 800,
          borderRadius: 1,
          backgroundColor: seoCount >= 3 ? "#e0f2fe" : "#f2f4f7",
          color: seoCount >= 3 ? "#075985" : "#475467",
        }}
      />
    </Tooltip>
  );
};

export const BlogList = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    document.body.classList.remove("dark");
    const muiTheme = document.querySelector("[data-mui-color-scheme]");
    if (muiTheme) {
      muiTheme.setAttribute("data-mui-color-scheme", "light");
    }
  }, []);

  const handleSuccess = () => {
    notify("Blog deleted successfully", { type: "success" });
    redirect("list", "blogs");
  };

  const handleError = (error: unknown) => {
    console.error("Error deleting blog:", error);
    notify("Error deleting blog", { type: "error" });
  };

  return (
    <List
      actions={<BlogListActions />}
      filters={filters}
      sort={{ field: "createdAt", order: "DESC" }}
      title="Blog CMS"
      sx={{
        "& .RaList-content": {
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        },
        "& .RaDatagrid-headerCell": {
          color: "#667085",
          fontSize: 12,
          fontWeight: 900,
          textTransform: "uppercase",
        },
      }}
    >
      <Datagrid
        bulkActionButtons={
          <BlogBulkActionButtons onSuccess={handleSuccess} onError={handleError} />
        }
        rowClick="edit"
      >
        <FunctionField label="Article" render={(record) => <BlogTitleField record={record} />} />
        <TextField source="slug" label="Slug" />
        <FunctionField label="Status" render={(record) => <StatusField record={record} />} />
        <FunctionField label="SEO" render={(record) => <SeoField record={record} />} />
        <DateField source="createdAt" label="Created" />
        <DateField source="updatedAt" label="Updated" />
        <EditButton />
        <DeleteButton
          mutationOptions={{
            onSuccess: handleSuccess,
            onError: handleError,
          }}
          mutationMode="pessimistic"
        />
      </Datagrid>
    </List>
  );
};
