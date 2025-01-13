import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const User = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/posts/user/${username}`);

        const sortedPosts = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setPosts(sortedPosts);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent;
    const words = text.split(" ");
    if (words.length > 150) {
      return words.slice(0, 150).join(" ") + "...";
    }
    return text;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.1, rootMargin: "20px" }
    );

    document.querySelectorAll(".post").forEach((post) => {
      observer.observe(post);
    });

    return () => observer.disconnect();
  }, [posts]);

  if (!username) {
    return <p>Username is missing in the URL.</p>;
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="home">
      <style>
        {`
          .post {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
          }

          .post.show {
            opacity: 1;
            transform: translateY(0);
          }

          /* Simple hover effect */
          .post:hover {
            transform: scale(1.02);
            transition: transform 0.3s ease;
          }

          /* Title style */
          h3 {
            font-size: 2.5rem;
            color: #333;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 30px;
            position: relative;
          }

          h3::after {
            content: "";
            position: absolute;
            width: ${username.length * 1}em;
            height: 3px;
            background-color: #ff4757;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
          }
        `}
      </style>
      <h3>{username.toUpperCase()}'S BLOGS</h3>
      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="post-img">
                <img
                  src={`../upload/${post.img}`}
                  alt={post.title}
                  loading="lazy"
                />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                  {(new Date() - new Date(post.date)) / (1000 * 60 * 60) <=
                    3 && (
                    <span
                      style={{
                        backgroundColor: "#ff4757",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        marginLeft: "10px",
                      }}
                    >
                      New
                    </span>
                  )}
                </Link>
                <p>{getText(post.desc)}</p>
                <Link className="link" to={`/post/${post.id}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontStyle: "italic",
              marginTop: "20px",
            }}
          >
            No blogs found for this user.
          </p>
        )}
      </div>
    </div>
  );
};

export default User;
