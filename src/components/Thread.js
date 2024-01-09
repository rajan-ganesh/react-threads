import { useState, useEffect } from "react";
import moment from "moment";

const Thread = ({
  user,
  setOpenPopUp,
  filteredThread,
  getThreads,
  setInteractingThread,
}) => {
  const [replyCount, setReplyCount] = useState(0);
  const timePassed = moment().startOf("day").fromNow(filteredThread.timestamp);

  const handlePopUpOpen = () => {
    setOpenPopUp(true);
    setInteractingThread(filteredThread);
  };
  const postLike = async () => {
    const hasBeenLiked = filteredThread.likes.some(
      (like) => like.uuid === user.user_uuid
    );
    if (hasBeenLiked) {
      console.log("already liked by you");
      return;
    }
    try {
      filteredThread.likes.push({
        uuid: user.user_uuid,
      });
      await fetch(`http://localhost:3000/threads/${filteredThread.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredThread),
      });
      getThreads();
    } catch (error) {
      console.log(error);
    }
  };

  const getRepliesCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/threads?reply_to=${filteredThread.id}`
      );
      const data = await response.json();
      setReplyCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRepliesCount();
  }, [filteredThread]);

  return (
    <article className="feed-card">
      <div className="text-container">
        <div>
          <div className="img-container">
            <img src={user.img} alt="profile avatar" />
          </div>
          <div>
            <p>
              <strong>{user.handle}</strong>
            </p>
            <p>{filteredThread.text}</p>
          </div>
        </div>
        <p className="sub-text">{timePassed}</p>
      </div>
      <div className="icons">
        <svg
          //heart
          onClick={postLike}
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m7.234 3.004c-2.652 0-5.234 1.829-5.234 5.177 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-3.353-2.58-5.168-5.229-5.168-1.836 0-3.646.866-4.771 2.554-1.13-1.696-2.935-2.563-4.766-2.563zm0 1.5c1.99.001 3.202 1.353 4.155 2.7.14.198.368.316.611.317.243 0 .471-.117.612-.314.955-1.339 2.19-2.694 4.159-2.694 1.796 0 3.729 1.148 3.729 3.668 0 2.671-2.881 5.673-8.5 11.127-5.454-5.285-8.5-8.389-8.5-11.127 0-1.125.389-2.069 1.124-2.727.673-.604 1.625-.95 2.61-.95z"
            fill-rule="nonzero"
          />
        </svg>
        <svg
          //comment
          onClick={handlePopUpOpen}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M17.454 12.537c2.782 0 5.046 1.779 5.046 3.967 0 1.12-.462 1.745-1.102 2.509-.021.746-.049 1.054.139 1.866-.891-.306-.986-.396-1.666-.813-.894.218-1.489.38-2.465.38-3.087 0-4.998-2.046-4.998-3.942 0-2.188 2.264-3.967 5.046-3.967zm0-1.5c-3.436 0-6.546 2.292-6.546 5.467 0 2.799 2.633 5.442 6.498 5.442.699 0 1.44-.087 2.213-.275.914.561 2.933 1.128 4.352 1.385-.53-1.044-1.117-2.479-1.088-3.479.714-.853 1.117-1.953 1.117-3.073 0-3.158-3.089-5.467-6.546-5.467zm-8.485 4.614c-1.138-.11-1.611-.247-2.611-.491-.97.596-1.26.815-3.008 1.374.418-1.514.364-2.183.333-3.183-.834-1-1.683-2.07-1.683-3.943 0-3.502 3.589-6.352 8-6.352 4.264 0 7.748 2.664 7.978 6.004.698.038 1.377.14 2.021.315-.022-4.834-4.762-8.319-9.999-8.319-5.281 0-10 3.527-10 8.352 0 1.71.615 3.391 1.705 4.695.047 1.527-.851 3.718-1.661 5.313 2.168-.391 5.252-1.258 6.649-2.115.802.196 1.578.314 2.33.374-.135-.749-.148-1.317-.054-2.024z" />
        </svg>
        <svg
          //repost
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M9 11v2h2.953l1.594 2h-6.547v-4h-2l3-4 3 4h-2zm6 0v-2h-2.922l-1.594-2h6.516v4h2l-3 4-3-4h2zm-3-8c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006z" />
        </svg>
        <svg
          //share
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 12l11 3.1 7-8.1-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339-2.17 2.925v-.769l-2-.56v7.383l4.473-6.031 4.527 4.031 6-22z" />
        </svg>
      </div>
      <p className="sub-text">
        <span style={{ cursor: "pointer" }} onClick={handlePopUpOpen}>
          {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </span>{" "}
        •{" "}
        <span>
          {filteredThread.likes.length}{" "}
          {filteredThread.likes.length === 1 ? "like" : "likes"}
        </span>
      </p>
    </article>
  );
};

export default Thread;
