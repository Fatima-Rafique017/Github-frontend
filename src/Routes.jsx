
import React from "react";
import { useRoutes, Navigate } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import StarredRepos from "./components/user/StarredRepos";
import CreateRepository from "./components/repository/CreateRepository";

const ProjectRoutes = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to="/signup" replace />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/starred",
      element: <StarredRepos />,
    },
    {
      path: "/create",
      element: <CreateRepository />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
