var PORTFOLIO_FILTERS_ANIMATION_DURATION = 300;

var allLinks = document.querySelectorAll("nav a");

var nav = document.querySelector("nav");

var navHeight = nav.clientHeight;

var html = document.querySelector("html");

var activeLink = "";

var sectionsData = initializeSectionsData();

var themeToggleBtn = document.getElementById("theme-toggle-button");

var ticking = false;

var navLinks = document.getElementById("navLinks");

var navTogglerBtn = document.getElementById("navToggler");

document.getElementById("copyRightDate").innerText = new Date().getFullYear();

function initializeSectionsData() {
  var sections = document.querySelectorAll("section");
  var data = [];
  for (var i = 0; i < sections.length; i++) {
    for (var j = 0; j < allLinks.length; j++) {
      if ("#" + sections[i].id === allLinks[j].getAttribute("href")) {
        data.push({
          id: sections[i].id,
          element: sections[i],
          link: allLinks[j],
        });
        break;
      } 
    }
  }
  return data;
}

function clearActiveState() {
  allLinks.forEach(function (link) {
    link.classList.remove("active");
  });
}

function setActiveLink() {
  initializeSideTheme();
  for (var i = 0; i < sectionsData.length; i++) {
    var rect = sectionsData[i].element.getBoundingClientRect();

    if (rect.top <= navHeight && rect.bottom >= navHeight) {
      if (activeLink === sectionsData[i].id) return;
      activeLink = sectionsData[i].id;

      clearActiveState();
      sectionsData[i].link.classList.add("active");
      return;
    }
  }

  activeLink = "";
  clearActiveState();
}

function scrollingTrigger() {
  if (ticking) return;

  ticking = true;
  requestAnimationFrame(function () {
    setActiveLink();

    ticking = false;
  });
}

function handleNavToggler() {
  closeSettings();
  if (navLinks.classList.contains("show-nav-links"))
    closeMenu();
  else navLinks.classList.add("show-nav-links");
}

function switchSideTheme() {
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("SideTheme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("SideTheme", "dark");
  }
}

function initializeSideTheme() {
  if (!localStorage.getItem("SideTheme"))
    localStorage.setItem("SideTheme", "dark");
  if (localStorage.getItem("SideTheme") === "light") {
    html.classList.remove("dark");
  } else {
    html.classList.add("dark");
  }
}

function closeMenu() {
  navLinks.classList.remove("show-nav-links");
}

navLinks.addEventListener("click", function(e){
  if (e.target.getAttribute("role") !== "menuitem" ) return;
  closeMenu();
});

themeToggleBtn.addEventListener("click", switchSideTheme);

window.addEventListener("load", setActiveLink);

window.addEventListener("scroll", scrollingTrigger);

navTogglerBtn.addEventListener("click", handleNavToggler);

var scrollToTopBtn = document.getElementById("scroll-to-top");

var scrollToTopObserver = new IntersectionObserver(function (e) {
  handleScrollToTopBtn(e);
}, initializeScrollToTopBtnSettings());

scrollToTopObserver.observe(sectionsData[0].element);

function initializeScrollToTopBtnSettings() {
  return { rootMargin: "-" + navHeight + "px 0px 0px 0px" };
}

function handleScrollToTopBtn(e) {
  if (e[0].isIntersecting) {
    scrollToTopBtn.classList.add("opacity-0");
  } else {
    scrollToTopBtn.classList.remove("opacity-0");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

scrollToTopBtn.addEventListener("click", scrollToTop);

var portfolioFilters = document.getElementById("portfolio-filters");

var filterBtns = document.querySelectorAll(".portfolio-filter");

var items = document.querySelectorAll(".portfolio-item");

var activeFilterBtnClasses = [
  "active",
  "bg-linear-to-r",
  "from-primary",
  "to-secondary",
  "text-white",
  "shadow-lg",
  "shadow-primary/50",
  "hover:shadow-primary/50",
];

var inactiveFilterBtnClasses = [
  "bg-white",
  "dark:bg-slate-800",
  "text-slate-600",
  "dark:text-slate-300",
  "border",
  "border-slate-300",
  "dark:border-slate-700",
  "dark:hover:bg-slate-700",
];

function clearItemTimeouts(item) {
  clearTimeout(item.hide);
  clearTimeout(item.show);
}

function activateFilterBtn(ele) {
  ele.classList.add(...activeFilterBtnClasses);
  ele.classList.remove(...inactiveFilterBtnClasses);
  ele.setAttribute("aria-pressed", "true");
}

function disActivateFilterBtn(ele) {
  ele.classList.remove(...activeFilterBtnClasses);
  ele.classList.add(...inactiveFilterBtnClasses);
  ele.setAttribute("aria-pressed", "false");
}

function disActiveAllFilterBtn() {
  filterBtns.forEach(function (btn) {
    disActivateFilterBtn(btn);
  });
}

function showMatchedItems(item) {
  item.classList.remove("myhidden");
  clearItemTimeouts(item);
  item.show = setTimeout(function () {
    item.classList.remove("myd-none");
  }, PORTFOLIO_FILTERS_ANIMATION_DURATION);
}

function hideUnMatchedItems(item) {
  item.classList.add("myhidden");
  clearItemTimeouts(item);
  item.hide = setTimeout(function () {
    item.classList.add("myd-none");
  }, PORTFOLIO_FILTERS_ANIMATION_DURATION);
}

function handlePortfolioFiltering(e) {
  if (
    e.target.classList.contains("portfolio-filter") &&
    e.target.getAttribute("aria-pressed") !== "true"
  ) {
    var btn = e.target;
    disActiveAllFilterBtn();
    activateFilterBtn(btn);
    if (btn.getAttribute("data-filter") !== "all") {
      items.forEach(function (item) {
        if (
          item.getAttribute("data-category") !== btn.getAttribute("data-filter")
        ) {
          hideUnMatchedItems(item);
        } else {
          showMatchedItems(item);
        }
      });
    } else {
      items.forEach(function (item) {
        clearItemTimeouts(item);
        item.classList.remove("myd-none");
        item.classList.add("mycollapsed");
        item.show = setTimeout(function () {
          item.classList.remove("mycollapsed");
          item.classList.remove("myhidden");
        }, PORTFOLIO_FILTERS_ANIMATION_DURATION);
      });
    }
  }
}

portfolioFilters.addEventListener("click", function (e) {
  handlePortfolioFiltering(e);
});

var carousel = document.getElementById("testimonials-carousel");
var testimonialCards = document.querySelectorAll(".testimonial-card");

var carouselIndicator = document.getElementById("carouselIndicators");
var carouselIndicators = document.querySelectorAll(".carousel-indicator");

var nextBtn = document.getElementById("next-testimonial");
var prevBtn = document.getElementById("prev-testimonial");

var progress = 0;

var maxIndicators = carouselIndicators.length - 1;

var itemWidth;

var currentIndex = 0;

var maxIndex = testimonialCards.length - initializeVisibleItems();

function updateItemWidth() {
  itemWidth = testimonialCards[0].offsetWidth;
}

function initializeVisibleItems() {
  if (window.innerWidth >= 1024) return 3;
  else if (window.innerWidth >= 768) return 2;
  else return 1;
}

function handleCarouselMoveOnResize() {
  maxIndex = testimonialCards.length - initializeVisibleItems();
  updateItemWidth();
  if (currentIndex > maxIndex) currentIndex = maxIndex;
  progress = currentIndex * itemWidth;
  moveCarousel(progress);
}

function updateIndicators() {
  carouselIndicators.forEach(function (item) {
    item.classList.remove("active", "bg-accent", "scale-125");
    item.classList.add("bg-slate-400", "dark:bg-slate-600");
  });
  if (currentIndex > maxIndicators || currentIndex < 0) return;
  carouselIndicators[currentIndex].classList.add(
    "active",
    "bg-accent",
    "scale-125",
  );
  carouselIndicators[currentIndex].classList.remove(
    "bg-slate-400",
    "dark:bg-slate-600",
  );
}

function moveCarousel(progress) {
  carousel.style.transform = `translateX(${progress}px)`;
  updateIndicators();
}

function moveForward() {
  updateItemWidth();

  currentIndex++;

  if (currentIndex > maxIndex) {
    currentIndex = 0;
  }
  progress = currentIndex * itemWidth;

  moveCarousel(progress);
}

function moveBack() {
  updateItemWidth();

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = maxIndex;
  }
  progress = currentIndex * itemWidth;
  moveCarousel(progress);
}

function handleCarouselIndicator(e) {
  if (!e.target.classList.contains("carousel-indicator")) return;
  else if (currentIndex === +e.target.getAttribute("data-index")) return;
  updateItemWidth();
  currentIndex = +e.target.getAttribute("data-index");
  progress = currentIndex * itemWidth;
  moveCarousel(progress);
}

window.addEventListener("resize", handleCarouselMoveOnResize);

nextBtn.addEventListener("click", moveForward);

prevBtn.addEventListener("click", moveBack);

carouselIndicator.addEventListener("click", function (e) {
  handleCarouselIndicator(e);
});

var EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

var contactForm = document.querySelector("form");

var form = {
  fullName: document.getElementById("full-name"),
  email: document.getElementById("email"),
  projectDetails: document.getElementById("project-details"),
  errormsgs: document.querySelectorAll(".error-msg"),
  msg: {
    fullName: document.getElementById("fullNameErrorMsg"),
    email: document.getElementById("emailErrorMsg"),
    projectDetails: document.getElementById("projectDetailsErrorMsg"),
  },
  inputs: document.querySelectorAll("form input"),
  textarea: document.querySelector("form textarea"),
  selectWrappers: document.querySelectorAll("form .custom-select-wrapper"),
  sendBtn : document.getElementById("sendBtn"),
};

var activeCustomSelect,icon;

var customSelectDefaultValueData = [];

function hideCustomOptions() {
  activeCustomSelect?.classList.add("hidden");
  if (icon) {
    icon.style.transform = "rotate(0deg)";
  }
}

function handleCustomSelect(e, selectWrapper) {
  e.stopPropagation();
  if (e.target.closest(".custom-select")) {
    var select = e.target.closest(".custom-select");
    for (var i = 0; i < select.children.length; i++) {
      if (select.children[i].classList.contains("fa-chevron-down")) {
        icon = select.children[i];
        break;
      }
    }
    if (selectWrapper.children[1].classList.contains("custom-options")) {
      if (selectWrapper.children[1].classList.contains("hidden")) {
        hideCustomOptions();
        activeCustomSelect = selectWrapper.children[1];
        selectWrapper.children[1].classList.remove("hidden");
        icon.style.transform = "rotate(180deg)";
      } else {
        selectWrapper.children[1].classList.add("hidden");
        icon.style.transform = "rotate(0deg)";
      }
    } else {
      for (var i = 0; i < selectWrapper.children.length; i++) {
        if (selectWrapper.children[i].classList.contains("custom-options")) {
          if (selectWrapper.children[i].classList.contains("hidden")) {
            activeCustomSelect = selectWrapper.children[i];
            selectWrapper.children[i].classList.remove("hidden");
            icon.style.transform = "rotate(180deg)";
          } else {
            selectWrapper.children[i].classList.add("hidden");
            icon.style.transform = "rotate(0deg)";
          }
        }
      }
    }
  } else if (e.target.classList.contains("custom-option")) {
    customSelectDefaultValueData.push({
      defaultValue: selectWrapper.children[0].children[0].innerText,
      element: selectWrapper.children[0].children[0],
    });
    selectWrapper.children[0].children[0].innerText = e.target.innerText;
    icon.style.transform = "rotate(0deg)";
    hideCustomOptions();
  }
}

function createSuccessMsg() {
  var divMsg = document.createElement("div");
  divMsg.className =
    "fixed inset-0 flex items-center justify-center z-50 bg-slate-950/80 backdrop-blur-sm";
  divMsg.innerHTML = `
      <div class="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center border border-slate-700 shadow-2xl transform animate-fade-in">
        <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-check text-4xl text-white"></i>
        </div>
        <h3 class="text-2xl font-bold mb-3">تم إرسال رسالتك بنجاح!</h3>
        <p class="text-slate-400 mb-6">شكراً لتواصلك. سأرد عليك في أقرب وقت ممكن.</p>
        <button class="success-popup-close bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300">
          حسناً
        </button>
      </div>
    `;
  document.body.appendChild(divMsg);
  divMsg
    .querySelector(".success-popup-close")
    .addEventListener("click", function () {
      clearAllErrorMsg();
      divMsg.remove();
    });
  setTimeout(() => {
    divMsg.remove();
  }, 3000);
}

function clearAllErrorMsg() {
  form.errormsgs.forEach(function (ele) {
    if (!ele.classList.contains("myd-none")) {
      ele.classList.add("myd-none");
    }
  });
}

function clearForm() {
  clearAllErrorMsg();
  form.inputs.forEach(function (ele) {
    ele.value = "";
  });

  customSelectDefaultValueData.forEach(function (obj) {
    obj.element.innerText = obj.defaultValue;
  });

  form.textarea.value = "";
}

function validateName() {
  if (form.fullName.value.trim() === "") {
    form.msg.fullName.classList.remove("myd-none");
    form.msg.fullName.innerText = "يرجى إدخال الاسم الكامل";
    return false;
  } else {
    form.msg.fullName.classList.add("myd-none");
    return true;
  }
}

function validateEmail() {
  if (form.email.value.trim() === "") {
    form.msg.email.classList.remove("myd-none");
    form.msg.email.innerText = "يرجى إدخال البريد الإلكتروني";
    return false;
  } else if (!EMAIL_REGEX.test(form.email.value.trim())) {
    form.msg.email.classList.remove("myd-none");
    form.msg.email.innerText = "يرجى إدخال بريد الكتروني صالح";
    return false;
  } else {
    form.msg.email.classList.add("myd-none");
    return true;
  }
}

function validateDetails() {
  if (form.projectDetails.value.trim() === "") {
    form.msg.projectDetails.innerText = "يرجى إدخال تفاصيل المشروع";
    form.msg.projectDetails.classList.remove("myd-none");
    return false;
  } else if (form.projectDetails.value.trim().length < 10) {
    form.msg.projectDetails.innerText = "يرجى إدخال المزيد من التفاصيل";
    form.msg.projectDetails.classList.remove("myd-none");
    return false;
  } else {
    form.msg.projectDetails.classList.add("myd-none");
    return true;
  }
}

function send() {
  var name = validateName();
  var email = validateEmail();
  var details = validateDetails();
  if (name && email && details) {
    clearForm();
    createSuccessMsg();
  }
}

form.sendBtn.addEventListener("click",send);
form.selectWrappers.forEach(function (selectWrapper) {
  selectWrapper.addEventListener("click", function (e) {
    handleCustomSelect(e, selectWrapper);
  });
});
document.addEventListener("click", hideCustomOptions);
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
});
form.fullName.addEventListener("blur", validateName);
form.email.addEventListener("blur", validateEmail);
form.projectDetails.addEventListener("blur", validateDetails);

var THEME_KEY_NAME = "theme";
var FONT_KEY_NAME = "font";

var root = document.querySelector(":root");

var body = document.querySelector("body");

var settingsToggleBtn = document.getElementById("settings-toggle");
var closeSettingsBtn = document.getElementById("close-settings");
var settingsSidebar = document.getElementById("settings-sidebar");

var activeFontOptionClasses = [
  "active",
  "border-primary",
  "bg-slate-50",
  "dark:bg-slate-800",
];

var inActiveFontOptionClasses = ["border-slate-200", "dark:border-slate-700"];

var activeThemeClasses = [
  "ring-2",
  "ring-primary",
  "ring-offset-2",
  "ring-offset-white",
  "dark:ring-offset-slate-900",
];

var themes = [
  `<button class="theme-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900" title="Purple Blue" data-primary="#6366f1" data-secondary="#8b5cf6" style="background: linear-gradient(135deg, rgb(99, 102, 241), rgb(139, 92, 246));"></button>`,
  `<button class="theme-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm" title="Pink Orange" data-primary="#ec4899" data-secondary="#f97316" style="background: linear-gradient(135deg, rgb(236, 72, 153), rgb(249, 115, 22));"></button>`,
  `<button class="theme-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm" title="Green Emerald" data-primary="#10b981" data-secondary="#059669" style="background: linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105));"></button>`,
  `<button class="theme-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm" title="Blue Cyan" data-primary="#3b82f6" data-secondary="#06b6d4" style="background: linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212));"></button>`,
  `<button class="theme-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm" title="Red Rose" data-primary="#ef4444" data-secondary="#f43f5e" style="background: linear-gradient(135deg, rgb(239, 68, 68), rgb(244, 63, 94));"></button>`,
  `<button class="theme-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm" title="Amber Orange" data-primary="#f59e0b" data-secondary="#ea580c" style="background: linear-gradient(135deg, rgb(245, 158, 11), rgb(234, 88, 12));"></button>`,
];

var fontOptionsWrapper = document.getElementById("fontOptions");

var allFontOptions = document.querySelectorAll(".font-option");

var resetSettingsBtn = document.getElementById("reset-settings");

var themeColorsGrid = document.getElementById("theme-colors-grid");

var defaultTheme = {
  title: "Purple Blue",
  primary: "#6366f1",
  secondary: "#8b5cf6",
};

var defaultFont = "tajawal";

var themeBtns;

function openSetting() {
  if (settingsSidebar.classList.contains("translate-x-full")) {
    var settingsSidebarWidth = settingsSidebar.clientWidth;
    settingsToggleBtn.style = `transform: translate(-${settingsSidebarWidth}px,-50%)`;
    settingsSidebar.classList.remove("translate-x-full");
    settingsSidebar.setAttribute("aria-hidden", "false");
  }
}

function closeSettings() {
  settingsToggleBtn.style = `transform: translateY(-50%)`;
  settingsSidebar.classList.add("translate-x-full");
  if (settingsSidebar.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  settingsSidebar.setAttribute("aria-hidden", "true");
}

function fontActivation(e) {
  var fontOptionBtn = e.target.closest(".font-option");

  if (!fontOptionBtn) return;
  if (fontOptionBtn.classList.contains("active")) return;

  disActivateAllFontOptions();

  fontOptionBtn.classList.remove(...inActiveFontOptionClasses);
  fontOptionBtn.classList.add(...activeFontOptionClasses);
  activateFont(fontOptionBtn.getAttribute("data-font"));
}

function disActivateAllFontOptions() {
  allFontOptions.forEach(function (ele) {
    ele.classList.remove(...activeFontOptionClasses);
    ele.classList.add(...inActiveFontOptionClasses);
  });
}

function applyFont(fontName) {
  var arr = body.className.split(" ");
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].includes("font-")) {
      body.classList.replace(arr[i], `font-${fontName}`);
      break;
    }
  }
}

function findAndUpdateAndActiveCurrentFont(fontName) {
  for (var i = 0; i < allFontOptions.length; i++) {
    if (allFontOptions[i].getAttribute("data-font") === fontName) {
      allFontOptions[i].classList.remove(...inActiveFontOptionClasses);
      allFontOptions[i].classList.add(...activeFontOptionClasses);
      applyFont(fontName);
      return;
    }
  }
}

function initializeFont() {
  var activeFont = localStorage.getItem(FONT_KEY_NAME);
  if (activeFont) {
    findAndUpdateAndActiveCurrentFont(activeFont);
  } else {
    findAndUpdateAndActiveCurrentFont(defaultFont);
  }
}

function activateFont(newFont) {
  if (localStorage.getItem(FONT_KEY_NAME) !== newFont) {
    localStorage.setItem(FONT_KEY_NAME, newFont);
  }
  applyFont(newFont);
}

function handleTheme(e) {
  var ThemeBtn = e.target.closest(".theme-btn");
  if (!ThemeBtn) return;
  if (ThemeBtn.classList.contains("ring-2")) return;
  disActivateAllThemeOptions();
  ThemeBtn.classList.add(...activeThemeClasses);
  var themeData = {
    title: ThemeBtn.getAttribute("title"),
    primary: ThemeBtn.getAttribute("data-primary"),
    secondary: ThemeBtn.getAttribute("data-secondary"),
  };
  updateThemeInLocalStorage(themeData);
  applyTheme(themeData);
}

function disActivateAllThemeOptions() {
  themeBtns.forEach(function (ele) {
    ele.classList.remove(...activeThemeClasses);
  });
}

function findAndUpdateAndActiveCurrentTheme(currentTheme) {
  disActivateAllThemeOptions();
  for (var i = 0; i < themeBtns.length; i++) {
    if (themeBtns[i].getAttribute("title") === currentTheme.title) {
      themeBtns[i].classList.add(...activeThemeClasses);
      updateThemeInLocalStorage(currentTheme);
      applyTheme(currentTheme);
      return;
    }
  }
}

function initializeTheme() {
  var activeTheme = JSON.parse(localStorage.getItem(THEME_KEY_NAME));
  if (activeTheme) {
    findAndUpdateAndActiveCurrentTheme(activeTheme);
  } else {
    findAndUpdateAndActiveCurrentTheme(defaultTheme);
  }
}

function updateThemeInLocalStorage({ title, primary, secondary }) {
  var isThemeSet = JSON.parse(localStorage.getItem(THEME_KEY_NAME));
  if (isThemeSet?.title !== title && title !== defaultTheme.title) {
    localStorage.setItem(
      THEME_KEY_NAME,
      JSON.stringify({
        title: title,
        primary: primary,
        secondary: secondary,
      }),
    );
  }
}

function applyTheme({ primary, secondary }) {
  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-secondary", secondary);
}

function resetOptions() {
  localStorage.removeItem(THEME_KEY_NAME);
  localStorage.removeItem(FONT_KEY_NAME);
  disActivateAllFontOptions();
  initializeFont();
  disActivateAllThemeOptions();
  initializeTheme();
}

function loadSettings() {
  themeColorsGrid.innerHTML = themes.join("");
  themeBtns = document.querySelectorAll(".theme-btn");
  initializeFont();
  initializeTheme();
}

settingsToggleBtn.addEventListener("click", openSetting);

closeSettingsBtn.addEventListener("click", closeSettings);

fontOptionsWrapper.addEventListener("click", function (e) {
  fontActivation(e);
});

themeColorsGrid.addEventListener("click", function (e) {
  handleTheme(e);
});

resetSettingsBtn.addEventListener("click", resetOptions);

window.addEventListener("DOMContentLoaded", loadSettings);

document.addEventListener("click", function (e) {
  if (e.target.closest("#settings-toggle")) return;
  if (e.target.closest("#settings-sidebar")) return;
  closeSettings();
});
