const API_URL = "https://script.google.com/macros/s/AKfycbzEPxYPISx8Z62wzuj472JfMKAG5QAagz9GcqxjXdwT35My9hZfA8f3F3UWIA_KjSfK/exec
";

async function apiPost(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams(data)
  });
  return response.json();
}

function saveSession(session) {
  localStorage.setItem("bae_session", JSON.stringify(session));
}

function getSession() {
  return JSON.parse(localStorage.getItem("bae_session") || "null");
}

function clearSession() {
  localStorage.removeItem("bae_session");
}

async function requireAuth() {
  const session = getSession();

  if (!session || !session.token) {
    window.location.href = "index.html";
    return null;
  }

  const res = await apiPost({
    action: "validate",
    token: session.token
  });

  if (!res.ok) {
    clearSession();
    window.location.href = "index.html";
    return null;
  }

  return session;
}

async function logout() {
  const session = getSession();
  if (session && session.token) {
    await apiPost({
      action: "logout",
      token: session.token
    });
  }
  clearSession();
  window.location.href = "index.html";
}
