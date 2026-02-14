
/* -----------------------
   Team carousel (isolated)
   ----------------------- */
(function TeamCarouselModule(){
  // scope everything to this module
  const cards = document.querySelectorAll('.card');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  if (!cards.length || !nextBtn || !prevBtn) return; // don't run if elements missing

  let currentTeam = 0;

  function showTeamCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }

  nextBtn.addEventListener('click', () => {
    currentTeam = (currentTeam + 1) % cards.length;
    showTeamCard(currentTeam);
  });

  prevBtn.addEventListener('click', () => {
    currentTeam = (currentTeam - 1 + cards.length) % cards.length;
    showTeamCard(currentTeam);
  });

  // initial show
  showTeamCard(currentTeam);
})();

/* ----------------------------------
   Testimonial carousel (isolated)
   ---------------------------------- */
(function TestimonialCarouselModule(){
  // selectors — update these if your HTML uses different class names
  const box = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.pagination-dot');

  if (!box.length) return; // nothing to do

  // if dots exist, ensure their count matches cards
  const hasDots = dots && dots.length === box.length;

  let testIndex = 0;
  let timer = null;

  function showTestimonialCard(idx) {
    box.forEach((card, i) => {
      card.classList.toggle('active', i === idx);
      if (hasDots) dots[i].classList.toggle('active', i === idx);
    });
  }

  function nextTestimonial() {
    testIndex = (testIndex + 1) % box.length;
    showTestimonialCard(testIndex);
  }

  function startTestimonialCarousel() {
    stopTestimonialCarousel(); // avoid duplicates
    timer = setInterval(nextTestimonial, 3500);
  }

  function stopTestimonialCarousel() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // If dots exist, enable clicking
  if (hasDots) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopTestimonialCarousel();
        testIndex = i;
        showTestimonialCard(testIndex);
        startTestimonialCarousel();
      });
    });
  }

  // optional: pause on mouseenter and resume on mouseleave (polish)
  const firstCard = box[0].closest('div') || box[0];
  if (firstCard) {
    firstCard.addEventListener && firstCard.addEventListener('mouseenter', stopTestimonialCarousel);
    firstCard.addEventListener && firstCard.addEventListener('mouseleave', startTestimonialCarousel);
  }

  // init
  showTestimonialCard(testIndex);
  startTestimonialCarousel();

})();







window.addEventListener('scroll', function() {
  const navbar = document.querySelector('nav');
  const heroHeight = document.querySelector('.hero').offsetHeight;

  if (window.scrollY > heroHeight - 50) { 
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});



// Blog data for popup content
  const blogData = {
    box1: {
      img: "blog2.jpg",
      title: "The Art of Fresh Pasta Making",
      text: "Discover the traditional techniques behind our handmade pasta, from kneading the dough to shaping the noodles. Every strand of pasta we make carries a story of patience, passion, and Italian heritage."
    },
    box2: {
      img: "blog3.jpg",
      title: "Wine Pairing Guide: Italian Edition",
      text: "Learn how to perfectly pair Italian wines with your favorite dishes. From Chianti with red sauces to Pinot Grigio with seafood, explore the harmony between flavors that elevate every meal."
    },
    box3: {
      img: "blog1.jpg",
      title: "Farm to Table: Our Ingredient Journey",
      text: "Meet the local farmers who supply our kitchen with fresh ingredients. We believe that every delicious dish starts with respect for the land and the people who nurture it."
    }
  };

  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popup-img");
  const popupTitle = document.getElementById("popup-title");
  const popupText = document.getElementById("popup-text");
  const closeBtn = document.querySelector(".close");

  // Event listener for each 'Read More' link
  document.querySelectorAll(".box a").forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault(); // prevent page reload

      const parentBox = this.parentElement.id;
      const data = blogData[parentBox];

      // Fill popup content
      popupImg.src = data.img;
      popupTitle.textContent = data.title;
      popupText.textContent = data.text;

      // Show popup
      popup.style.display = "flex";
    });
  });

  // Close popup when clicking X
  closeBtn.onclick = function() {
    popup.style.display = "none";
  }

  // Close popup when clicking outside the box
  window.onclick = function(event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  }




 
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navClose = document.getElementById('navClose');

  navToggle.addEventListener('click', () => {
    navDrawer.classList.add('open');
  });

  navClose.addEventListener('click', () => {
    navDrawer.classList.remove('open');
  });

  // Optional: close drawer when clicking any link
  document.querySelectorAll('.drawer-items a').forEach(link => {
    link.addEventListener('click', () => {
      navDrawer.classList.remove('open');
    });
  });


  
  /* ================= NAVBAR EDITOR — FINAL FIX ================= */

(function navbarEditorFinal(){

  const titleText = document.querySelector(".editable-title .editable-text");
  const titleIcon = document.querySelector(".title-edit");

  const menu = document.querySelector(".editable-menu");
  const menuIcon = document.querySelector(".menu-edit");

 
  /* ---------- ICON CLICKS ---------- */
  titleIcon.onclick = e => {
    e.stopPropagation();
    openEditor(titleText, "title");
  };

  menuIcon.onclick = e => {
    e.stopPropagation();
    openEditor(menu, "menu");
  };

  /* ---------- COLOR ---------- */
  editor.querySelector(".ed-color").onclick = () => {
    editor.querySelector(".ed-picker").click();
  };

  editor.querySelector(".ed-picker").oninput = e => {
    if (!active) return;

    if (mode === "title") {
      active.style.color = e.target.value;
    }

    if (mode === "menu") {
      active.querySelectorAll("li").forEach(li => {
        li.style.color = e.target.value;
      });
    }
  };

  /* ---------- FONT ---------- */
  editor.querySelector(".ed-font").onclick = () => {
    if (!active) return;

    const fam = prompt("Font family");
    const style = prompt("Font style (normal / italic)");
    const size = prompt("Font size (px)");
    const weight = prompt("Font weight (400 / 500 / 600 / 700)");

    const apply = el => {
      if (fam) el.style.fontFamily = fam;
      if (style) el.style.fontStyle = style;
      if (size) el.style.fontSize = size + "px";
      if (weight) el.style.fontWeight = weight;
    };

    if (mode === "title") apply(active);
    if (mode === "menu") active.querySelectorAll("li").forEach(apply);
  };

  /* ---------- EDIT TEXT ---------- */
  editor.querySelector(".ed-edit").onclick = () => {
    if (!active) return;

    if (mode === "title") {
      const t = prompt("Edit title", active.textContent.trim());
      if (t) active.textContent = t;
    }

    if (mode === "menu") {
      active.querySelectorAll("li").forEach(li => {
        const t = prompt("Edit menu item", li.textContent.trim());
        if (t) li.textContent = t;
      });
    }
  };

  /* ---------- REMOVE MENU ITEM ---------- */
  editor.querySelector(".ed-remove").onclick = () => {
    if (mode !== "menu") return;

    const items = Array.from(menu.querySelectorAll("li"));
    const names = items.map((li, i) => `${i+1}. ${li.textContent}`).join("\n");

    const index = prompt(
      "Enter menu item number to remove:\n" + names
    );

    const i = parseInt(index) - 1;
    if (!isNaN(i) && items[i]) {
      items[i].remove();
    }
  };

  /* ---------- RESET ---------- */
  editor.querySelector(".ed-reset").onclick = () => {
    const d = defaults.get(active);
    if (!d) return;

    active.innerHTML = d.html;
    active.style.color = d.color;
    active.style.fontFamily = d.font;
    active.style.fontSize = d.size;
    active.style.fontWeight = d.weight;
    active.style.fontStyle = d.style;
  };

  /* ---------- CLOSE ---------- */
  document.addEventListener("click", () => {
    editor.style.display = "none";
  });

})();


/* ================= HERO EDITOR LOGIC ================= */
(function(){

  let activeEl = null;
  let defaultStyles = new Map();

  const box = document.createElement("div");
  box.className = "hero-editor-box";
  document.body.appendChild(box);

  function saveDefault(el){
    if(!defaultStyles.has(el)){
      defaultStyles.set(el, {
        color: el.style.color || "",
        font: el.style.fontFamily || "",
        size: el.style.fontSize || "",
        weight: el.style.fontWeight || "",
        bg: el.style.backgroundImage || el.style.backgroundColor || ""
      });
    }
  }

  function reset(el){
    const d = defaultStyles.get(el);
    if(!d) return;
    el.style.color = d.color;
    el.style.fontFamily = d.font;
    el.style.fontSize = d.size;
    el.style.fontWeight = d.weight;
    el.style.background = d.bg;
  }

  /* ---------- TEXT EDITOR ---------- */
  document.querySelectorAll(".hero-editable .edit-icon, .hero-btn .edit-icon")
    .forEach(icon=>{
      icon.addEventListener("click", e=>{
        e.stopPropagation();
        activeEl = icon.parentElement;
        saveDefault(activeEl);

        box.innerHTML = `
          <div data-act="color">🎨 Color</div>
          <div data-act="font">🔤 Font</div>
          <div data-act="text">✏️ Edit text</div>
          ${activeEl.classList.contains("hero-btn") ? `<div data-act="bg">🟨 Background color</div>` : ``}
          <div data-act="default">↩ Default</div>
        `;
        box.style.display = "block";
      });
    });

  /* ---------- HERO BACKGROUND ---------- */
  document.querySelector(".hero-bg-edit").addEventListener("click", ()=>{
    activeEl = document.getElementById("hero");
    saveDefault(activeEl);

    box.innerHTML = `
      <div data-act="bgcolor">🎨 Background color</div>
      <div data-act="bgimg">🖼 Background image</div>
      <div data-act="default">↩ Default</div>
    `;
    box.style.display = "block";
  });

  /* ---------- ACTION HANDLER ---------- */
  box.addEventListener("click", e=>{
    const act = e.target.dataset.act;
    if(!act || !activeEl) return;

    if(act==="color"){
      const i = document.createElement("input");
      i.type="color";
      i.oninput=()=>activeEl.style.color=i.value;
      i.click();
    }

    if(act==="font"){
      const f = prompt("Font family (eg: Georgia)");
      const s = prompt("Font size (eg: 48px)");
      const w = prompt("Font weight (eg: 700)");
      if(f) activeEl.style.fontFamily=f;
      if(s) activeEl.style.fontSize=s;
      if(w) activeEl.style.fontWeight=w;
    }

    if(act==="text"){
      const t = prompt("Edit text", activeEl.innerText.trim());
      if(t) activeEl.childNodes[0].textContent = t;
    }

    if(act==="bg"){
      const i = document.createElement("input");
      i.type="color";
      i.oninput=()=>activeEl.style.backgroundColor=i.value;
      i.click();
    }

    if(act==="bgcolor"){
      const i = document.createElement("input");
      i.type="color";
      i.oninput=()=>activeEl.style.background=i.value;
      i.click();
    }

    if(act==="bgimg"){
      const url = prompt("Enter image URL");
      if(url){
        activeEl.style.background = `url(${url}) center/cover no-repeat`;
      }
    }

    if(act==="default"){
      reset(activeEl);
    }

  });

  document.addEventListener("click", ()=>box.style.display="none");

})();


/* ================= HERO BACKGROUND EDITOR — FIXED ================= */
(function () {

  const hero = document.getElementById("hero");
  const bgEditBtn = document.querySelector(".hero-bg-edit");

  if (!hero || !bgEditBtn) return;

  // store default background ONCE
  const defaultHeroBG = {

    background: hero.style.background || "",
    backgroundImage: getComputedStyle(hero).backgroundImage
  };

  // editor box (reuse if exists)
  let editorBox = document.querySelector(".hero-editor-box");

  if (!editorBox) {
    editorBox = document.createElement("div");
    editorBox.className = "hero-editor-box";
    document.body.appendChild(editorBox);
  }

  // open editor on click
  bgEditBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    editorBox.innerHTML = `
      <div data-action="bg-color">🎨 Background color</div>
      <div data-action="bg-image">🖼 Background image</div>
      <div data-action="default">↩ Default</div>
    `;

    editorBox.style.display = "block";
  });

  // handle editor actions
  editorBox.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    // 🎨 Background Color
    if (action === "bg-color") {
      const picker = document.createElement("input");
      picker.type = "color";
      picker.oninput = () => {
        hero.style.backgroundImage = "none";
        hero.style.backgroundColor = picker.value;
      };
      picker.click();
    }

    // 🖼 Background Image
    if (action === "bg-image") {
      const url = prompt("Enter image URL");
      if (url) {
        hero.style.background =
          `linear-gradient(rgba(72,69,70,0.61), rgba(145,32,64,0.651), rgba(86,80,82,0.61)), url('${url}') center / cover no-repeat`;
      }
    }

    // ↩ Default
    if (action === "default") {
      hero.style.background = defaultHeroBG.background;
      hero.style.backgroundImage = defaultHeroBG.backgroundImage;
    }
  });

  // close editor when clicking outside
  document.addEventListener("click", () => {
    editorBox.style.display = "none";
  });

})();
