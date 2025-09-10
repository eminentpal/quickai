import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'import': 'url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap')',
  'import': ''tailwindcss'',
  '*': {
    'fontFamily': ''Outfit', sans-serif'
  },
  // Primary collor of our theme
  '@theme': {
    'ColorPrimary': '#5044e5'
  },
  'reset-tw': {
    'all': 'revert !important'
  },
  'reset-tw *': {
    'all': 'revert !important'
  },
  'cl-drawerRoot': {
    'zIndex': '10'
  }
});
