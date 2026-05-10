import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import RecentRepos from "./pages/RecentRepos";
import SavedSessions from "./pages/SavedSessions";
import Architecture from "./pages/Architecture";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/recent"
          element={<RecentRepos />}
        />

        <Route
          path="/sessions"
          element={<SavedSessions />}
        />

        <Route
          path="/architecture"
          element={<Architecture />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Routes>
    </BrowserRouter>
  );
}