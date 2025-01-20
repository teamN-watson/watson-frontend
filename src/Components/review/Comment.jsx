import React, { useState } from 'react';
import axios from '@src/axiosInstance';

export default function ReviewComment({ comments, new_comment, content, contentChange }) {


  return (
    <div className="commentContainer">
      {comments && comments.map((comment, index) => {
        return (
          <div key={index} className='commentWrap'>
            <p>{comment.nickname}</p>
            <h2>{comment.content}</h2>

          </div>
        )
      })}
      <div>
        <h2>댓글 쓰기</h2>
        <div className='commentInput'>
          <form>
            <input type="text" value={content} onChange={(e) => contentChange(e)} />
            <input type='submit' value={"등록"} onClick={new_comment} />
          </form>
        </div>
      </div>
    </div>
  );
}
