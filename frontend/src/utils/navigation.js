// Navigation utility for smooth page transitions

export const navigateWithTransition = (url) => {
  window.location.href = url;
};

export const showLogoutTransition = () => {
  // Show a brief "Logging out..." message
  const logoutMessage = document.createElement('div');
  logoutMessage.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px 40px;
      border-radius: 10px;
      font-size: 18px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <div style="
        width: 20px;
        height: 20px;
        border: 2px solid #fff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      Logging out...
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(logoutMessage);
  
  // Remove message after 1.5 seconds
  setTimeout(() => {
    if (logoutMessage.parentNode) {
      logoutMessage.parentNode.removeChild(logoutMessage);
    }
  }, 1500);
};

// Enhanced logout with smooth transition
export const enhancedLogout = async (logoutFunction) => {
  showLogoutTransition();
  
  // Set flag for welcome back message
  sessionStorage.setItem('justLoggedOut', 'true');
  
  // Wait a bit for the message to show
  setTimeout(async () => {
    await logoutFunction();
    navigateWithTransition('/');
  }, 800);
};
