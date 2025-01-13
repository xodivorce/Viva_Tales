import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const cat = useLocation().search;

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px'
      }
    );

    // Observe all post elements
    document.querySelectorAll('.post').forEach((post) => {
      observer.observe(post);
    });

    return () => observer.disconnect();
  }, [posts]); // Re-run when posts change

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts${cat}`);
        
        const sortedPosts = [...res.data].sort((a, b) => {
          return new Date(b.date) - new Date(a.date); // Sort by date, newer first
        });

        const currentTime = new Date();
        const newPosts = sortedPosts.filter(post => {
          const postTime = new Date(post.date);
          const timeDiff = currentTime - postTime;
          const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert time difference to hours
          return hoursDiff <= 24; // Show posts from the last 24 hours as "New"
        });

        const olderPosts = sortedPosts.filter(post => {
          const postTime = new Date(post.date);
          const timeDiff = currentTime - postTime;
          const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert time difference to hours
          return hoursDiff > 24; // Older posts (more than 24 hours ago)
        });

        const shuffledOlderPosts = shuffleArray(olderPosts);
        const finalPosts = [...newPosts, ...shuffledOlderPosts];
        setPosts(finalPosts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent;
    const words = text.split(" ");
    if (words.length > 150) {
      return words.slice(0, 150).join(" ") + "...";
    }
    return text;
  };

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

          /* Add a slight tilt effect on hover */
          .post:hover {
            transform: scale(1.02);
            transition: transform 0.3s ease;
          }

          /* Stagger the animations for a cascading effect */
          .post:nth-child(even) {
            transform: translateX(-20px);
          }

          .post:nth-child(odd) {
            transform: translateX(20px);
          }

          .post.show:nth-child(even),
          .post.show:nth-child(odd) {
            transform: translateX(0);
          }
        `}
      </style>
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post-img">
              <img 
                src={`../upload/${post.img}`} 
                alt="post cover" 
                loading="lazy" 
              />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
                {(new Date() - new Date(post.date)) / (1000 * 60 * 60) <= 24 && (
                  <span style={{
                    backgroundColor: '#ff4757',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginLeft: '10px'
                  }}>
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
        ))}
      </div>
    </div>
  );
};

export default Home;
