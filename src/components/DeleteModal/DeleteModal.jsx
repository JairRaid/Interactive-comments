import { useContext } from "react";
import "./DeleteModal.css";
import { CommentContext } from "../../context/CommentContext";
import { ACTIONS } from "../../data/commentData";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const DeleteModal = () => {
  const {
    isModalVisible,
    hideModal,
    dispatch,
    commentToDelete,
    handleCommentToDelete,
  } = useContext(CommentContext);
  const { commentId, commentType } = commentToDelete || {};

  const onClose = () => {
    handleCommentToDelete(null);
    hideModal();
  };

  const onDelete = () => {
    dispatch({
      type: ACTIONS.DELETE_COMMENT,
      payload: { id: commentId, commentType: commentType },
    });
    hideModal();
  };

  return createPortal(
    <motion.div
      key={commentId + "d"}
      className={`modal-overlay ${isModalVisible ? "" : "invisible"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="modal-card">
        <h2 className="modal-title">Delete comment</h2>
        <p className="modal-description">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            NO, CANCEL
          </button>
          <button className="btn btn-delete" onClick={onDelete}>
            YES, DELETE
          </button>
        </div>
      </div>
    </motion.div>,
    document.getElementById("modal"),
  );
};

export default DeleteModal;
