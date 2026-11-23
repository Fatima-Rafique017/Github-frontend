import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../Navbar";

const StarredRepos = () => {
  const navigate = useNavigate();
  const [starredRepos, setStarredRepos] = useState([]);

  useEffect(() => {
    const fetchStarredRepos = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        navigate("/auth", { replace: true });
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/repo/starred/${userId}`
        );

        console.log("Starred Repositories:", response.data);

        setStarredRepos(response.data.repositories || []);
      } catch (err) {
        console.error("Cannot fetch starred repositories:", err);
      }
    };

    fetchStarredRepos();
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div
        style={{
          color: "white",
          maxWidth: "700px",
          margin: "40px auto",
          padding: "0 20px",
        }}
      >
        <h2>Starred Repositories</h2>

        {starredRepos.length > 0 ? (
          starredRepos.map((repo) => (
            <div key={repo._id} style={{ marginTop: "20px" }}>
              <h4>{repo.name}</h4>
              <p style={{ color: "#cccccc" }}>{repo.description}</p>
            </div>
          ))
        ) : (
          <p style={{ marginTop: "20px" }}>No starred repositories yet.</p>
        )}

        <button
          onClick={() => navigate("/profile")}
          style={{ marginTop: "30px", cursor: "pointer" }}
        >
          Back to Profile
        </button>
      </div>
    </>
  );
};

export default StarredRepos;