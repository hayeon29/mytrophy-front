import articleAPI from '@/services/article';
import ArticleDetail from '@/components/article/ArticleDetail';
import gameAPI from '@/services/game';
import { ArticleType } from '@/types/Article';

async function getArticleDetail(id: string): Promise<ArticleType | null> {
  const articleResponse = await articleAPI.getArticleDetail(id);
  if (articleResponse.status === 200) {
    return articleResponse.data;
  }
  return null;
}

async function getGameDetail(appId: number | null) {
  if (appId === null) {
    return null;
  }
  const gameResponse = await gameAPI.getGameDetail(appId.toString());
  if (gameResponse.status === 200) {
    return gameResponse.data;
  }
  return null;
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const articleDetail = await getArticleDetail(id);
  const gameDetail = await getGameDetail(articleDetail?.appId);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] h-full bg-whiteBlue py-8 px-12 relative">
      <ArticleDetail articleData={articleDetail} gameData={gameDetail} />
    </div>
  );
}
