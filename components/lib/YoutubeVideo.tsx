export const YoutubeVideo = ({ link }: { link: string }) => {
  return (
    <div
      className="aspect-video w-full"
      dangerouslySetInnerHTML={{
        __html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      }}
    ></div>
  );
};
