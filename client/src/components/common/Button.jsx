import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const variants = {
  primary: css`
    background: ${theme.colors.primary.main};
    color: ${theme.colors.primary.contrastText};
    
    &:hover {
      background: ${theme.colors.primary.dark};
    }
  `,
  secondary: css`
    background: ${theme.colors.secondary.main};
    color: ${theme.colors.secondary.contrastText};
    
    &:hover {
      background: ${theme.colors.secondary.dark};
    }
  `,
  outline: css`
    background: transparent;
    border: 2px solid ${theme.colors.primary.main};
    color: ${theme.colors.primary.main};
    
    &:hover {
      background: ${theme.colors.primary.main};
      color: ${theme.colors.primary.contrastText};
    }
  `
};

const sizes = {
  small: css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  `,
  medium: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.base};
  `,
  large: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.lg};
  `
};

export const Button = styled.button`
  ${({ variant = 'primary' }) => variants[variant]}
  ${({ size = 'medium' }) => sizes[size]}
  
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: ${theme.transitions.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;