document.addEventListener("DOMContentLoaded", () => {
  // 1. SCROLL TO TOP TLAČIDLO

  const btn = document.getElementById("scrollTopBtn");
  if (btn) {
    //Zobrazenie/skrytie tlačítka
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 300);
    });

    // Kliknutie a plynulé scrollovaine hore
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 2. REGISTRÁCIA – KONTROLA HESLA

  const pwd1 = document.getElementById("password");
  const pwd2 = document.getElementById("secondPassword");

  if (pwd1 && pwd2) {
    function validatePasswords() {
      const pass1 = pwd1.value;
      const pass2 = pwd2.value;

      // Zmaže staré triedy
      pwd1.classList.remove("password-wrong", "password-correct");
      pwd2.classList.remove("password-wrong", "password-correct");

      if (pass1 || pass2) {
        if (pass1 === pass2 && pass1.length > 0) {
          // Hesla sa zhodujú
          pwd1.classList.add("password-correct");
          pwd2.classList.add("password-correct");
        } else {
          // Hesla sa nezhodujú
          pwd1.classList.add("password-wrong");
          pwd2.classList.add("password-wrong");
        }
      }
    }

    pwd1.addEventListener("input", validatePasswords);
    pwd2.addEventListener("input", validatePasswords);
    pwd2.addEventListener("focus", validatePasswords);
  }
});

// 3. TRETIA STRÁNKA – API VÝBER FILMOV/SERIÁLOV

const API_URL = "https://api.tvmaze.com/search/shows?q=";
const select = document.getElementById("chooseFilm");
const results = document.getElementById("results");

// Načítanie dat z API podľa výberu
async function loadFilms() {
  const query = select.value;
  results.innerHTML = "";

  if (!query) return;

  try {
    const res = await fetch(API_URL + encodeURIComponent(query));
    const data = await res.json();

    // Vyberieme len tie, čo majú obrázok a názov obsahuje hľadaný výraz
    const filtered = data.filter(
      (item) =>
        item.show.image &&
        item.show.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!filtered.length) {
      results.innerHTML = "<p>Žádné výsledky</p>";
      return;
    }

    // Prejdeme všetky nájdené filmy
    filtered.forEach((item) => {
      const show = item.show;
      const img =
        show.image?.medium ||
        "https://via.placeholder.com/210x295/333/fff?text=No+Image";
      const name = show.name;

      // Vytvorenie karty s obrázkom
      const card = document.createElement("div");
      card.className = "show container";
      card.innerHTML = `
          <img src="${img}" alt="${name}">`;

      // Pridanie do výsledkov
      results.appendChild(card);
    });
  } catch (err) {
    console.log("Chyba:", err);
    results.innerHTML = "<p>Nepodařilo se načíst data</p>";
  }
}

select.addEventListener("change", loadFilms);
