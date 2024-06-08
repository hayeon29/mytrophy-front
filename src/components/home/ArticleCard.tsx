'use client'

import React from "react";
import { HomeArticle } from "@/types/HomeArticle";
import { MdRecommend } from "react-icons/md";

interface ArticleCardProps {
    article: HomeArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {

    return(
        <div className="flex flex-col p-4 bg-[#F6F7FF] rounded-lg shadow-sm w-full max-w-[400px]">
            <div className="flex items-center mb-2">
                <span className="bg-[#5779E9] rounded-sm text-white px-2 py-0.5 text-sm mr-2">{article.header}</span>
                <span className="text-lg font-semibold text-[#2E396C]">{article.name}</span>
            </div>
            <p className="mb-2">{article.content}</p>
            <div className="flex items-center"> 
                <MdRecommend className="mr-1 text-[#5779E9] text-xl" />
                {/* <span className="text-[#5779E9] text-lg font-semibold">{article.cntUp}</span> */}
            </div>
        </div>
    );
};

export default ArticleCard