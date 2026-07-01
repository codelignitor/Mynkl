export const useSelection = () => {
  
  // Handle anonymous send selection
  const handleAnonymousSend = () => {
    console.log('Send Anonymously selected');
    // Add your navigation or logic here
    // Example: navigation.navigate('AnonymousSend');
  };

  // Handle normal send selection
  const handleNormalSend = () => {
    console.log('Send Normally selected');
    // Add your navigation or logic here
    // Example: navigation.navigate('NormalSend');
  };

  return {
    handleAnonymousSend,
    handleNormalSend,
  };
};