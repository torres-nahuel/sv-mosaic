import styled from "styled-components";
import theme from "@root/theme";

export const FormDrawerWrapper = styled.div`
  height: 100vh;

  &.mapCoordinates,
  &.address {
    width: 1060px;
  }

  &.mapCoordinates {
    @media (max-width: ${theme.breakpoints.mobile}) {
      width: 100vw;
    }
  }

  &.advancedSelection {
    & .checkbox-list-field-wrapper div:first-child {
      width: 100% !important;
    }
    & .topBlock {
      max-width: 800px;
      min-height: calc(100vh - 110px);
      min-width: 600px;
      padding: 0 14px;
      width: 50vw;

      .options {
        width: 70%;
      }

      .selected {
        width: 30%;
      }
    }

		& .topBlock hr {
			margin: -24px 0px 0px 0px;
		}
  }
`;

export const DragAndDropContainer = styled.div`
  align-items: center;
  border: ${(pr) => (pr.isOver ? `1px dashed ${theme.newColors.realTeal["100"]}` : "")};
  background-color: ${(pr) => (pr.isOver ? theme.newColors.realTeal["20"] : theme.newColors.grey2["100"])};
  display: flex;
  flex-direction: column;
  height: 204px;
  justify-content: center;
  position: relative;
  width: ${pr => pr.width ? pr.width : "300px"};

  & .button {
    z-index: 1000;
  }
`;

export const DragAndDropSpan = styled.span`
  color: ${(pr) => (pr.isOver ? theme.newColors.realTeal["100"] : theme.newColors.grey3["100"])};
  font-size: 16px;
  margin-bottom: ${(pr) => (pr.isOver ? "" : "24px")};
`;

export const FileInput = styled.input`
  height: 100%;
  opacity: 0;
  position: absolute;
  width: 100%;
  z-index: 100;

  &:focus {
    outline: none;
  }
`;

export const StyledDisabledText = styled.p`
  color: ${theme.newColors.almostBlack["100"]};
  font-family: ${theme.fontFamily};
  font-size: 16px;
  margin: 0px;
  padding: 0px;
  width: ${pr => pr.width ?? "auto"};
  word-break: break-all;
`;
