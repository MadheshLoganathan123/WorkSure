import { createBrowserRouter, Navigate } from "react-router";
import { AdminOverview } from "./screens/AdminOverview";
import { ClaimReviewDetail } from "./screens/ClaimReviewDetail";
import { AdminPlaceholder } from "./screens/AdminPlaceholder";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/admin",
    Component: AdminOverview,
  },
  {
    path: "/admin/claim/:claimId",
    Component: ClaimReviewDetail,
  },
  {
    path: "/admin/policies",
    Component: AdminPlaceholder,
  },
  {
    path: "/admin/claims",
    Component: AdminPlaceholder,
  },
  {
    path: "/admin/fraud",
    Component: AdminPlaceholder,
  },
  {
    path: "/admin/payouts",
    Component: AdminPlaceholder,
  },
  {
    path: "/admin/risk",
    Component: AdminPlaceholder,
  },
  {
    path: "/admin/settings",
    Component: AdminPlaceholder,
  },
]);
