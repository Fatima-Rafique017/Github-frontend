
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./createrepository.css";

const CreateRepository = () => {
  const navigate = useNavigate();

  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreateRepository = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first!");
      navigate("/auth");
      return;
    }

    if (!repoName.trim()) {
      alert("Repository name is required!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/repo/create",
        {
          owner: userId,
          name: repoName.trim(),
          description: description.trim(),
          visibility: visibility,
        }
      );

      console.log("Repository Created:", response.data);

      alert("Repository created successfully!");

      setRepoName("");
      setDescription("");
      setVisibility(true);

      navigate("/profile");

    } catch (error) {
      console.error("Create Repository Error:", error);

      alert(
        error.response?.data?.error ||
        "Repository could not be created!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-page">
        <form
          className="create-repo-form"
          onSubmit={handleCreateRepository}
        >
          <h2>Create a new repository</h2>

          <p>
            A repository contains all project files and their revision history.
          </p>

          <label>Repository Name</label>

          <input
            type="text"
            placeholder="Enter repository name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />

          <label>Description</label>

          <textarea
            placeholder="Enter repository description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Visibility</label>

          <select
            value={visibility.toString()}
            onChange={(e) => setVisibility(e.target.value === "true")}
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>

          <button
            type="submit"
            className="submit-repo-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Repository"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRepository;
