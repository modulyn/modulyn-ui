import { RouterProvider } from "@tanstack/react-router";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { router } from "./router";

function InnerApp() {
  const auth = useAuth0();
  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  return (
    <Auth0Provider
      domain="dev-4ddwubism4670p0x.us.auth0.com"
      clientId="kXitUffRkfScwguSbmxwJo7Nhk1gslKw"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <InnerApp />
    </Auth0Provider>
  );
}
