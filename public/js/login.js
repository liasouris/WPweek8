const initializeLogin = () => {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
      handleLogin(event);
  });
};

const initializePostTopic = () => {
  document.getElementById("postTopic").addEventListener("click", (event) => {
      handlePostTopic(event);
  });
};

const initializeApp = () => {
  initializeLogin();
  initializePostTopic();
  loadTopics();
};

const handleLogin = async (event) => {
  event.preventDefault();

  const formData = {
      email: event.target.email.value,
      password: event.target.password.value,
  };

  try {
      const response = await fetch("/api/user/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });

      if (!response.ok) {
          document.getElementById("error").innerText = "Error when trying to login. Please try again.";
      } else {
          const data = await response.json();

          if (data.token) {
              localStorage.setItem("authToken", data.token);
              window.location.href = "index.html";
          }
      }
  } catch (error) {
      console.log(`Error while trying to log in: ${error.message}`);
  }
};

const handlePostTopic = async (event) => {
  const title = document.getElementById("topicTitle").value.trim();
  const content = document.getElementById("topicText").value.trim();

  if (!title || !content) {
      document.getElementById("error").innerText = "Title and content are required.";
      return;
  }

  try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("/api/topics", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
          document.getElementById("error").innerText = "Error when trying to post topic. Please try again.";
      } else {
          await loadTopics(); 
          document.getElementById("topicTitle").value = "";
          document.getElementById("topicText").value = "";
      }
  } catch (error) {
      console.log(`Error while trying to post topic: ${error.message}`);
  }
};

const loadTopics = async () => {
  const topicsDiv = document.getElementById("topics");
  topicsDiv.innerHTML = "Loading topics...";

  try {
      const response = await fetch("/api/topics");
      if (!response.ok) throw new Error("Failed to fetch topics");

      const topics = await response.json();

      renderTopics(topics);
  } catch (error) {
      console.log(`Error loading topics: ${error.message}`);
      topicsDiv.innerHTML = "Failed to load topics. Please try again later.";
  }
};

const renderTopics = (topics) => {
  const topicsDiv = document.getElementById("topics");
  topicsDiv.innerHTML = "";

  if (topics.length === 0) {
      topicsDiv.innerHTML = "<p>No topics available. Be the first to post!</p>";
      return;
  }

  topics.forEach((topic) => {
      const topicCard = document.createElement("div");
      topicCard.classList.add("card", "z-depth-2", "hoverable", "grey", "lighten-2");

      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      const cardTitle = document.createElement("span");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = topic.title;

      const contentP = document.createElement("p");
      contentP.textContent = topic.content;

      const infoP = document.createElement("p");
      infoP.classList.add("grey-text", "text-darken-2");
      infoP.textContent = `Posted by ${topic.username} on ${new Date(topic.createdAt).toLocaleString()}`;

      const cardAction = document.createElement("div");
      cardAction.classList.add("card-action");

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("btn", "waves-effect", "waves-light");
      deleteBtn.addEventListener("click", () => handleDeleteTopic(topic.id, topicCard));

      cardContent.appendChild(cardTitle);
      cardContent.appendChild(contentP);
      cardContent.appendChild(infoP);
      cardAction.appendChild(deleteBtn);

      topicCard.appendChild(cardContent);
      topicCard.appendChild(cardAction);

      topicsDiv.appendChild(topicCard);
  });
};

const handleDeleteTopic = async (topicId, topicCard) => {
  try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`/api/topics/${topicId}`, {
          method: "DELETE",
          headers: {
              Authorization: `Bearer ${authToken}`,
          },
      });

      if (response.ok) {
          topicCard.remove();
      } else {
          alert("Failed to delete topic.");
      }
  } catch (error) {
      console.log(`Error deleting topic: ${error.message}`);
  }
};

initializeApp();
