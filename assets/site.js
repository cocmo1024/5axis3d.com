(function () {
  var SALES = "cqq365@gmail.com";

  /* ---- nav: highlight the current section ---- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    var navLinks = document.querySelectorAll("nav.main a[data-spy]");
    navLinks.forEach(function (a) {
      if (a.getAttribute("data-spy") === page) a.classList.add("active");
    });
  }

  var select = document.getElementById("f-interest");

  /* ---- /contact/?interest=... pre-selects the form ---- */
  if (select) {
    var want = new URLSearchParams(window.location.search).get("interest");
    if (want) {
      for (var k = 0; k < select.options.length; k++) {
        if (select.options[k].text.replace(/\s+/g, " ").trim() === want) { select.selectedIndex = k; break; }
      }
      var st = document.getElementById("form-status");
      if (st) st.textContent = "Interest set to: " + want + ". Tell us about your project below.";
    }
  }

  /* ---- path buttons pre-select the contact form (or go to /contact/) ---- */
  var quoteButtons = document.querySelectorAll("[data-quote]");
  for (var j = 0; j < quoteButtons.length; j++) {
    quoteButtons[j].addEventListener("click", function () {
      var wanted = this.getAttribute("data-quote");
      if (select) {
        for (var k2 = 0; k2 < select.options.length; k2++) {
          if (select.options[k2].text.replace(/\s+/g, " ").trim() === wanted) { select.selectedIndex = k2; break; }
        }
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
        document.getElementById("form-status").textContent = "Interest set to: " + wanted + ". Tell us about your project below.";
      } else {
        window.location.href = "/contact/?interest=" + encodeURIComponent(wanted);
      }
    });
  }

  /* ---- contact form: build message, open mail client or copy ---- */
  var form = document.getElementById("rfq-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  function field(id) { return document.getElementById(id).value.trim(); }
  function buildMessage() {
    var lines = [
      "Name: " + field("f-name"),
      "Institution / company: " + (field("f-company") || "—"),
      "Email: " + field("f-email"),
      "Country: " + field("f-country"),
      "Interested in: " + select.options[select.selectedIndex].text,
      "",
      "What I'm working on:",
      field("f-part") || "—"
    ];
    return lines.join("\n");
  }
  function subject() { return "5-axis conformal printing — " + select.options[select.selectedIndex].text; }
  function validate() {
    if (!field("f-name") || !field("f-country")) {
      status.textContent = "Please add your name and country so we know who and where you are.";
      return false;
    }
    var email = field("f-email");
    if (!email || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
      status.textContent = "Please add a valid email — our reply goes by email.";
      return false;
    }
    return true;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var href = "mailto:" + SALES + "?subject=" + encodeURIComponent(subject()) + "&body=" + encodeURIComponent(buildMessage());
    status.textContent = "Opening your email client… If nothing opens, use “Copy message text” and paste it into an email to " + SALES + ".";
    var a = document.createElement("a");
    a.href = href;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  document.getElementById("copy-btn").addEventListener("click", function () {
    if (!validate()) return;
    var text = "To: " + SALES + "\nSubject: " + subject() + "\n\n" + buildMessage();
    function done() { status.textContent = "Message copied. Paste it into an email to " + SALES + " and attach any models or sketches."; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); }
      catch (err) { status.textContent = "Copy failed in this browser — please email " + SALES + " directly."; }
      document.body.removeChild(ta);
    }
  });
})();

/* ---- mobile navigation toggle ---- */
(function () {
  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();
