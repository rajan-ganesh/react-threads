const ThreadInput = ({ user, text, setText, postThread }) => {
  return (
    <>
      <p>{user.handles}</p>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button
        className="primary"
        onClick={() => {postThread(); setText("");}}
        style={{ cursor: "pointer" }}
      >
        Post
      </button>
    </>
  );
};

export default ThreadInput;
