import { useEffect } from "react";
import {
  DeleteButton,
  Edit,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
  useRedirect,
  useUpdate,
} from "react-admin";
import { revalidateBlogData } from "@/actions/blogAction";
import {
  BlogFormFields,
  transformBlogPayload,
  validateBlogForm,
} from "./BlogFormFields";

const CustomToolbar = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Toolbar sx={{ gap: 1.5, justifyContent: "space-between" }}>
      <SaveButton alwaysEnable />
      <DeleteButton
        mutationOptions={{
          onSuccess: () => {
            notify("Blog deleted successfully", { type: "success" });
            redirect("list", "blogs");
          },
          onError: (error: unknown) => {
            console.error("Error deleting blog:", error);
            notify("Error deleting blog", { type: "error" });
          },
        }}
        mutationMode="pessimistic"
      />
    </Toolbar>
  );
};

export const BlogEdit = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [update] = useUpdate();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    document.body.classList.remove("dark");
    const muiTheme = document.querySelector("[data-mui-color-scheme]");
    if (muiTheme) {
      muiTheme.setAttribute("data-mui-color-scheme", "light");
    }
  }, []);

  const onSuccess = async () => {
    await revalidateBlogData();
    notify("Blog updated successfully", { type: "success" });
    redirect("list", "blogs");
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await update(
        "blogs",
        { id: values.id, data: transformBlogPayload(values) },
        {
          onSuccess,
          onError: (error) => {
            console.error("Update error:", error);
            notify("Error updating blog", { type: "error" });
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
      notify("Error updating blog", { type: "error" });
    }
  };

  return (
    <Edit
      mutationOptions={{
        onSuccess,
        onError: (error) => {
          console.error("Update error:", error);
          notify("Error updating blog", { type: "error" });
        },
      }}
    >
      <SimpleForm
        toolbar={<CustomToolbar />}
        onSubmit={handleSubmit}
        validate={validateBlogForm}
        sx={{ maxWidth: 1180 }}
      >
        <BlogFormFields mode="edit" />
      </SimpleForm>
    </Edit>
  );
};
