(function () {
  var STORAGE_KEY = "drama-api-config";
  var STYLE_ID = "xkm-openai-oauth-style";
  var STATUS_CACHE = null;
  var POLL_TIMER = null;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".xkm-oauth-panel{margin:12px 0;padding:12px;border:1px solid #bfdbfe;background:#eff6ff;border-radius:12px;color:#1e3a8a;font-size:13px;line-height:1.5}",
      ".xkm-oauth-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      ".xkm-oauth-btn{border:1px solid #93c5fd;background:#fff;color:#1d4ed8;border-radius:10px;padding:7px 12px;font-weight:600;cursor:pointer}",
      ".xkm-oauth-btn:hover{background:#dbeafe}",
      ".xkm-oauth-btn.secondary{border-color:#e5e7eb;color:#374151}",
      ".xkm-oauth-status{color:#475569}"
    ].join("");
    document.head.appendChild(style);
  }

  function setNativeValue(el, value) {
    if (!el) return;
    var proto = Object.getPrototypeOf(el);
    var descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    var fallback = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    var setter = descriptor && descriptor.set ? descriptor.set : fallback && fallback.set;
    if (setter) setter.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function mergeStorage(section, patch) {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var cfg = raw ? JSON.parse(raw) : {};
      cfg[section] = Object.assign({}, cfg[section] || {}, patch);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (err) {
      console.warn("[OpenAI OAuth] failed to update local config", err);
    }
  }

  function bridgeBaseUrl() {
    return (STATUS_CACHE && STATUS_CACHE.bridgeBaseUrl) || (location.origin + "/api/openai-oauth/v1");
  }

  function applyConfig(kind) {
    var isImage = kind === "image";
    var patch = {
      baseUrl: bridgeBaseUrl(),
      apiKey: "oauth",
      model: isImage ? "gpt-image-2" : "gpt-5.5",
      authType: "openai-oauth"
    };
    setNativeValue(document.getElementById(isImage ? "imgBaseUrl" : "baseUrl"), patch.baseUrl);
    setNativeValue(document.getElementById(isImage ? "imgApiKey" : "apiKey"), patch.apiKey);
    setNativeValue(document.getElementById(isImage ? "imgModel" : "model"), patch.model);
    mergeStorage(isImage ? "image" : "llm", patch);
    setStatus(kind, "已填入 OpenAI 登录桥接配置，请点右下角保存配置。");
  }

  async function getStatus() {
    var res = await fetch("/api/openai-oauth/status", { credentials: "same-origin" });
    if (!res.ok) throw new Error("状态检查失败: " + res.status);
    STATUS_CACHE = await res.json();
    return STATUS_CACHE;
  }

  function setStatus(kind, text) {
    var el = document.querySelector('[data-xkm-oauth-status="' + kind + '"]');
    if (el) el.textContent = text;
  }

  function startPolling(kind) {
    clearInterval(POLL_TIMER);
    var started = Date.now();
    POLL_TIMER = setInterval(async function () {
      try {
        var st = await getStatus();
        if (st.authenticated) {
          clearInterval(POLL_TIMER);
          applyConfig(kind);
        } else if (Date.now() - started > 5 * 60 * 1000) {
          clearInterval(POLL_TIMER);
          setStatus(kind, "登录超时，请重新点击登录。");
        }
      } catch (err) {
        setStatus(kind, err.message || String(err));
      }
    }, 1500);
  }

  async function loginAndApply(kind) {
    try {
      var st = await getStatus();
      if (st.authenticated) {
        applyConfig(kind);
        return;
      }
      setStatus(kind, "正在打开 OpenAI 登录窗口...");
      var res = await fetch("/api/openai-oauth/start", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: "{}"
      });
      if (!res.ok) throw new Error("创建登录会话失败: " + res.status);
      var data = await res.json();
      var popup = window.open(data.authUrl, "xkm-openai-oauth", "width=560,height=760");
      if (!popup) setStatus(kind, "浏览器拦截了登录窗口，请允许弹窗后重试。");
      else {
        setStatus(kind, "登录完成后会自动填入配置。");
        startPolling(kind);
      }
    } catch (err) {
      setStatus(kind, err.message || String(err));
    }
  }

  async function logout(kind) {
    try {
      await fetch("/api/openai-oauth/logout", { method: "POST", credentials: "same-origin" });
      STATUS_CACHE = null;
      setStatus(kind, "已退出 OpenAI 登录。");
    } catch (err) {
      setStatus(kind, err.message || String(err));
    }
  }

  function panel(kind) {
    var div = document.createElement("div");
    div.className = "xkm-oauth-panel";
    div.id = "xkm-openai-oauth-" + kind;
    div.innerHTML =
      '<div class="xkm-oauth-row">' +
      '<button type="button" class="xkm-oauth-btn" data-xkm-oauth-login="' + kind + '">OpenAI 登录并应用</button>' +
      '<button type="button" class="xkm-oauth-btn secondary" data-xkm-oauth-apply="' + kind + '">仅应用已登录配置</button>' +
      '<button type="button" class="xkm-oauth-btn secondary" data-xkm-oauth-logout="' + kind + '">退出登录</button>' +
      '</div>' +
      '<div class="xkm-oauth-status" data-xkm-oauth-status="' + kind + '">通过本地 OAuth 桥接使用 ChatGPT/Codex 登录态，API Key 填 oauth 即可。</div>';
    div.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || !target.getAttribute) return;
      var loginKind = target.getAttribute("data-xkm-oauth-login");
      var applyKind = target.getAttribute("data-xkm-oauth-apply");
      var logoutKind = target.getAttribute("data-xkm-oauth-logout");
      if (loginKind) loginAndApply(loginKind);
      if (applyKind) getStatus().then(function (st) {
        if (st.authenticated) applyConfig(applyKind);
        else setStatus(applyKind, "还没有登录 OpenAI，请先点击登录。");
      }).catch(function (err) { setStatus(applyKind, err.message || String(err)); });
      if (logoutKind) logout(logoutKind);
    });
    return div;
  }

  function enhance() {
    ensureStyle();
    var llmModel = document.getElementById("model");
    if (llmModel && !document.getElementById("xkm-openai-oauth-llm")) {
      (llmModel.closest("div") || llmModel.parentElement).insertAdjacentElement("afterend", panel("llm"));
    }
    var imgModel = document.getElementById("imgModel");
    if (imgModel && !document.getElementById("xkm-openai-oauth-image")) {
      (imgModel.closest("div") || imgModel.parentElement).insertAdjacentElement("afterend", panel("image"));
    }
  }

  window.addEventListener("message", function (event) {
    if (event && event.data && event.data.type === "openai-oauth-complete") {
      getStatus().then(function () {
        if (document.getElementById("imgModel")) applyConfig("image");
        else applyConfig("llm");
      }).catch(function () {});
    }
  });

  new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhance);
  else enhance();
})();
