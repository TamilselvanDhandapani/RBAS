// Theme configuration
export const theme = {
  colors: {
    primary: {
      main: '#1a1a1a',
      light: '#2c2c2c',
      dark: '#000000',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#d4a373',
      light: '#e3b7a0',
      dark: '#bc8a5f',
      contrastText: '#ffffff'
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
      accent: '#faf6f1'
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6c757d',
      disabled: '#adb5bd'
    },
    error: '#dc3545',
    success: '#198754',
    warning: '#ffc107',
    info: '#0dcaf0'
  },
  typography: {
    fontFamily: {
      primary: "'Tenor Sans', sans-serif",
      secondary: "'Cormorant Garamond', serif"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.05)'
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.45s ease'
  }
};

// Mixins for common styles
export const mixins = {
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  absoluteCenter: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
  container: `
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  `,
  buttonReset: `
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    outline: none;
  `
};

// Media queries
export const media = {
  up: (breakpoint) => `@media (min-width: ${theme.breakpoints[breakpoint]})`,
  down: (breakpoint) => `@media (max-width: ${theme.breakpoints[breakpoint]})`
};