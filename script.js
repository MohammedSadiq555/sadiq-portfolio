document.addEventListener('DOMContentLoaded', () => {
  // --- Rotating Text Functionality for Dynamic Occupations ---
  const dynamicText = document.querySelector(".constant_1");
  let currentIndex = 0;
  const texts = ["SOFTWARE ENGINEER", "UI DESIGNER", "WEB DEVELOPER"];
  if (dynamicText) {
    dynamicText.textContent = texts[currentIndex];
    setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      dynamicText.textContent = texts[currentIndex];
    }, 4000);
  }

  // --- Secret Key / Admin Panel Functionality ---
  const adminKey = "mysecret";  // Change this to your secret key
  const adminKeyInput = document.getElementById("adminKeyInput");
  if (adminKeyInput) {
    adminKeyInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        if (adminKeyInput.value === adminKey) {
          const overlay = document.getElementById("overlay");
          if (overlay) overlay.style.display = "block";
          document.getElementById("adminPanel").style.display = "block";
          adminKeyInput.style.display = "none";
        } else {
          alert("Incorrect key. Try again.");
        }
      }
    });
  }
  window.closeAdminPanel = function() {
    document.getElementById("adminPanel").style.display = "none";
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
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

  // --- Initialize Supabase Client ---
  const SUPABASE_URL = 'https://nywdhxarhxmyfwjrjbrf.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2RoeGFyaHhteWZ3anJqYnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzcxNzEsImV4cCI6MjA1NTgxMzE3MX0.7UT3t6KOxeP5wdHzbKTj6sIU3LXU5Cz4106gN5gAXz0';
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // --- Upload Form Handler ---
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Retrieve form values (make sure these IDs exist in your HTML)
      const category = document.getElementById('uploadCategory').value;
      const imageInput = document.getElementById('imageInput');
      const imageName = document.getElementById('imageName').value;
      const imageDescription = document.getElementById('imageDescription').value;
      const imageDate = document.getElementById('imageDate').value;

      if (!imageInput.files || !imageInput.files[0]) {
        alert('Please select an image file.');
        return;
      }

      const file = imageInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = ${Date.now()}.${fileExt};
      const filePath = ${category}/${fileName};

      // Use the same bucket name for both upload and public URL retrieval.
      const bucketName = 'image-uploads'; // Make sure this is your actual bucket name

      // Upload image to Supabase Storage.
      const { data: storageData, error: storageError } = await supabaseClient
        .storage
        .from(bucketName)
        .upload(filePath, file);
      if (storageError) {
        console.error('Upload error:', storageError);
        alert('Failed to upload image: ' + storageError.message);
        return;
      }

const { data: publicUrlData, error: publicUrlError } = supabaseClient
  .storage
  .from(bucketName)
  .getPublicUrl(filePath);

if (publicUrlError) {
  console.error('Public URL error:', publicUrlError);
  alert('Failed to get image URL: ' + publicUrlError.message);
  return;
}

const publicURL = publicUrlData.publicUrl;  // extract the URL

console.log("Public URL:", publicURL);


      // Insert image metadata into the database table.
      const { data: dbData, error: dbError } = await supabaseClient
        .from('uploads')
        .insert([{
          category: category,
          name: imageName,
          description: imageDescription,
          date: imageDate,
          imageurl: publicURL
        }]);
      if (dbError) {
        console.error('Database insert error:', dbError);
        alert('Failed to save image metadata: ' + dbError.message);
        return;
      }

      // Create a new card element to display the new upload.
      const card = document.createElement('div');
      card.classList.add('project');

      // Create the image element.
      const img = document.createElement('img');
      img.src = publicURL;
      img.alt = imageName;
      img.style.width = '100%';

      // Create an info container for name, description, and date.
      const infoContainer = document.createElement('div');
      infoContainer.classList.add('project-info');

      const titleEl = document.createElement('h3');
      titleEl.textContent = imageName;

      const descEl = document.createElement('p');
      descEl.textContent = imageDescription;

      const dateEl = document.createElement('p');
      dateEl.textContent = imageDate;

      // Append the text elements in order (date at bottom)
      infoContainer.appendChild(titleEl);
      infoContainer.appendChild(descEl);
      infoContainer.appendChild(dateEl);

      // Append the image and info container to the card.
      card.appendChild(img);
      card.appendChild(infoContainer);

      // Append the card to the corresponding container based on category.
      let containerId = '';
      if (category === 'project') {
        containerId = 'projectsContainer';
      } else if (category === 'certificate') {
        containerId = 'coursesContainer';
      } else if (category === 'uidesign') {
        containerId = 'uidesignsContainer';
      }
      const container = document.getElementById(containerId);
      if (container) {
        container.appendChild(card);
      } else {
        console.error('No container found for category: ' + category);
      }

      // Reset the form and hide the admin panel (restore key input)
      uploadForm.reset();
      document.getElementById('adminPanel').style.display = 'none';
      adminKeyInput.style.display = 'block';
      const overlay = document.getElementById("overlay");
      if (overlay) overlay.style.display = "none";
    });
  }
});
