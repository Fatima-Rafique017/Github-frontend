
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import HeatMapProfile from "./HeatMap";

import Navbar from "../Navbar";

import { BookIcon, RepoIcon } from "@primer/octicons-react";

import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "",
  });

  const [repositories, setRepositories] = useState([]);

  const { setCurrentUser } = useAuth();

  // Fetch User Details
  const fetchUserDetails = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/auth", { replace: true });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/userProfile/${userId}`
      );

      console.log("User Profile:", response.data);

      const userData = response.data.user || response.data;

      setUserDetails({
        ...userData,
        username: userData.username || userData.name || "",
      });

    } catch (err) {
      console.error("Cannot fetch user details:", err);
    }
  };

  // Fetch User Repositories
  const fetchRepositories = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/repo/user/${userId}`
      );

      setRepositories(response.data.repositories || []);

      console.log("Repositories:", response.data.repositories);

    } catch (err) {
      console.error("Cannot fetch repositories:", err);
    }
  };

  // Load Profile Data
  useEffect(() => {
    fetchUserDetails();
    fetchRepositories();
  }, []);

  // Delete Repository
  const handleDeleteRepository = async (repoId) => {
    const userId = localStorage.getItem("userId");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/repo/delete/${repoId}`,
        {
          params: {
            userId: userId,
          },
        }
      );

      alert("Repository deleted successfully!");

      await fetchRepositories();

    } catch (err) {
      console.error("Delete Repository Error:", err);

      alert(
        err.response?.data?.error ||
        "Repository could not be deleted!"
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setCurrentUser(null);

    navigate("/auth", { replace: true });
  };

  return (
    <>
      <Navbar />

      {/* Overview + Starred Repositories */}

      <div className="profile-nav">
        <div className="profile-nav-content">

          <div
            className="profile-nav-item active"
            onClick={() => navigate("/profile")}
          >
            <BookIcon size={20} />
            <span>Overview</span>
          </div>

          <div
            className="profile-nav-item"
            onClick={() => navigate("/starred")}
          >
            <RepoIcon size={20} />
            <span>Starred Repositories</span>
          </div>

        </div>
      </div>

      {/* Logout */}

      <button onClick={handleLogout} id="logout">
        Logout
      </button>

      {/* Profile Section */}

      <div className="profile-page-wrapper">

        <div className="user-profile-section">

          <div className="profile-image"></div>

          <div className="name">
            <h3>
              {userDetails.username || "Loading..."}
            </h3>
          </div>

          <button className="follow-btn">
            Follow
          </button>

          <div className="follower">
            <p>10 Follower</p>
            <p>3 Following</p>
          </div>

        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>

      </div>

      {/* Repository Section */}

      <div className="repository-section">

        <div className="repository-heading">
          <h2>Repositories</h2>
        </div>

        {/* Display Repositories */}

        <div className="repository-list">

          {repositories.length === 0 ? (

            <p className="no-repo">
              No repositories found. Create your first repository!
            </p>

          ) : (

            repositories.map((repo) => (

              <div className="repository-card" key={repo._id}>

                <div className="repo-card-heading">

                  <h3>
                    <RepoIcon size={18} />
                    {repo.name}
                  </h3>

                  <span className="repo-visibility">
                    {repo.visibility ? "Public" : "Private"}
                  </span>

                </div>

                <p>
                  {repo.description || "No description provided"}
                </p>

                <small>
                  Created: {
                    repo.createdAt
                      ? new Date(repo.createdAt).toLocaleDateString()
                      : "Recently"
                  }
                </small>

                {/* Repository Buttons */}

                <div className="repo-actions">

                  <button
                    className="edit-repo-btn"
                    onClick={() =>
                      navigate(`/repo/update/${repo._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-repo-btn"
                    onClick={() =>
                      handleDeleteRepository(repo._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </>
  );
};

export default Profile;



