(() => {
  const root = document.querySelector("[data-anime-id]");
  if (!root) return;

  const id = Number(root.dataset.animeId);
  const favoriteBtn = document.getElementById("favoriteBtn");
  const alertBtn = document.getElementById("alertBtn");

  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem("animeHojeFavorites") || "[]");
  } catch (_) {}

  const favorites = new Set(Array.isArray(saved) ? saved : []);
  if (favorites.has(id) && favoriteBtn) {
    favoriteBtn.textContent = "★ Added to my anime";
  }

  favoriteBtn?.addEventListener("click", () => {
    favorites.add(id);
    localStorage.setItem("animeHojeFavorites", JSON.stringify([...favorites]));
    favoriteBtn.textContent = "★ Added to my anime";
  });

  alertBtn?.addEventListener("click", () => {
    alertBtn.textContent = "🔔 Notifications coming soon";
  });
})();