import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { isPending, data, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/projects");
      return await response.json();
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        <div className="flex flex-col pb-2 px-2">
          <div className="text-2xl">Projects</div>
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
