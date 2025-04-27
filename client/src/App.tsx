import React from "react";
import { Switch, Route } from "wouter";
import LiveMonitoring from "@/pages/live-monitoring";

// Extremely minimal app - no theming, no complex components
function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">HotelHub</h1>
          <nav>
            <ul className="flex gap-4">
              <li>
                <a href="/" className="hover:underline">Home</a>
              </li>
              <li>
                <a href="/live-monitoring" className="hover:underline">Live Monitoring</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <Switch>
          <Route path="/live-monitoring" component={LiveMonitoring} />
          <Route>
            <div className="p-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Welcome to HotelHub</h2>
                <p className="mb-4">This is a streamlined version of the Hotel Management System focusing on the Live Monitoring feature.</p>
                <div className="mt-6">
                  <a 
                    href="/live-monitoring" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Go to Live Monitoring
                  </a>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </main>
      
      <footer className="bg-gray-100 border-t mt-auto p-4">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} HotelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
