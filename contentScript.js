document.addEventListener("mouseup", () => {
  const selection = window.getSelection()?.toString().trim();
  if (selection) {
    
    chrome.runtime.sendMessage({ type: "selectedText", text: selection }, (response) => {
      if (response?.status === "success") {
        
        console.log("Selection sent successfully");
      }
    });
  }
});


// Listen for clicks on the button with id="openExtension"
document.addEventListener("click", (event) => {
  console.log(event.target.value
  )
  // if (event.target.id === "copy-button") {
  //     chrome.runtime.sendMessage({ action: "copy-button" });
  // }
});
