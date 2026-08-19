import { Fragment, useContext } from "react";
import "./App.css";
import CommentCard from "./components/CommentCard/CommentCard";
import { CommentContext } from "./context/CommentContext";
import { ACTIONS } from "./data/commentData";
import DeleteModal from "./components/DeleteModal/DeleteModal";
import { motion } from "framer-motion";

const App = () => {
  const { state, dispatch, commentRef } = useContext(CommentContext);

  const { currentUser, comments } = state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedComment = commentRef.current.value.trim() || "";
    dispatch({
      type: ACTIONS.ADD_COMMENT,
      payload: { commentContent: trimmedComment, currentUser },
    });
    commentRef.current.value = "";
  };

  if (!state) return <></>;

  return (
    <>
      <DeleteModal />
      <main className="comments-wrapper">
        <h1 className="sr-only">Intereactive Comments Section</h1>

        <section className="comments-list" aria-label="User Comments">
          {comments?.map((comment) => (
            <Fragment key={comment.id}>
              <CommentCard
                {...comment}
                currentUser={currentUser.username}
                commentType="comment"
              />
              {comment.replies.length !== 0 && (
                <>
                  <div
                    className="replies-container"
                    role="region"
                    aria-label="Replies to maxblagun"
                  >
                    {comment?.replies.map((reply) => (
                      <CommentCard
                        key={reply.id}
                        {...reply}
                        commentType="reply"
                        currentUser={currentUser.username}
                        commentSourceId={comment.id}
                      />
                    ))}
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </section>

        {/* Add comment */}
        <motion.form
          className="add-comment-form"
          aria-label="Add a comment"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label htmlFor="new-comment" className="sr-only">
            Add a comment
          </label>
          <textarea
            ref={commentRef}
            id="new-comment"
            className="new-comment"
            name="comment"
            rows="4"
            placeholder="Add a comment..."
            required
          ></textarea>

          <div className="form-footer">
            <img
              src="./avatars/image-juliusomo.webp"
              alt="juliusomo"
              className="avatar"
            />
            <button type="submit" className="btn-submit">
              SEND
            </button>
          </div>
        </motion.form>
      </main>
    </>
  );
};

export default App;
