import styled from 'styled-components';

// Material UI
import Dialog from '@material-ui/core/Dialog';

// Utils
import theme from '@root/theme';

export const StyledDialog = styled(Dialog)`
  font-family: ${theme.fontFamily};

  .MuiDialogContent-root {
    border-bottom: 2px solid ${theme.colors.gray200};
  }

  .MuiPaper-rounded {
    border-radius: 0;
  }

  .MuiDialogContent-root {
    padding: 40px 40px 24px 40px;
  }

  .MuiDialog-paperWidthSm {
    max-width: 1040px;
  }

  .MuiDialogActions-root {
    padding: 20px 40px;
  }

  .MuiDialogActions-spacing > :not(:first-child) {
    margin-left: 20px;
  }
`;

export const StyledDialogDesktopTitle = styled.div`
  align-items: center;
  background-color: ${theme.colors.gray200};
  color: ${theme.colors.almostBlack};
  display: flex;
  font-size: 20px;
  font-weight: ${theme.fontWeight.medium};
  height: 56px;
  justify-content: space-between;
  padding: 0 40px;

  .MuiIconButton-root {
    color: ${theme.colors.almostBlack};
    padding: 0;
    &:hover {      
      background-color: transparent;
    }
  }
`;

export const StyledDialogMobileTitle = styled(StyledDialogDesktopTitle)`
  font-size: 18px;
  padding: 0 20px;

  svg {
    margin-right: 8px;
  }
`;
