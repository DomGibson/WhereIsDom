// styles.js
const cardStyles = {
    baseStyle: {
      p: 4,
      borderWidth: 1,
      borderRadius: 'md',
      boxShadow: 'lg',
      bg: 'white',
    },
    hoverStyle: {
      _hover: {
        boxShadow: 'xl',
        cursor: 'pointer',
      },
    },
  };
  
  const mapContainerStyles = {
    width: '100%',
    height: '400px',
    borderRadius: 'md',
    border: '1px solid #e2e8f0', // Chakra UI color for border
    boxShadow: 'lg',
  };
  
  const buttonStyles = {
    baseStyle: {
      colorScheme: 'teal',
      size: 'md',
      width: 'full',
    },
  };
  
  const gridStyles = {
    baseStyle: {
      columns: [1, null, 2], // 1 column on small screens, 2 columns on medium and larger screens
      spacing: 4,
    },
  };
  
  export { cardStyles, mapContainerStyles, buttonStyles, gridStyles };
  