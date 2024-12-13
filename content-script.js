// Inject custom selection styles


// Listen for clicks on the button with id="openExtension"

let debounceTimeout;
let selectedText = "";
const handleMouseUp = () => {
  clearTimeout(debounceTimeout);
  let selection = window.getSelection();
  selectedText = selection?.toString().trim();
  console.log(selectedText);
  let buttonContainer = document.getElementById("action-buttons-container");
  if (selectedText.length == 0 && buttonContainer) {
    console.log(selectedText == "", selectedText.length);

    buttonContainer.parentNode.removeChild(buttonContainer);
  }
  if (!selectedText) return;

  const range = selection?.getRangeAt(0);
  const rect = range?.getBoundingClientRect();

  if (rect) {
    let buttonContainer = document.getElementById("action-buttons-container");
    if (!buttonContainer) {
      buttonContainer = document.createElement("div");
      buttonContainer.id = "action-buttons-container";
      buttonContainer.style.position = "absolute";
      buttonContainer.style.zIndex = "9999";
      buttonContainer.style.display = "flex";
      buttonContainer.style.flexDirection = "row";
      buttonContainer.style.gap = "5px";

      // Create buttons
      const createButton = (text, backgroundColor, onClickHandler) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.backgroundColor = backgroundColor;
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.padding = "5px 10px";
        button.style.cursor = "pointer";
        button.addEventListener("click", onClickHandler);
        return button;
      };

      const copyButton = createButton("Copy", "#007bff", () => {
        selection = window.getSelection();
        selectedText = selection?.toString().trim() || "hi";
        console.log(selectedText);
        window.navigator.clipboard.writeText(selectedText).then(() => {
          // alert(`Copied: ${selectedText}`);
          chrome.runtime.sendMessage({
            action: "openPopup",
            text: selectedText,
          });
          // sendMessage(selectedText + "" || "");
        });
      });

      const summaryButton = createButton("Summary", "#28a745", () => {
        selection = window.getSelection();
        selectedText = selection?.toString().trim() || "hi";
        console.log(selectedText);
        window.navigator.clipboard.writeText(selectedText).then(() => {
          // alert(`Copied: ${selectedText}`);
          chrome.runtime.sendMessage({
            action: "openPopup",
            text: selectedText + " summarization the content simpler",
          });
         
        });
      });

      const answerButton = createButton("Answer", "#ffc107", () => {
        selection = window.getSelection();
        selectedText = selection?.toString().trim() || "hi";
        console.log(selectedText);
        window.navigator.clipboard.writeText(selectedText).then(() => {
          // alert(`Copied: ${selectedText}`);
          chrome.runtime.sendMessage({
            action: "openPopup",
            text: selectedText + " answer the question",
          });
         
        });
      });

      // Append buttons to the container
      buttonContainer.appendChild(copyButton);
      buttonContainer.appendChild(summaryButton);
      buttonContainer.appendChild(answerButton);

      // Append the container to the body
      document.body.appendChild(buttonContainer);
    }

    // Update button container position
    buttonContainer.style.top = `${rect.bottom + window.scrollY}px`;
    buttonContainer.style.left = `${rect.left + window.scrollX}px`;
    buttonContainer.style.display = "flex";
  }
};

document.addEventListener("mouseup", handleMouseUp);
