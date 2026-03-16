import { RouterProvider } from "react-router";
import { router } from "./routes";
import { MobileFrame } from "./components/MobileFrame";

export default function App() {
  return (
    <MobileFrame>
      <RouterProvider router={router} />
    </MobileFrame>
  );
}
