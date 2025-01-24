import { type CommentType, postComment } from "@/actions/comment";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { TbArrowBack, TbArrowBackUp, TbArrowForward, TbArrowUp } from "react-icons/tb";

export default function Comment({
  comment,
}: {
  comment: CommentType;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (replyText) {
      const payload = {
        postId: comment?.postId,
        comment: replyText,
        parentCommentId: comment.id,
      };
      const response = await postComment(payload);
      if (response.id) {
        setReplyText("");
        setShowReply(false)
      }
    }
  };


  return (
    <div className={`group hover:shadow-xl hover:shadow-gray-200/70 hover:border-gray-300 shadow shadow-gray-200/60 border border-gray-100 rounded flex gap-2  w-full p-4`}>
      {comment.depth !== 0 && <TbArrowForward className="text-xl text-gray-300" />}
      <div
        className={`list-none space-y-2 w-full`}
        key={comment.id}
      >
        <div className="flex gap-2 text-gray-500 text-sm md:text-[11px]">
          <Link href={`/user/${comment.userId}`} className="text-gray-500">
            {comment.user.username}
          </Link> /
          <span>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p>{comment.description}</p>
        {showReply && (
          <div className={""}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className={
                "min-h-16 w-full resize-none rounded border bg-gray-50 p-2"
              }
              placeholder={"Reply to this comment"}
            ></textarea>
            <div className="space-x-2">
              <button
                onClick={handleReply}
                className={
                  "rounded bg-indigo-500/10 font-medium px-2 py-1.5 text-xs  text-indigo-500"
                }
              >
                Submit
              </button>
              <button
                onClick={() => setShowReply(false)}
                className={
                  "rounded bg-gray-500/10 px-2 py-1.5 text-xs font-medium text-gray-500 "
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showReply && <button
          onClick={() => setShowReply((prev) => !prev)}
          className={"text-sm md:text-xs text-gray-400 hover:text-indigo-700 flex items-center gap-2 "}
        >
          Reply<TbArrowBackUp />
        </button>}
        {comment.replies.length ? comment.replies.map(item => <Comment key={item.id} comment={item} />) : <></>}
      </div>
    </div>
  );
}
