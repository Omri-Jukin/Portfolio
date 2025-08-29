"use client";

import { useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Portfolio Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "pages", label: "Pages" },
              { id: "projects", label: "Projects" },
              { id: "posts", label: "Posts" },
              { id: "skills", label: "Skills" },
              { id: "media", label: "Media" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === "dashboard" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">
                    Total Pages
                  </h3>
                  <p className="text-2xl font-bold text-blue-900">0</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">
                    Total Projects
                  </h3>
                  <p className="text-2xl font-bold text-green-900">0</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">
                    Total Posts
                  </h3>
                  <p className="text-2xl font-bold text-purple-900">0</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pages" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Pages</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Page
                </button>
              </div>
              <p className="text-gray-500">
                No pages created yet. Create your first page to get started.
              </p>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Projects</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Project
                </button>
              </div>
              <p className="text-gray-500">
                No projects created yet. Create your first project to showcase
                your work.
              </p>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Blog Posts
                </h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Post
                </button>
              </div>
              <p className="text-gray-500">
                No blog posts created yet. Create your first post to start
                blogging.
              </p>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Skill
                </button>
              </div>
              <p className="text-gray-500">
                No skills added yet. Add your technical skills and expertise.
              </p>
            </div>
          )}

          {activeTab === "media" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Media Library
                </h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Upload Media
                </button>
              </div>
              <p className="text-gray-500">
                No media uploaded yet. Upload images and files for your content.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
