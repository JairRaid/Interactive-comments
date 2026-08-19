import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { ACTIONS } from "../data/commentData";

export const CommentContext = createContext();

const commentReducer = (state, action) => {
  const { type, payload } = action;

  if (type === ACTIONS.SET_DATA) {
    return payload.data;
  }

  if (type === ACTIONS.UPVOTE_COMMENT) {
    const delta = payload.voteDelta ?? 1;

    if (payload.commentType === "comment")
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === payload.id)
            return { ...comment, score: comment.score + delta };
          return comment;
        }),
      };

    if (payload.commentType === "reply")
      return {
        ...state,
        comments: state.comments.map((comment) => {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === payload.id)
                return { ...reply, score: reply.score + delta };
              return reply;
            }),
          };
        }),
      };
  }

  if (type === ACTIONS.DOWNVOTE_COMMENT) {
    const delta = payload.voteDelta ?? -1;

    if (payload.commentType === "comment")
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === payload.id)
            return {
              ...comment,
              score: comment.score + delta,
            };
          return comment;
        }),
      };
    if (payload.commentType === "reply")
      return {
        ...state,
        comments: state.comments.map((comment) => {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === payload.id)
                return {
                  ...reply,
                  score: reply.score + delta,
                };
              return reply;
            }),
          };
        }),
      };
  }

  if (type === ACTIONS.ADD_COMMENT) {
    const newComment = {
      id: state.comments.length + 1,
      content: payload.commentContent,
      createdAt: "Just now",
      score: 0,
      user: payload.currentUser,
      replies: [],
    };
    return { ...state, comments: [...state.comments, newComment] };
  }

  if (type === ACTIONS.DELETE_COMMENT) {
    if (payload.commentType === "comment")
      return {
        ...state,
        comments: state.comments.filter((comment) => payload.id !== comment.id),
      };

    if (payload.commentType === "reply") {
      return {
        ...state,
        comments: state.comments.map((comment) => {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== payload.id),
          };
        }),
      };
    }
  }

  if (type === ACTIONS.UPDATE_COMMENT) {
    if (payload.commentType === "comment")
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === payload.id) {
            return {
              ...comment,
              content: payload.content,
            };
          }
          return comment;
        }),
      };

    if (payload.commentType === "reply")
      return {
        ...state,
        comments: state.comments.map((comment) => {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === payload.id)
                return {
                  ...reply,
                  content: payload.content,
                };
              return reply;
            }),
          };
        }),
      };
  }

  if (type === ACTIONS.REPLY_COMMENT) {
    const newComment = {
      id: 21,
      content: payload.content,
      createdAt: "Just now",
      score: 0,
      replyingTo: payload.replyingTo,
      user: state.currentUser,
    };

    if (payload.commentType === "comment") {
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === payload.id) {
            const replyId = Number(
              `${comment.id}${comment.replies.length + 1}`,
            );
            return {
              ...comment,
              replies: [...comment.replies, { ...newComment, id: replyId }],
            };
          }
          return comment;
        }),
      };
    }

    if (payload.commentType === "reply") {
      console.log(payload.id + " " + payload.commentSourceId);
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === payload.commentSourceId) {
            console.log(payload.content + " " + payload.replyingTo);
            const replyId = Number(
              `${comment.id}${comment.replies.length + 1}`,
            );
            return {
              ...comment,
              replies: [...comment.replies, { ...newComment, id: replyId }],
            };
          }
          return comment;
        }),
      };
    }
  }

  return state;
};

export const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [votes, setVotes] = useState([]);
  const commentRef = useRef(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleCommentToDelete = (commentInfo) => {
    setCommentToDelete(commentInfo);
  };

  const value = {
    state,
    dispatch,
    commentRef,
    isModalVisible,
    showModal,
    hideModal,
    handleCommentToDelete,
    commentToDelete,
    votes,
    setVotes,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error("Error");

        const d = await response.json();
        dispatch({ type: ACTIONS.SET_DATA, payload: { data: d } });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};
