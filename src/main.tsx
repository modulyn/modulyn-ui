import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "@/components/theme-provider";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Auth0Provider
          domain="dev-4ddwubism4670p0x.us.auth0.com"
          clientId="kXitUffRkfScwguSbmxwJo7Nhk1gslKw"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <RouterProvider router={router} />
        </Auth0Provider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
