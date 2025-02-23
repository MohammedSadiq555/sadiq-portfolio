// Change text functionality
document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector(".constant_1");
    let currentIndex = 0;
    const texts = ["SOFTWARE DEVELOPER", "UI DESIGNER", "WEB DEVELOPER"];
    if (text) { // Check if the element exists
        text.textContent = texts[currentIndex];
        setInterval(() => {
            currentIndex = (currentIndex + 1) % texts.length;
            text.textContent = texts[currentIndex];
        }, 4000);
    }
});


// Original secret key check (if still needed elsewhere)
// This function was redirecting to another page; if you want to remove it in favor of the inline admin panel, you can comment it out.
// function checkSecret() {
//     const secretInput = document.getElementById('secretKey').value;
//     if(secretInput === 'mysecret') {
//       window.location.href = 'secret.html';
//     } else {
//       alert('Incorrect secret key!');
//     }
// }

// Scroll projects functionality
function scrollProjects(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = 270; 
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Initialize Supabase
const SUPABASE_URL = 'https://nywdhxarhxmyfwjrjbrf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d2RoeGFyaHhteWZ3anJqYnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzcxNzEsImV4cCI6MjA1NTgxMzE3MX0.7UT3t6KOxeP5wdHzbKTj6sIU3LXU5Cz4106gN5gAXz0';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Admin Panel: Reveal admin panel on entering correct admin key
const adminKey = "your_secret_key"; // Set your admin key here

function checkAdminKey(event) {
    if (event.key === "Enter") { // Check if Enter key is pressed
        const inputKey = document.getElementById("adminKeyInput").value;
        if (inputKey === adminKey) {
            document.getElementById("adminPanel").style.display = "block";
            document.getElementById("adminKeyInput").style.display = "none"; // Hide key input field
        } else {
            alert("Incorrect key. Try again.");
        }
    }
}

// Function to close admin panel and show key input again
function closeAdminPanel() {
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("adminKeyInput").style.display = "block";
}

// Image upload form submission using Supabase Storage
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
  
  // Replace 'your-bucket-name' with your actual bucket name in Supabase
  const { data: storageData, error: storageError } = await supabaseClient
    .storage
    .from('your-bucket-name')
    .upload(filePath, file);
  
  if (storageError) {
    console.error('Upload error:', storageError.message);
    alert('Failed to upload image.');
    return;
  }
  
  // Retrieve the public URL for the uploaded image
  const { publicURL, error: publicUrlError } = supabaseClient
    .storage
    .from('your-bucket-name')
    .getPublicUrl(filePath);
  
  if (publicUrlError) {
    console.error('Public URL error:', publicUrlError.message);
    alert('Failed to get image URL.');
    return;
  }
  
  // Create a new card element to display the uploaded image
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
  
  // Reset the form and switch back to the main portfolio view
  document.getElementById('uploadForm').reset();
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('portfolio').style.display = 'block';
});
