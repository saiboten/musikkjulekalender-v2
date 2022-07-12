export const Video = ({ link }: { link: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: link }}></div>;
};
