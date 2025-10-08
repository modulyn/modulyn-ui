import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import { Route, Routes } from "react-router";
import ProjectPage from "./pages/ProjectPage";
import NoProjectPage from "./pages/NoProjectPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Routes>
          <Route path="/" element={<NoProjectPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
