// Inject custom selection styles
const style = document.createElement("style");
style.innerHTML = `
  ::selection {
    background-color: yellow; /* Change background color */
    color: red; /* Change text color */
  }
`;
document.head.appendChild(style);

console.log("Custom selection styles injected.");
// Listen for clicks on the button with id="openExtension"
document.addEventListener("click", (event) => {
  // if (event.target.id === "copy-button") {
  //     chrome.runtime.sendMessage({ action: "copy-button" });
  // }
});
