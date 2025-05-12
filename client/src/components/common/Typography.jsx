import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const baseStyles = css`
  margin: 0;
  font-family: ${({ variant = 'primary' }) => 
    variant === 'primary' 
      ? theme.typography.fontFamily.primary 
      : theme.typography.fontFamily.secondary};
  color: ${({ color = 'primary' }) => theme.colors.text[color]};
`;

export const H1 = styled.h1`
  ${baseStyles}
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: 600;
`;

export const H2 = styled.h2`
  ${baseStyles}
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: 600;
`;

export const H3 = styled.h3`
  ${baseStyles}
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: 500;
`;

export const H4 = styled.h4`
  ${baseStyles}
  font-size: ${theme.typography.fontSize.xl};
  font-weight: 500;
`;

export const Text = styled.p`
  ${baseStyles}
  font-size: ${({ size = 'base' }) => theme.typography.fontSize[size]};
  line-height: 1.6;
`;