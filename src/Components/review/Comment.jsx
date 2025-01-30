import React, { useState } from "react";
import { dateformat2 } from '@src/utils';
import { getProfilePhotoUrl } from '@src/utils';

const ReviewComment = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    // 저장 로직을 여기에 추가
    setIsEditing(false);
    // 서버에 수정된 내용을 보낼 수 있습니다.
  };

  return (
    <div className="review_wrap">
      <div className="review_img">
        <img
          src={comment?.user_photo == "알수없음" ? "/images/default_profile.png" : getProfilePhotoUrl(comment.user_photo)}
          alt="User Photo"
        />
      </div>
      <div className="review_detail">
        <div className="review_detail_head">
          <div className="review_detail_left">
            <div className="review_profile">
              <span className="review_nickname">@{comment.nickname}</span>
            </div>
            <div className="review_content">
              <div className="review_info">
                <span className="review_date">
                  {dateformat2(comment.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="review_detail_right">
            <span onClick={handleEditClick}>{isEditing ? "취소" : "수정"}</span>
            <span>삭제</span>
          </div>
        </div>
        <div className="review_text">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={handleContentChange}
              rows="4"
              cols="50"
            />
          ) : (
            <span>{comment.content}</span>
          )}
        </div>
        {isEditing && (
          <button onClick={handleSave}>저장</button>
        )}
      </div>
    </div>
  );
};

const ReviewCommentContainer = ({ review }) => {
  return (
    <div className="commentContainer">
      {review.comments &&
        review.comments.map((comment, index) => {
          return <ReviewComment key={index} comment={comment} />;
        })}
    </div>
  );
};

export default ReviewCommentContainer;
