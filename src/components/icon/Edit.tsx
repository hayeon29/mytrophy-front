export default function Edit({
  fill = '#FFFFFF',
  width = 18,
  height = 18,
}: {
  fill?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={`${width}`}
      height={`${height}`}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.71 4.04006C18.1 3.65006 18.1 3.00006 17.71 2.63006L15.37 0.290059C15 -0.0999414 14.35 -0.0999414 13.96 0.290059L12.12 2.12006L15.87 5.87006M0 14.2501V18.0001H3.75L14.81 6.93006L11.06 3.18006L0 14.2501Z"
        fill={fill}
      />
    </svg>
  );
}
