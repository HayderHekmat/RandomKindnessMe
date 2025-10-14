async function loadCompliments() {
    try {
      const res = await fetch("./compliments.json");
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("Failed to load compliments:", e);
      alert("❌ Could not load compliments.json");
      return { en: ["Error: Unable to load compliments."] };
    }
  }
  
  function detectLang() {
    const lang = navigator.language.slice(0, 2);
    return [
      "en", "ar", "de", "fr", "es", "it", "tr", "ja", "hi"
    ].includes(lang)
      ? lang
      : "en";
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const data = await loadCompliments();
  
    const btn = document.getElementById("kindnessBtn");
    const div = document.getElementById("compliment");
    const langSelect = document.getElementById("langSelect");
    const body = document.body;
  
    const colors = [
      "#FFEFA1", "#E7F5FF", "#FFF5E1", "#FDE2E4",
      "#E0F7FA", "#F3E8FF", "#E3F2FD", "#E8F5E9", "#FFF3E0"
    ];
    const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
  
    const uiTexts = {
      en: "💛 Send Kindness",
      de: "💛 Freundlichkeit senden",
      ar: "💛 أرسل اللطف",
      fr: "💛 Envoyer de la gentillesse",
      es: "💛 Enviar amabilidad",
      it: "💛 Invia gentilezza",
      tr: "💛 Nezaket gönder",
      ja: "💛 優しさを送る",
      hi: "💛 दया भेजें"
    };
  
    // 🧠 Check if a language was saved before
    const savedLang = localStorage.getItem("preferredLang");
  
    // 🧠 Set current language based on saved one or auto-detect
    let currentLang = savedLang || detectLang();
  
    // 🧠 Update dropdown to match saved language
    if (langSelect) {
      langSelect.value = savedLang || "auto";
    }
  
    // 🧠 Update button text accordingly
    btn.textContent = uiTexts[currentLang] || uiTexts["en"];
  
    // 🖱️ When user changes the language manually
    langSelect.addEventListener("change", () => {
      const selected = langSelect.value;
  
      // 🧠 Save new language preference (unless auto)
      if (selected !== "auto") {
        localStorage.setItem("preferredLang", selected);
      } else {
        localStorage.removeItem("preferredLang");
      }
  
      // Apply language
      currentLang = selected === "auto" ? detectLang() : selected;
  
      // Update button label
      btn.textContent = uiTexts[currentLang] || uiTexts["en"];
      console.log("Language switched to:", currentLang);
    });
  
    // 💛 Button click behavior
    btn.addEventListener("click", () => {
      const arr = data[currentLang] || data["en"];
      const i = Math.floor(Math.random() * arr.length);
      const text = arr[i];
  
      // Animate background
      body.style.transition = "background 1s ease";
      body.style.background = randomColor();
  
      // Hide button temporarily
      btn.disabled = true;
      btn.style.transition = "opacity 0.6s ease";
      btn.style.opacity = "0";
      setTimeout(() => (btn.style.display = "none"), 600);
  
      // Show compliment text
      div.textContent = text;
      div.dir = currentLang === "ar" ? "rtl" : "ltr";
      div.style.fontFamily =
        currentLang === "ar" ? "Cairo, sans-serif" : "Inter, sans-serif";
  
      div.style.opacity = 0;
      void div.offsetWidth;
      div.classList.add("show");
  
      // Hide compliment after delay
      setTimeout(() => div.classList.remove("show"), 7000);
  
      // Bring button back
      setTimeout(() => {
        btn.style.display = "block";
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.textContent = uiTexts[currentLang] || uiTexts["en"];
      }, 8500);
    });
  });
  