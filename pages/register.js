console.log("register.js loaded");

const form = document.getElementById("registerForm");
const formMsg = document.getElementById("formMsg");

// ---------- Helper: check username availability ----------
async function isUsernameAvailable(username) {
  const { data, error } = await window.supabaseClient
    .from("profiles")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (error) {
    console.error(error);
    throw new Error("Unable to verify username");
  }

  return data.length === 0;
}

// ---------- Register handler ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formMsg.style.color = "#333";
  formMsg.textContent = "Checking username...";

  const name = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !username || !password) {
    formMsg.style.color = "crimson";
    formMsg.textContent = "All fields are required.";
    return;
  }

  // 1️⃣ Username uniqueness check
  let available;
  try {
    available = await isUsernameAvailable(username);
  } catch (err) {
    formMsg.style.color = "crimson";
    formMsg.textContent = err.message;
    return;
  }

  if (!available) {
    formMsg.style.color = "crimson";
    formMsg.textContent = "Username already taken. Please choose another.";
    return;
  }

  // 2️⃣ Create Auth user
  formMsg.textContent = "Creating account...";

  const { data, error } = await window.supabaseClient.auth.signUp({
    email: `${username}@local.app`,
    password
  });

  if (error) {
    formMsg.style.color = "crimson";
    formMsg.textContent = error.message;
    return;
  }

  // 3️⃣ Insert profile
  const { error: profileError } = await window.supabaseClient
    .from("profiles")
    .insert({
      id: data.user.id,
      name,
      username
    });

  if (profileError) {
    // Handles race condition if username was taken in parallel
    if (profileError.code === "23505") {
      formMsg.style.color = "crimson";
      formMsg.textContent = "Username already taken.";
    } else {
      formMsg.style.color = "crimson";
      formMsg.textContent = profileError.message;
    }
    return;
  }

  // ✅ SUCCESS
  formMsg.style.color = "green";
  formMsg.textContent = "Account created successfully.";
  form.reset();
});