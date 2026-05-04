import { useEffect } from "react";
import { Create, SimpleForm, useNotify, useRedirect } from "react-admin";
import { revalidateBlogData } from "@/actions/blogAction";
import {
  BlogFormFields,
  transformBlogPayload,
  validateBlogForm,
} from "./BlogFormFields";

export const BlogCreate = () => {
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

  const onSuccess = async () => {
    await revalidateBlogData();
    notify("Blog created successfully", { type: "success" });
    redirect("list", "blogs");
  };

  return (
    <Create mutationOptions={{ onSuccess }} transform={transformBlogPayload}>
      <SimpleForm validate={validateBlogForm} sx={{ maxWidth: 1180 }}>
        <BlogFormFields mode="create" />
      </SimpleForm>
    </Create>
  );
};
