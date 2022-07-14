import styled from "styled-components";

const Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

export const YoutubeVideo = ({ link }: { link: string }) => {
  return (
    <Wrapper
      dangerouslySetInnerHTML={{
        __html: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      }}
    ></Wrapper>
  );
};
