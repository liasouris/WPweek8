document.addEventListener('DOMContentLoaded', async () => {
  const topicsDiv = document.getElementById('topics');
  const topicForm = document.getElementById('topicForm');
  const postTopicBtn = document.getElementById('postTopic');

  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    topicForm.style.display = 'block'; 
  } else {
    topicForm.style.display = 'none';
  }

  async function loadTopics() {
    try {
      const response = await fetch('/topics');
      if (!response.ok) throw new Error('Failed to fetch topics');

      const topics = await response.json();

      topicsDiv.innerHTML = '';

      topics.forEach((topic) => {
        const topicCard = document.createElement('div');
        topicCard.classList.add('card', 'z-depth-2', 'hoverable', 'grey', 'lighten-2');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const cardTitle = document.createElement('span');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = topic.title;

        const contentP = document.createElement('p');
        contentP.textContent = topic.content;

        const infoP = document.createElement('p');
        infoP.classList.add('grey-text', 'text-darken-2');
        infoP.textContent = `Posted by ${topic.username} on ${new Date(topic.createdAt).toLocaleString()}`;

        const cardAction = document.createElement('div');
        cardAction.classList.add('card-action');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'waves-effect', 'waves-light');
        deleteBtn.addEventListener('click', async () => {
          try {
            const response = await fetch(`/topics/${topic.id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${authToken}` }, 
            });

            if (response.ok) {
              topicCard.remove();
            } else {
              alert('Failed to delete topic.');
            }
          } catch (error) {
            console.error('Error deleting topic:', error);
            alert('An error occurred while deleting the topic.');
          }
        });

        cardContent.appendChild(cardTitle);
        cardContent.appendChild(contentP);
        cardContent.appendChild(infoP);
        cardAction.appendChild(deleteBtn);

        topicCard.appendChild(cardContent);
        topicCard.appendChild(cardAction);
        topicsDiv.appendChild(topicCard);
      });
    } catch (error) {
      console.error('Error loading topics:', error);
      topicsDiv.innerHTML = '<p>Failed to load topics. Please try again later.</p>';
    }
  }

  await loadTopics();

  postTopicBtn.addEventListener('click', async () => {
    const title = document.getElementById('topicTitle').value;
    const content = document.getElementById('topicText').value;

    try {
      const response = await fetch('/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, 
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        await loadTopics(); 
        document.getElementById('topicTitle').value = '';
        document.getElementById('topicText').value = '';
      } else {
        alert('Failed to post topic.');
      }
    } catch (error) {
      console.error('Error posting topic:', error);
      alert('An error occurred while posting the topic.');
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); 
        topicForm.style.display = 'block'; 
        location.reload(); 
      } else {
        alert('Login failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in.');
    }
  });
});
