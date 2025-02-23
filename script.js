document.addEventListener('DOMContentLoaded', () => {
  // --- Rotating Text Functionality ---
  const text = document.querySelector(".constant_1");
  let currentIndex = 0;
  const texts = ["SOFTWARE ENGINEER", "UI DEVELOPER", "WEB DEVELOPER"];
  if (text) {
    text.textContent = texts[currentIndex];
    setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      text.textContent = texts[currentIndex];
    }, 4000);
  }

  // --- Secret Key / Admin Panel Functionality ---
  // Set your secret key here:
  const adminKey = "mysecret";  // Adjust as needed
  const secretKeyInput = document.getElementById("secretKey");

  // Define the checkSecret function globally so that the onclick in your HTML can find it.
  window.checkSecret = function() {
    const inputKey = secretKeyInput.value;
    if (inputKey === adminKey) {
      // Show the admin panel
      document.getElementById("adminPanel").style.display = "block";
      // Optionally, hide the secret key input section
      secretKeyInput.style.display = "none";
    } else {
      alert("Incorrect key. Try again.");
    }
  };

  // --- Close Admin Panel Functionality ---
  window.closeAdminPanel = function() {
    document.getElementById("adminPanel").style.display = "none";
    secretKeyInput.style.display = "block";
  };

  // --- (Other functionalities such as Supabase, scrolling, etc. go here) ---
});
