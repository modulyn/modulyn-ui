import Layout from "@/components/layout";
import { Auth0ContextInterface } from "@auth0/auth0-react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  auth: Auth0ContextInterface;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated && !context.auth.isLoading) {
      throw context.auth.loginWithRedirect();
    }
  },
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
