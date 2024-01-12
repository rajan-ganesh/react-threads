import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Header from "./components/Header";
import Feed from "./components/Feed";
import PopUp from "./components/PopUp";
import WriteIcon from "./components/WriteIcon";

const App = () => {
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState(null);
  const [viewThreadsFeed, setViewThreadsFeed] = useState(true);
  const [filteredThreads, setFiltereredThreads] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [interactingThread, setInteractingThread] = useState(null);
  const [popUpFeedThreads, setPopUpFeedThreads] = useState(null);
  const [text, setText] = useState(null);

  const userId = "uuid1";

  const getUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users?user_uuid=${userId}`
      );
      const data = await response.json();
      console.log("user: ", data);
      setUser(data[0]);
    } catch (error) {
      console.log(error);
    
    }
  };

  const getThreadsFeed = () => {
    if (viewThreadsFeed) {
      const standaloneThreads = threads?.filter(
        (thread) => thread.reply_to === null
      );
      setFiltereredThreads(standaloneThreads);
    } else {
      const replyThreads = threads?.filter(
        (thread) => thread.reply_to !== null
      );
      setFiltereredThreads(replyThreads);
    }
  };

  useEffect(() => {
    getThreadsFeed();
  }, [viewThreadsFeed, user, threads]);

  useEffect(() => {
    getUser();
    getThreads();
  }, []);

  const getThreads = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/threads?thread_from=${userId}`
      );
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReplies = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/threads?reply_to=${interactingThread.id}`
      );
      const data = await response.json();
      setPopUpFeedThreads(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReplies();
  }, [interactingThread]);

  const postThread = async () => {
    const thread = {
      timestamp: new Date(),
      thread_from: user.user_uuid,
      thread_to: user.user_uuid || null,
      reply_to: interactingThread?.id || null,
      text: text,
      likes: [],
    };
    try {
      const response = await fetch(`http://localhost:3000/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thread),
      });
      const result = await response.json()
      console.log(result)
      getThreads();
      getReplies();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user && (
        <div className="app">
          <Nav url={user.instagram_url} />
          <Header
            user={user}
            viewThreadsFeed={viewThreadsFeed}
            setViewThreadsFeed={setViewThreadsFeed}
          />
          <Feed
            user={user}
            threads={threads}
            filteredThreads={filteredThreads}
            setOpenPopUp={setOpenPopUp}
            getThreads={getThreadsFeed}
            setInteractingThread={setInteractingThread}
          />
          {openPopUp && (
            <PopUp
              user = {user}
              setOpenPopUp={setOpenPopUp}
              popUpFeedThreads={popUpFeedThreads}
              text = {text}
              setText = {setText}
              postThread={postThread}
            />
          )}
          <div onClick={() => setOpenPopUp(true)}>
            <WriteIcon />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
