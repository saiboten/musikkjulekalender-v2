import styled from "styled-components";

export const Spacer = styled.div<{ multiply?: number }>`
  margin-top: ${(props) =>
    props.multiply ? `${props.multiply * 2}rem}` : "1rem"};
`;
