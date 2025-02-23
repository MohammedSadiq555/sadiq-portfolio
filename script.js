const SUPABASE_URL = 'https://nywdhxarhxmyfwjrjbrf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2RoeGFyaHhteWZ3anJqYnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzcxNzEsImV4cCI6MjA1NTgxMzE3MX0.7UT3t6KOxeP5wdHzbKTj6sIU3LXU5Cz4106gN5gAXz0';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
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
  const fileName = `${Date.now()}.${fileExt}`; // Create a unique file name
  const filePath = `${uploadType}/${fileName}`; // Organize by type
  
  // Upload the file to Supabase Storage
  const { data: storageData, error: storageError } = await supabase
    .storage
    .from('your-bucket-name') // Replace with your bucket name
    .upload(filePath, file);
  
  if (storageError) {
    console.error('Upload error:', storageError.message);
    alert('Failed to upload image.');
    return;
  }
  
  // Retrieve the public URL for the uploaded image
  const { publicURL, error: publicUrlError } = supabase
    .storage
    .from('your-bucket-name')
    .getPublicUrl(filePath);
  
  if (publicUrlError) {
    console.error('Public URL error:', publicUrlError.message);
    alert('Failed to get image URL.');
    return;
  }
  
  // Update the page with the new image (optional: you can also save metadata to a database)
  const card = document.createElement('div');
  card.classList.add('project'); // Adjust the class if needed
  
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
  
  // Optionally reset the form and switch back to your main portfolio view
  document.getElementById('uploadForm').reset();
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('portfolio').style.display = 'block';
});
