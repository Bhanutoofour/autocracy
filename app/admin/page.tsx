// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Admin, Resource } from "react-admin";
import type { RaThemeOptions } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import { HeroList } from "./components/HeroList";
import { HeroCreate } from "./components/HeroCreate";
import { HeroEdit } from "./components/HeroEdit";
import { IndustriesList } from "./components/IndustriesList";
import { IndustriesCreate } from "./components/IndustriesCreate";
import { IndustriesEdit } from "./components/IndustriesEdit";
import { ProductsList } from "./components/ProductsList";
import { ProductsCreate } from "./components/ProductsCreate";
import { ProductsEdit } from "./components/ProductsEdit";
import { ModelsList } from "./components/ModelsList";
import { ModelsCreate } from "./components/ModelsCreate";
import { ModelsEdit } from "./components/ModelsEdit";
import { DealersList } from "./components/DealersList";
import { DealersCreate } from "./components/DealersCreate";
import { DealersEdit } from "./components/DealersEdit";
import { VideosList } from "./components/VideosList";
import { VideosCreate } from "./components/VideosCreate";
import { VideosEdit } from "./components/VideosEdit";
import { BlogList } from "./blog-cms/components/BlogList";
import { BlogCreate } from "./blog-cms/components/BlogCreate";
import { BlogEdit } from "./blog-cms/components/BlogEdit";
import { isAdminAuthenticated, logoutAdmin } from "@/utils/auth";

const adminTheme: RaThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#184e77",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f97316",
    },
    background: {
      default: "#f6f8fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#101828",
      secondary: "#667085",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      "Inter, Roboto, Arial, Helvetica, sans-serif",
    h6: {
      fontWeight: 800,
    },
    button: {
      fontWeight: 800,
      textTransform: "none",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#101828",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#f8fafc",
          },
        },
      },
    },
  },
};

const AdminPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use secure authentication check
    const authenticated = isAdminAuthenticated();

    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      // Clear any invalid data and redirect
      logoutAdmin();
      router.push("/admin/login");
    }

    setIsLoading(false);
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading admin panel...
      </div>
    );
  }

  // Show redirecting message if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Redirecting to login...
      </div>
    );
  }

  const dataProvider = simpleRestProvider("/api");

  return (
    <Admin
      dataProvider={dataProvider}
      title="Autocracy CMS"
      theme={adminTheme}
      defaultTheme="light"
    >
      <Resource
        name="hero-section"
        options={{ label: "Home Hero" }}
        icon={DashboardCustomizeOutlinedIcon}
        list={HeroList}
        create={HeroCreate}
        edit={HeroEdit}
      />
      <Resource
        name="industries"
        options={{ label: "Industries" }}
        icon={CategoryOutlinedIcon}
        list={IndustriesList}
        create={IndustriesCreate}
        edit={IndustriesEdit}
      />
      <Resource
        name="products"
        options={{ label: "Products" }}
        icon={Inventory2OutlinedIcon}
        list={ProductsList}
        create={ProductsCreate}
        edit={ProductsEdit}
      />
      <Resource
        name="models"
        options={{ label: "Models" }}
        icon={PrecisionManufacturingOutlinedIcon}
        list={ModelsList}
        create={ModelsCreate}
        edit={ModelsEdit}
      />
      <Resource
        name="dealers"
        options={{ label: "Dealers" }}
        icon={GroupsOutlinedIcon}
        list={DealersList}
        create={DealersCreate}
        edit={DealersEdit}
      />
      <Resource
        name="videos"
        options={{ label: "Videos" }}
        icon={LocalShippingOutlinedIcon}
        list={VideosList}
        create={VideosCreate}
        edit={VideosEdit}
      />
      <Resource
        name="blogs"
        options={{ label: "Blog CMS" }}
        icon={ArticleOutlinedIcon}
        list={BlogList}
        create={BlogCreate}
        edit={BlogEdit}
      />
    </Admin>
  );
};

export default AdminPage;
