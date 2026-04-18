type AppTheme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
};

const theme: AppTheme = {
  colors: {
    primary: "#0070f3",
    secondary: "#1c1c1e",
    background: "#f5f5f5",
    text: "#333333",
    border: "#eaeaea",
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
    xlarge: "32px",
  },
  fonts: {
    body: '"Helvetica Neue", Arial, sans-serif',
    heading: '"Georgia", serif',
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
  },
};

export default theme;
