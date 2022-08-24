import styled from "styled-components";
import theme from "@root/theme";

// MUI
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const StyledInput = styled.input`
  background-color: ${theme.colors.gray100};
  border: none;
  color: ${theme.colors.almostBlack};
  flex-grow: 1;
  font-family: ${theme.fontFamily};
  font-size: 16px;

  &:focus {
    outline: none;
  }

  ::placeholder {
    color: ${theme.colors.gray600};
  }
`;

export const InputWrapper = styled.div`
  align-items: center;
  background-color: ${theme.colors.gray100};
  border: 1px solid ${theme.colors.simplyGray};
  display: flex;
  height: 49px;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 0 16px;
  width: ${pr => pr.isMobileView ? "" : "684px"};

  &:focus-within {
    border: 1px solid ${theme.colors.almostBlack};
  }
`;

export const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  margin-bottom: 16px;
  width: ${pr => pr.isMobileView || !pr.isModalOpen ? "" : "684px"};

  & > :not(:last-child) {
    margin-right: 12px;
  }

  & > * {
    margin-top: 8px;
  }
`;

export const OptionsCheckedModalWrapper = styled.div`
  margin-bottom: ${({ isModalOpen }) => (isModalOpen ? "15px" : "")};
  margin-top: ${({ isModalOpen }) => (isModalOpen ? "15px" : "")};
`;

export const ShowHideSpan = styled.span`
  color: ${theme.colors.gray700};
  cursor: pointer;
  display: flex;
  font-family: ${theme.fontFamily};
  width: fit-content;
`;

export const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  color: ${theme.colors.gray600};
  margin-left: 14px;
`;

export const StyledExpandLessIcon = styled(ExpandLessIcon)`
  color: ${theme.colors.gray600};
  margin-left: 14px;
`;

export const CategoryTitle = styled.span`
  color: ${theme.colors.almostBlack};
  display: inline-block;
  font-family: ${theme.fontFamily};
  font-size: 16px;
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: 16px;
`;

export const AdvancedSelectionWrapper = styled.div`
  max-width: 600px;
`;
