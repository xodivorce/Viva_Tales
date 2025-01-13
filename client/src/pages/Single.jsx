import React, { useContext, useEffect, useState } from "react";
import EditImage from "../images/edit.png";
import DeleteImage from "../images/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";

const Single = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const ensureAbsoluteUrl = (url) => {
    if (!url) return url;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const createMarkup = (htmlContent) => {
    if (!htmlContent) return { __html: "" };

    const div = document.createElement("div");
    div.innerHTML = htmlContent;

    const links = div.getElementsByTagName("a");
    for (let link of links) {
      const href = link.getAttribute("href");
      if (href) {
        link.setAttribute("href", ensureAbsoluteUrl(href));
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    }

    return {
      __html: div.innerHTML,
    };
  };

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="post cover" />
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="user" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={EditImage} alt="edit" />
              </Link>
              <img onClick={handleDelete} src={DeleteImage} alt="delete" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <div
          className="desc"
          dangerouslySetInnerHTML={createMarkup(post.desc)}
        />
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
