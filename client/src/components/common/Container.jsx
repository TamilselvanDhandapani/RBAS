import styled from 'styled-components';
import { theme, media } from '../../styles/theme';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};

  ${media.down('sm')} {
    padding: 0 ${theme.spacing.sm};
  }
`;