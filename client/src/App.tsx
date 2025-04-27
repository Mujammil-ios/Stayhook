import React, { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import LiveMonitoring from "@/pages/live-monitoring";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "next-themes";

// Simple App for demonstration
function App() {
  // Ensure hydration properly
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className={mounted ? "" : "invisible"}>
        <Layout>
          <Switch>
            <Route path="/live-monitoring" component={LiveMonitoring} />
            <Route>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Welcome to HotelHub</h1>
                <p className="mb-4">Please navigate to one of the following pages:</p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    <a href="/live-monitoring" className="text-blue-500 hover:underline">
                      Live Monitoring
                    </a>
                  </li>
                </ul>
              </div>
            </Route>
          </Switch>
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;
