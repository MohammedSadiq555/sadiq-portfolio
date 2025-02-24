document.addEventListener('DOMContentLoaded', () => {
  // --- Rotating Text Functionality ---
  const text = document.querySelector(".constant_1");
  let currentIndex = 0;
  const texts = ["SOFTWARE ENGINEER", "UI DESIGNER", "WEB DEVELOPER"];
  if (text) {
    text.textContent = texts[currentIndex];
    setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      text.textContent = texts[currentIndex];
    }, 4000);
  }

  // --- Secret Key / Admin Panel Functionality ---
  const adminKey = "mysecret";  // Change this to your secret key
  const adminKeyInput = document.getElementById("adminKeyInput");
  // When the user presses Enter, check the key
  if (adminKeyInput) {
    adminKeyInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        if (adminKeyInput.value === adminKey) {
          document.getElementById("adminPanel").style.display = "block";
          adminKeyInput.style.display = "none";
        } else {
          alert("Incorrect key. Try again.");
        }
      }
    });
  }

  // Function to close admin panel and show the key input again
  window.closeAdminPanel = function() {
    document.getElementById("adminPanel").style.display = "none";
    adminKeyInput.style.display = "block";
  };

  // --- Scroll Projects Functionality ---
  window.scrollProjects = function(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error("Container not found: " + containerId);
      return;
    }
    const scrollAmount = 270;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  // --- Initialize Supabase and Upload Functionality ---
  // (Make sure to update these with your actual values)
  const SUPABASE_URL = 'https://nywdhxarhxmyfwjrjbrf.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2RoeGFyaHhteWZ3anJqYnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzcxNzEsImV4cCI6MjA1NTgxMzE3MX0.7UT3t6KOxeP5wdHzbKTj6sIU3LXU5Cz4106gN5gAXz0';
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const uploadType = document.getElementById('uploadType').value;
      const imageInput = document.getElementById('imageInput');
      const imageName = document.getElementById('imageName').value;
      const imageTitle = document.getElementById('imageTitle').value;

      if (!imageInput.files || !imageInput.files[0]) {
        alert('Please select an image file.');
        return;
      }

      const file = imageInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${uploadType}/${fileName}`;

      // Replace 'your-bucket-name' with your actual bucket name in Supabase
      const { data: storageData, error: storageError } = await supabaseClient
        .storage
        .from('your-bucket-name')
        .upload(filePath, file);

      if (storageError) {
        console.error('Upload error:', storageError);
        alert('Failed to upload image: ' + storageError.message);
        return;
      }

      const { publicURL, error: publicUrlError } = supabaseClient
        .storage
        .from('your-bucket-name')
        .getPublicUrl(filePath);

      if (publicUrlError) {
        console.error('Public URL error:', publicUrlError);
        alert('Failed to get image URL: ' + publicUrlError.message);
        return;
      }

      // Insert image metadata into the table (if needed)
      const { data: dbData, error: dbError } = await supabaseClient
        .from('uploads')
        .insert([{
          type: uploadType,      // Ensure your table column is "type"
          name: imageName,       // Column "name"
          imageurl: publicURL    // Column "imageurl"
        }]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        alert('Failed to save image metadata: ' + dbError.message);
        return;
      }

      // Display the new card
      const card = document.createElement('div');
      card.classList.add('project');

      const img = document.createElement('img');
      img.src = publicURL;
      img.alt = imageName;
      img.style.width = '100%';

      const titleEl = document.createElement('h3');
      titleEl.textContent = imageTitle;

      card.appendChild(img);
      card.appendChild(titleEl);

      // Append card based on upload type
      if (uploadType === 'project') {
        document.getElementById('projectsContainer').appendChild(card);
      } else if (uploadType === 'certificate') {
        document.getElementById('coursesContainer').appendChild(card);
      } else if (uploadType === 'uidesign') {
        document.getElementById('uidesignsContainer').appendChild(card);
      }

      // Reset form and hide admin panel
      uploadForm.reset();
      document.getElementById('adminPanel').style.display = 'none';
      adminKeyInput.style.display = 'block';
    });
  }
});
