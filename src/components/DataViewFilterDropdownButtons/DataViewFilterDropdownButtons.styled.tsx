import styled from "styled-components";
import ButtonRow from "../ButtonRow";

export const StyledWrapper = styled.div`
  & {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
`;

export const StyledButtonRow = styled(ButtonRow)`
  .button + .normalButton {
    margin: 0;
  }
`;
