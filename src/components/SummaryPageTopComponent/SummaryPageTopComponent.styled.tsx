import styled from "styled-components";
import theme from "../../theme";

export const StyledSummaryPageTopComponent = styled.div`
  background: white;
  border-bottom: 2px solid ${theme.newColors.grey2["100"]};
  color: ${theme.newColors.almostBlack["100"]};
  font-family: ${theme.fontFamily};
  padding: 24px 24px 16px 24px;
  display: flex;
  gap: 24px;
  align-items: center;

  .img-rounded {
    width: 71px;
    height: 71px;
    border: 2px solid ${theme.newColors.grey2["100"]};
    border-radius: 50%;
    opacity: 1;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
`;

export const ContainerTitle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & h1 {
    max-width: 650px;
  }

  & .checked,
  .unchecked {
    margin-left: 6px;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
`;

export const ContainerItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  div:last-child {
    border: none;
  }
`;

export const Item = styled.div`
  padding: 0 16px 0 0;
  margin-right: 16px;
  border-right: 2px solid ${theme.newColors.grey2["100"]};

  & p,
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin: 0px;
    font-size: 14px;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
