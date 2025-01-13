document.addEventListener('DOMContentLoaded', () => {
    const topicForm = document.getElementById('topicForm');
    const topicsDiv = document.getElementById('topics');
  

    async function loadTopics() {
      try {
        const response = await fetch('/api/topics');
        const topics = await response.json();
  
        topicsDiv.innerHTML = '';
        topics.forEach((topic) => {
          const topicElement = document.createElement('div');
          topicElement.classList.add('card', 'z-depth-2', 'hoverable', 'grey', 'lighten-2');
          topicElement.innerHTML = `
            <div class="card-content">
              <span class="card-title">${topic.title}</span>
              <p>${topic.content}</p>
              <p class="grey-text text-darken-2">By: ${topic.username} | ${new Date(topic.createdAt).toLocaleString()}</p>
            </div>
            <div class="card-action">
              <button class="btn waves-effect waves-light red deleteTopic" data-id="${topic.id}">Delete</button>
            </div>
          `;
          topicsDiv.appendChild(topicElement);
  
          topicElement.querySelector('.deleteTopic').addEventListener('click', async (event) => {
            const topicId = event.target.getAttribute('data-id');
            try {
              const deleteResponse = await fetch(`/api/topics/${topicId}`, { method: 'DELETE' });
              if (deleteResponse.ok) {
                alert('Topic deleted successfully.');
                loadTopics(); 
              } else {
                const message = await deleteResponse.text();
                alert(`Failed to delete topic: ${message}`);
              }
            } catch (error) {
              console.error('Error deleting topic:', error);
            }
          });
        });
      } catch (error) {
        console.error('Error loading topics:', error);
      }
    }
  
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          alert('Login successful.');
          topicForm.style.display = 'block'; 
          loadTopics();
        } else {
          alert('Login failed.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    document.getElementById('postTopicForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const title = document.getElementById('topicTitle').value;
      const content = document.getElementById('topicText').value;
  
      try {
        const response = await fetch('/api/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        });
  
        if (response.ok) {
          alert('Topic posted successfully.');
          loadTopics(); 
        } else {
          alert('Failed to post topic.');
        }
      } catch (error) {
        console.error('Error posting topic:', error);
      }
    });
  
    loadTopics(); 
  });
  