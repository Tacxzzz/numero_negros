export const goToBet88 = () => {
  // Mark that the user has been redirected
  sessionStorage.setItem('redirectedToBet88', 'true');
  
  // Hard redirect
  window.location.replace('https://bet88.ph');
};