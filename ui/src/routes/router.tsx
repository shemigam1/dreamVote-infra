import { createBrowserRouter } from "react-router";
import AuthPage from "../views/AuthPage";
import HomePage from "../views/HomePage";
import ElectionDetailPage from "../views/ElectionDetailPage";
import NominatePage from "../views/NominatePage";
import AccountPage from "../views/AccountPage";
import CreateElectionPage from "../views/CreateElectionPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/auth", element: <AuthPage /> },
  { path: "/elections/new", element: <CreateElectionPage /> },
  { path: "/elections/:electionId", element: <ElectionDetailPage /> },
  { path: "/elections/:electionId/nominate", element: <NominatePage /> },
  { path: "/account", element: <AccountPage /> },
]);
