import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [yourRepositories, setYourRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [starredRepositories, setStarredRepositories] = useState([]);

  // Fetch Suggested Repositories
  useEffect(() => {
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch("http://localhost:3000/repo/all");
        const data = await response.json();

        console.log("Suggested Repositories:", data);

        if (response.ok) {
          const repos = Array.isArray(data)
            ? data
            : data.repositories || [];

          setSuggestedRepositories(repos);
        }
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
      }
    };

    fetchSuggestedRepositories();
  }, []);

  // Fetch Your Repositories
  useEffect(() => {
    const fetchYourRepositories = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${currentUser}`
        );

        const data = await response.json();

        console.log("Your Repositories:", data);

        if (response.ok) {
          const repos = Array.isArray(data)
            ? data
            : data.repositories || [];

          setYourRepositories(repos);
        }
      } catch (err) {
        console.error("Error fetching your repositories:", err);
      }
    };

    fetchYourRepositories();
  }, [currentUser]);

  // Fetch Starred Repositories
  const fetchStarredRepositories = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `http://localhost:3000/repo/starred/${currentUser}`
      );

      const data = await response.json();

      console.log("Starred Repositories:", data);

      if (response.ok) {
        setStarredRepositories(data.repositories || []);
      }
    } catch (err) {
      console.error("Error fetching starred repositories:", err);
    }
  };

  useEffect(() => {
    fetchStarredRepositories();
  }, [currentUser]);

  // Star Repository
  const handleStar = async (repoId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/repo/star/${currentUser}/${repoId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Repository starred successfully!");
        fetchStarredRepositories();
      } else {
        alert(data.message || "Unable to star repository.");
      }
    } catch (err) {
      console.error("Error starring repository:", err);
    }
  };

  // Unstar Repository
  const handleUnstar = async (repoId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/repo/unstar/${currentUser}/${repoId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Repository unstarred successfully!");
        fetchStarredRepositories();
      } else {
        alert(data.message || "Unable to unstar repository.");
      }
    } catch (err) {
      console.error("Error unstarring repository:", err);
    }
  };

  // Search Your Repositories
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(yourRepositories);
    } else {
      const filteredRepo = yourRepositories.filter((repo) =>
        repo.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, yourRepositories]);

  return (
    <>
      <Navbar />

      <section id="dashboard">

        {/* Suggested Repositories */}
        <aside className="suggested-container">
          <h3>Suggested Repositories</h3>

          {suggestedRepositories.length > 0 ? (
            suggestedRepositories.map((repo) => {
              const isStarred = starredRepositories.some(
                (starredRepo) => starredRepo._id === repo._id
              );

              return (
                <div
                  className="repo-card"
                  key={repo._id}
                  onClick={() => !isStarred && handleStar(repo._id)}
                  style={{ cursor: "pointer" }}
                >
                  <h4>{repo.name}</h4>
                  <p>{repo.description}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isStarred
                        ? handleUnstar(repo._id)
                        : handleStar(repo._id);
                    }}
                  >
                    {isStarred ? "Unstar ★" : "Star ☆"}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No suggested repositories found.</p>
          )}
        </aside>

        {/* Your Repositories */}
        <main className="main-container">
          <h2>Your Repositories</h2>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search your repository by name..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length > 0 ? (
            searchResults.map((repo) => {
              const isStarred = starredRepositories.some(
                (starredRepo) => starredRepo._id === repo._id
              );

              return (
                <div
                  className="repo-card"
                  key={repo._id}
                  onClick={() => !isStarred && handleStar(repo._id)}
                  style={{ cursor: "pointer" }}
                >
                  <h4>{repo.name}</h4>
                </div>
              );
            })
          ) : (
            <p className="empty-message">
              {searchQuery.trim()
                ? "No matching repositories found."
                : "No repositories found."}
            </p>
          )}
        </main>

        {/* Upcoming Events */}
        <aside className="events-container">
          <h3>Upcoming Events</h3>

          <ul>
            <li>Tech Conference - Dec 15</li>
            <li>Developer Meetup - Dec 25</li>
            <li>React Summit - Jan 5</li>
          </ul>
        </aside>

      </section>
    </>
  );
};

export default Dashboard;
