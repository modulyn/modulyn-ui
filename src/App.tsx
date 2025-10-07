import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <Button onClick={() => setCount((prev) => prev + 1)}>
          Count is {count}
        </Button>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
