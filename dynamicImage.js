const tesseractOCR = new TesseractOCRWrapper();
const tableFormatConverter = new TableFormatConverter();
const imageBgColEditor = new ImageBgColEdtior();

const DMform = document.getElementById("dateForm");
const imageInputs = document.getElementById("imageInputs");
const addImageBtn = document.getElementById("addImageBtn");
const previewContainer = document.getElementById("previewContainer");

// ✅ Add new image input dynamically
addImageBtn.addEventListener("click", () => {
  const wrapper = document.createElement("div");
  wrapper.className = "image-input flex items-center gap-3";

  const input = document.createElement("input");
  input.type = "file";
  input.name = "images[]";
  input.accept = "image/*";
  input.className =
    "file-input block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.className =
    "remove-btn text-red-500 hover:text-red-700 font-semibold";

  removeBtn.addEventListener("click", () => wrapper.remove());
  input.addEventListener("change", handlePreview);

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  imageInputs.appendChild(wrapper);
});

// ✅ Show previews
function handlePreview(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.className =
      "w-full h-24 object-cover rounded-lg border border-gray-300";
    previewContainer.appendChild(img);
  };
  reader.readAsDataURL(file);
}

// ✅ Attach preview handler to the first input
document
  .querySelector("input[type='file']")
  .addEventListener("change", handlePreview);

// ✅ Handle form submission
DMform.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    showLoading();
    DMform.disabled = true;

    const formData = new FormData(DMform);
    const files = formData.getAll("images[]");

    if (files.length === 0 || !files[0].name) {
      alert("Please select at least one image!");
      return;
    }

    const processedFiles = [];
    for (const file of files) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        processedFiles.push(imageBgColEditor.changeAllRed(img, tolerance = 55));

        // Clean up memory
        URL.revokeObjectURL(img.src);
      };
    }

    let arr = await tesseractOCR.recognizeImage(processedFiles);
    let result = tableFormatConverter.format(arr);

    document.getElementById("output").value =
      result.join("\n") || "(no matching days)";
  } catch (er) {
    console.error(er);
  } finally {
    DMform.disabled = false;
    hideLoading();
  }
});
