import { useContext, useRef, useState } from "react";
import ScoreCounter from "../ScoreCounter/ScoreCounter";
import "./CommentCard.css";
import { CommentContext } from "../../context/CommentContext";
import { ACTIONS } from "../../data/commentData";
import { motion } from "framer-motion";

const CommentCard = ({
  id,
  createdAt,
  content,
  score,
  user,
  currentUser,
  commentType,
  replyingTo,
  commentSourceId,
}) => {
  const { image, username } = user;

  const { showModal, dispatch, handleCommentToDelete } =
    useContext(CommentContext);
  const [edit, setEdit] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [commentInput, setCommentInput] = useState(content);
  const replyRef = useRef("");

  const handleDelete = () => {
    handleCommentToDelete({ commentId: id, commentType: commentType });
    showModal();
  };

  const handleEdit = () => {
    setEdit(id);
  };

  const handleChange = (e) => {
    const cleanedText = e.target.value.replace(/@\w+\s*/, "");
    setCommentInput(cleanedText);
  };

  const handleUpdate = () => {
    if (!commentInput) return;
    const trimmedComment = commentInput.trim();
    dispatch({
      type: ACTIONS.UPDATE_COMMENT,
      payload: {
        id: id,
        commentType: commentType,
        content: trimmedComment,
        commentSourceId: commentSourceId,
      },
    });
    setEdit("");
  };

  const handleReply = () => {
    setIsReply((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!replyRef.current.value) return;
    const trimmedComment = replyRef.current.value.trim();

    dispatch({
      type: ACTIONS.REPLY_COMMENT,
      payload: {
        id: id,
        commentType: commentType,
        content: trimmedComment,
        replyingTo: username,
        commentSourceId: commentSourceId,
      },
    });

    setIsReply(false);
  };

  return (
    <>
      <motion.article
        className="comment-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="comment-content">
          <header className="comment-header">
            <img
              className="avatar"
              src={image.webp}
              alt={username}
              width="32"
              height="32"
            />
            <span className="username">{username}</span>
            {currentUser === username && (
              <span className="user-badge" aria-label="You">
                you
              </span>
            )}
            <time className="timestamp">{createdAt}</time>
          </header>
          {edit ? (
            <>
              <textarea
                id="update-comment"
                className="update-comment"
                name="comment"
                rows="4"
                value={`${!replyingTo ? "" : "@" + replyingTo + " "}${commentInput}`}
                onChange={handleChange}
                required
              ></textarea>
              <button
                className="btn-update"
                type="button"
                onClick={handleUpdate}
              >
                UPDATE
              </button>
            </>
          ) : (
            <p className="comment-body">
              {commentType === "reply" && (
                <a href={`#${replyingTo}`} className="reply-mention">
                  @{replyingTo + " "}
                </a>
              )}
              {content}
            </p>
          )}
        </div>

        <footer className="comment-footer">
          <ScoreCounter
            score={score}
            commentId={id}
            commentType={commentType}
          />

          {currentUser !== username ? (
            <button
              type="button"
              className="btn-action btn-reply"
              aria-label="Reply to amyrobson"
              onClick={handleReply}
            >
              <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                  fill="currentColor"
                />
              </svg>
              Reply
            </button>
          ) : (
            <>
              {edit.length === 0 && (
                <div className="user-actions">
                  <button
                    type="button"
                    className="btn-action btn-delete"
                    onClick={() => handleDelete("id")}
                  >
                    <svg
                      width="12"
                      height="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                        fill="currentColor"
                      />
                    </svg>
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn-action btn-edit"
                    onClick={handleEdit}
                  >
                    <svg
                      width="14"
                      height="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                        fill="currentColor"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
              )}
            </>
          )}

          {/* {edit && (
            <button className="btn-update" type="button" onClick={handleUpdate}>
              UPDATE
            </button>
          )} */}
        </footer>
      </motion.article>

      {/* Reply form */}
      {isReply && (
        <motion.form
          className="reply-comment-form"
          aria-label="Add a comment"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <label htmlFor="new-comment" className="sr-only">
            Add a comment
          </label>
          <textarea
            ref={replyRef}
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
              REPLY
            </button>
          </div>
        </motion.form>
      )}
    </>
  );
};

export default CommentCard;
