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
  // Set your secret admin key here:
  const adminKey = "mysecret";  // Change this to your desired secret key

  // Listen for keypress events on the admin key input element.
  const adminKeyInput = document.getElementById("adminKeyInput");
  if (adminKeyInput) {
    adminKeyInput.addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        const inputKey = adminKeyInput.value;
        if (inputKey === adminKey) {
          // Show the admin panel and hide the key input field.
          document.getElementById("adminPanel").style.display = "block";
          adminKeyInput.style.display = "none";
        } else {
          alert("Incorrect key. Try again.");
        }
      }
    });
  }

  // Function to close the admin panel and show the key input again.
  window.closeAdminPanel = function() {
    document.getElementById("adminPanel").style.display = "none";
    adminKeyInput.style.display = "block";
  };

  // --- (Optional) Other functionalities, e.g., Supabase upload, go here ---
});
