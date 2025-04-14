// src/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Nomad</h1>
        <div className="space-y-4">
          <p className="text-gray-600">Find your perfect workspace:</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link
              to="/places"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Find Workspaces
            </Link>
            <Link
              to="/profile"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
