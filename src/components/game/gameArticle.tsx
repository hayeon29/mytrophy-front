'use client';

export default function GameArticle({ gameArticle }) {
  return (
    <div className="w-[904px] min-h-[87px] mb-[24px] flex justify-start items-center text-[#2E396C] text-[12px]">
      <div className="w-[64px] h-[64px] mr-[16px] bg-black" />
      <div className="w-[824px] flex  p-[24px] bg-[#f6f7ff] rounded-[15px] ">
        <div className="w-[80%] whitespace-pre-wrap overflow-hidden">
          <span className="text " style={{ wordWrap: 'break-word' }}>
            {gameArticle.content}
          </span>
        </div>
        <div className="w-[20%] h-full flex items-end justify-end whitespace-pre-wrap overflow-hidden">
          <span className="text" style={{ wordWrap: 'break-word' }}>
            {gameArticle.nickname}
          </span>
        </div>
      </div>
    </div>
  );
}
