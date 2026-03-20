import { createBrowserRouter, Navigate } from "react-router";
import { AdminOverview } from "./screens/AdminOverview";
import { ClaimReviewDetail } from "./screens/ClaimReviewDetail";
import { AdminPolicies } from "./screens/AdminPolicies";
import { AdminClaims } from "./screens/AdminClaims";
import { AdminFraud } from "./screens/AdminFraud";
import { AdminPayouts } from "./screens/AdminPayouts";
import { AdminRisk } from "./screens/AdminRisk";
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
    Component: AdminPolicies,
  },
  {
    path: "/admin/claims",
    Component: AdminClaims,
  },
  {
    path: "/admin/fraud",
    Component: AdminFraud,
  },
  {
    path: "/admin/payouts",
    Component: AdminPayouts,
  },
  {
    path: "/admin/risk",
    Component: AdminRisk,
  },
  {
    path: "/admin/settings",
    Component: AdminPlaceholder,
  },
]);
