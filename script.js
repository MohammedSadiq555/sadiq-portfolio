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
  const adminKey = "mysecret";  // Set your secret key here
  const secretKeyInput = document.getElementById("secretKey");
  window.checkSecret = function() {
    const inputKey = secretKeyInput.value;
    if (inputKey === adminKey) {
      document.getElementById("adminPanel").style.display = "block";
      secretKeyInput.style.display = "none";
    } else {
      alert("Incorrect key. Try again.");
    }
  };

  // --- Scroll Projects Functionality ---
  window.scrollProjects = function(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = 270;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  // --- Initialize Supabase Client ---
  const SUPABASE_URL = 'https://nywdhxarhxmyfwjrjbrf.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2RoeGFyaHhteWZ3anJqYnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzcxNzEsImV4cCI6MjA1NTgxMzE3MX0.7UT3t6KOxeP5wdHzbKTj6sIU3LXU5Cz4106gN5gAXz0';
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // --- Image Upload Form Submission Using Supabase Storage ---
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const uploadType = document.getElementById('uploadType').value;
      const imageInput = document.getElementById('imageInput');
      const imageName = document.getElementById('imageName').value;
      // imageTitle is collected from the form but not inserted into the table,
      // because your table doesn't currently have a matching column.
      const imageTitle = document.getElementById('imageTitle').value;

      if (!imageInput.files || !imageInput.files[0]) {
        alert('Please select an image file.');
        return;
      }

      const file = imageInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // Create a unique file name
      const filePath = `${uploadType}/${fileName}`; // Organize by type

      // Replace 'your-bucket-name' with your actual bucket name in Supabase
      const { data: storageData, error: storageError } = await supabaseClient
        .storage
        .from('your-bucket-name')
        .upload(filePath, file);

      if (storageError) {
        console.error('Upload error details:', storageError);
        alert('Failed to upload image: ' + storageError.message);
        return;
      }

      // Retrieve the public URL for the uploaded image
      const { publicURL, error: publicUrlError } = supabaseClient
        .storage
        .from('your-bucket-name')
        .getPublicUrl(filePath);

      if (publicUrlError) {
        console.error('Public URL error:', publicUrlError);
        alert('Failed to get image URL: ' + publicUrlError.message);
        return;
      }

      // Insert image metadata into the Supabase table.
      // Replace 'uploads' with your table name if it's different.
      const { data: dbData, error: dbError } = await supabaseClient
        .from('uploads')
        .insert([{
          type: uploadType,      // Matches the "type" column (ensure this is spelled correctly in your table)
          name: imageName,       // Matches the "name" column
          imageurl: publicURL    // Matches the "imageurl" column
        }]);

      if (dbError) {
        console.error('Database insert error:', dbError);
        alert('Failed to save image metadata: ' + dbError.message);
        return;
      }

      // Create a new card element to display the uploaded image
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

      if (uploadType === 'project') {
        document.getElementById('projectsContainer').appendChild(card);
      } else if (uploadType === 'certificate') {
        document.getElementById('certificatesContainer').appendChild(card);
      }

      // Reset the form and switch back to the main portfolio view
      uploadForm.reset();
      document.getElementById('adminPanel').style.display = 'none';
      // Optionally, if you want to show the key input again:
      secretKeyInput.style.display = 'block';
    });
  }
});
