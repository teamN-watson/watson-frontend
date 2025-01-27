import React, { useState } from 'react';
import { Rating } from '@mantine/core';
import { dateformat2 } from '@src/utils';

export default function Review({ navigate, review, isActive, click }) {
  return (
    <div className={`review_wrap ${isActive ? "active_review" : ""}`}>
        <div className='review_img' onClick={()=>navigate(`/profile/${review.user}`)}>
            <img src={review.photo ? review.photo : "/images/default_profile.png"} alt="User Photo" />
        </div>
        <div className='review_detail' onClick={()=>navigate(`/profile/${review.user}`)}>
            <div className='review_profile'>
                <span className='review_nickname'>@{review.nickname}</span>
            </div>
            <div className='review_content'>
                <div className='review_info'>
                    <Rating value={review.score} fractions={2} readOnly />
                    <span className='review_date'>{dateformat2(review.created_at)}</span>
                </div>
            </div>
            <div className='review_text'>
                <span>{review.content}</span>
            </div>
        </div>
        <div className='review_comment'>
            <button onClick={(e) => {e.preventDefault();click(review.id)}}>댓글쓰기</button>
        </div>
    </div>
  );
}
