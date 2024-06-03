import { Button, Input, Image } from '@nextui-org/react';

export default function Article() {
  return (
    <div className="bg-white h-screen mx-auto">
      <div className="max-w-screen-xl mx-auto relative bg-white p-5">
        <div className="left-4 relative justify-start items-start gap-4 inline-flex">
          <Button color="primary" variant="ghost">
            자유
          </Button>
          <Button color="primary" variant="ghost">
            정보
          </Button>
          <Button color="primary" variant="ghost">
            공략
          </Button>
          <Button color="primary" variant="ghost">
            리뷰
          </Button>
        </div>
      </div>
      <div className="bg-white flex justify-center items-center">
        <div className="w-auto border border-gray-300 p-4 flex items-center rounded-lg">
          <Image
            width={64}
            alt="main profile image"
            src="/svgs/mainprofile.svg"
          />
          <Input className="ml-4" placeholder="클릭 후 글을 작성해보세요." />
        </div>
      </div>
    </div>
  );
}
