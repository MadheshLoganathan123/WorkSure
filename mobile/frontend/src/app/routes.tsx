import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./screens/SplashScreen";
import { PersonaSelection } from "./screens/PersonaSelection";
import { ProfileBuilder } from "./screens/ProfileBuilder";
import { RiskProfile } from "./screens/RiskProfile";
import { PlanActivation } from "./screens/PlanActivation";
import { Dashboard } from "./screens/Dashboard";
import { DisruptionDetail } from "./screens/DisruptionDetail";
import { AutoClaim } from "./screens/AutoClaim";
import { ClaimHistory } from "./screens/ClaimHistory";
import { FraudCheck } from "./screens/FraudCheck";
import { Wallet } from "./screens/Wallet";
import { Policy } from "./screens/Policy";
import { ProfileView } from "./screens/ProfileView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/persona",
    Component: PersonaSelection,
  },
  {
    path: "/profile",
    Component: ProfileBuilder,
  },
  {
    path: "/risk-profile",
    Component: RiskProfile,
  },
  {
    path: "/plans",
    Component: PlanActivation,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/disruption-detail",
    Component: DisruptionDetail,
  },
  {
    path: "/auto-claim",
    Component: AutoClaim,
  },
  {
    path: "/claims",
    Component: ClaimHistory,
  },
  {
    path: "/fraud-check",
    Component: FraudCheck,
  },
  {
    path: "/wallet",
    Component: Wallet,
  },
  {
    path: "/policy",
    Component: Policy,
  },
  {
    path: "/profile-view",
    Component: ProfileView,
  },
]);
