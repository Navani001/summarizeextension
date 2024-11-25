let sessionData = {}; 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  
    if (message.action === "openPopup") {
      console.log("Copy button")
      sessionData.popupValue = message.text; 
     
      
  
      chrome.storage.local.set({ popupValue: message.text }, () => {
        console.log('Stored popupValue in chrome.storage.local');
    });

    // Store popupValue in chrome.storage.session (only persists during this session)
    // Note: sessionStorage is not available in background scripts, so we use chrome.storage.local for both
  
 
      if (message.action === "getPopupValue") {
        sendResponse({ value: sessionData.popupValue || null }) ; // Send the value to the popup
    }
        chrome.action.openPopup();

    
        sendResponse({ status: "popupOpened" });
    }
   
});
