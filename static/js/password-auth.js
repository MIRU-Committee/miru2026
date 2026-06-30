async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkPageExists(url) {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store"
  });

  return response.ok;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("password-form");
  const message = document.getElementById("password-message");
  const input = document.getElementById("password");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = input.value;
    const hash = await sha256(password);

    const targetBase = form.dataset.targetBase || window.location.pathname;
    const normalizedTargetBase = targetBase.replace(/\/$/, "");
    const targetPath = `${normalizedTargetBase}/${hash}/`;

    try {
      const exists = await checkPageExists(targetPath);

      if (exists) {
        window.location.href = targetPath;
      } else {
        message.textContent = "Wrong password. Please try again.";
        input.value = "";
        input.focus();
      }
    } catch (error) {
      message.textContent = "An error occurred. Please try again later.";
    }
  });
});