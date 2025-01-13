document.addEventListener('DOMContentLoaded', async () => {
  const topicsDiv = document.getElementById('topics');
  const topicForm = document.getElementById('topicForm');
  const postTopicBtn = document.getElementById('postTopic');

  async function loadTopics() {
    const response = await fetch('/topics');
    const topics = await response.json();

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
        const response = await fetch(`/topics/${topic.id}`, { method: 'DELETE' });
        if (response.ok) {
          topicCard.remove();
        } else {
          alert('Failed to delete topic.');
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
  }

  postTopicBtn.addEventListener('click', async () => {
    const title = document.getElementById('topicTitle').value;
    const content = document.getElementById('topicText').value;

    const response = await fetch('/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });

    if (response.ok) {
      location.reload();
    } else {
      alert('Failed to post topic.');
    }
  });

  const response = await fetch('/auth/me');
  if (response.ok) {
    topicForm.style.display = 'block';
  }

  loadTopics();
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    location.reload();
  } else {
    alert('Login failed!');
  }
});
