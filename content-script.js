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
      const customInput = document.createElement("input");
      customInput.id = "cusinp";
      customInput.style.color = "#000";
      customInput.style.padding = "5px";
      customInput.style.border = "1px solid #ccc";
      customInput.style.borderRadius = "5px";
      customInput.style.outline = "none";
      customInput.placeholder = "Type something...";
      customInput.style.display = "none";

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

      const customButton = document.createElement("button");
      customButton.textContent = "custom button";
      customButton.id = "cus";
      customButton.style.backgroundColor = "#000";
      customButton.style.color = "white";
      customButton.style.border = "none";
      customButton.style.borderRadius = "5px";
      customButton.style.padding = "5px 10px";
      customButton.style.cursor = "pointer";

      let selectedRange = null;
      const sendButton = createButton("Send", "#007bff", () => {
        let customInput = document.getElementById("cusinp");

        console.log("Send button clicked");
        console.log("Input Value:", customInput.value);

        // Optional: Process or save the input value
      });

      sendButton.style.display = "none";
      // Function to save and restore selection
      const saveSelection = () => {
        const selection = window.getSelection();
        if (selection?.rangeCount > 0) {
          selectedRange = selection.getRangeAt(0).cloneRange();
        }
      };

      const restoreSelection = () => {
        if (selectedRange) {
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(selectedRange);
        }
      };

      // Handle mouseup to save selection
      document.addEventListener("mouseup", () => {
        saveSelection();
      });

      // Custom button logic
      customButton.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("Custom button clicked");

        // Restore selection when the custom button is clicked
        restoreSelection();

        // Create input field

        // Replace the custom button with the input field
        customButton.style.display = "none";
        customInput.style.display = "block";
        sendButton.style.display = "block";
        customInput.focus();

        // Restore selection when input gains focus
        customInput.addEventListener("focus", restoreSelection);
        // Create "Send" button

        // Append the "Send" button after the input field
      });

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
          // sendMessage(selectedText + " answer the question" || "");
        });
      });

      // Append buttons to the container
      buttonContainer.appendChild(copyButton);
      buttonContainer.appendChild(summaryButton);
      buttonContainer.appendChild(answerButton);
      // buttonContainer.appendChild(customInput);

      // buttonContainer.appendChild(sendButton);

      // buttonContainer.appendChild(customButton);

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
