const audioUpload = document.getElementById("audioUpload");
const audioPreview = document.getElementById("audioPreview");
const audioPlayer = document.getElementById("audioPlayer");
const generateQRButton = document.getElementById("generateQR");
const qrCode = document.getElementById("qrCode");
const qrCanvas = document.getElementById("qrCanvas");

let audioURL = ""; // URL of uploaded audio file

audioUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    generateQRButton.disabled = true; // Disable the button during upload
    generateQRButton.textContent = "Uploading..."; // Show uploading status

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to File.io
      const response = await fetch("https://file.io", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        // Get the public URL of the uploaded file
        audioURL = result.link;

        // Preview the audio
        audioPlayer.src = audioURL;
        audioPreview.classList.remove("hidden");

        // Enable the button
        generateQRButton.disabled = false;
        generateQRButton.textContent = "Generate QR Code";
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading file. Please try again.");
      generateQRButton.textContent = "Generate QR Code"; // Reset button text
    }
  }
});

generateQRButton.addEventListener("click", () => {
  if (!audioURL) return;

  // Create the landing page URL with the audio file URL as a query parameter
  const landingPageURL = `${window.location.origin}/landing.html?audio=${encodeURIComponent(audioURL)}`;

  // Generate the QR code
  new QRious({
    element: qrCanvas,
    value: landingPageURL,
    size: 256,
  });

  qrCode.classList.remove("hidden");
});
