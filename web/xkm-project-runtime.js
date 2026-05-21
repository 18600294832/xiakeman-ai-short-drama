const XKM_STATE_DB = "drama-app-state-db";
const XKM_STATE_STORE = "state-snapshots";
const XKM_META_STORE = "metadata";
const XKM_PRIMARY_KEY = "primary";
const XKM_ASSET_DB = "drama-asset-db";
const XKM_ASSET_STORE = "asset-blobs";
const XKM_DEFAULT_COVER = "./brand/xiakeman-logo-tight.png";
const XKM_ENHANCE_SNAPSHOT_CACHE_MS = 800;

const xkmLocalStoreUrl = (path) => {
  try {
    return window.location.protocol === "file:"
      ? `http://127.0.0.1:8022${path}`
      : path;
  } catch {
    return path;
  }
};

const xkmInjectProjectRuntimeStyles = () => {
  if (document.getElementById("xkm-project-runtime-styles")) return;
  const style = document.createElement("style");
  style.id = "xkm-project-runtime-styles";
  style.textContent = `
    .xkm-home .xkm-project-card {
      position: relative;
    }
    .xkm-home .xkm-project-card .xkm-project-meta {
      display: none !important;
    }
    .xkm-home .xkm-project-card .xkm-project-info button {
      border: 0 !important;
      background: linear-gradient(135deg, #ff9a72 0%, #ff7b95 52%, #c487f6 100%) !important;
      color: #fff !important;
      box-shadow: 0 14px 28px -20px rgba(244, 63, 94, .38) !important;
    }
    .xkm-home .xkm-project-card .xkm-project-info button:hover {
      filter: saturate(1.03) brightness(1.02);
      box-shadow: 0 16px 30px -22px rgba(168, 85, 247, .42) !important;
    }
    .xkm-default-cover-shell {
      background: #fff url("./brand/xiakeman-logo-tight.png") center / contain no-repeat !important;
    }
    .xkm-default-cover-shell > * {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    .xkm-sidebar-cover-shell {
      overflow: hidden;
      background-color: #fff !important;
      background-image: var(--xkm-sidebar-cover) !important;
      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
    }
    .xkm-sidebar-cover-shell > * {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    #xkm-project-overlay-root {
      position: fixed;
      inset: 0;
      z-index: 45;
      pointer-events: none;
    }
    .xkm-card-delete {
      position: fixed;
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(248, 113, 113, .24);
      border-radius: 10px;
      padding: 0;
      background: rgba(255, 255, 255, .76);
      color: rgb(248, 113, 113);
      box-shadow: 0 12px 24px -22px rgba(15, 23, 42, .58);
      pointer-events: auto;
      cursor: pointer;
      transition: background .18s ease, border-color .18s ease, color .18s ease, transform .18s ease;
    }
    .dark .xkm-card-delete {
      border-color: rgba(248, 113, 113, .20);
      background: rgba(255, 255, 255, .78);
      color: rgb(248, 113, 113);
    }
    .xkm-card-delete:hover {
      border-color: rgba(248, 113, 113, .38);
      background: rgba(255, 241, 242, .92);
      color: rgb(239, 68, 68);
      transform: translateY(-1px);
    }
    .dark .xkm-card-delete:hover {
      background: rgba(255, 241, 242, .94);
      color: rgb(239, 68, 68);
    }
    .xkm-card-delete svg {
      width: 15px;
      height: 15px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .xkm-card-delete:disabled {
      opacity: .5;
      cursor: not-allowed;
      transform: none;
    }
    .xkm-delete-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 80;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 23, 42, .58);
      backdrop-filter: blur(10px);
    }
    .xkm-delete-modal {
      width: min(420px, 100%);
      border: 1px solid rgba(148, 163, 184, .26);
      border-radius: 18px;
      background: rgba(255, 255, 255, .96);
      box-shadow: 0 28px 80px -38px rgba(15, 23, 42, .78);
      padding: 22px;
      color: rgb(15, 23, 42);
    }
    .dark .xkm-delete-modal {
      border-color: rgba(255, 255, 255, .12);
      background: rgba(15, 23, 42, .96);
      color: rgb(248, 250, 252);
    }
    .xkm-delete-modal h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.3;
      font-weight: 800;
      letter-spacing: 0;
    }
    .xkm-delete-modal p {
      margin: 12px 0 0;
      color: rgb(100, 116, 139);
      font-size: 14px;
      line-height: 1.7;
    }
    .dark .xkm-delete-modal p {
      color: rgb(148, 163, 184);
    }
    .xkm-delete-modal-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .xkm-delete-modal-actions button {
      min-height: 38px;
      border-radius: 12px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 700;
    }
    .xkm-delete-cancel {
      border: 1px solid rgba(148, 163, 184, .35);
      background: transparent;
      color: inherit;
    }
    .xkm-delete-confirm {
      border: 1px solid rgba(239, 68, 68, .68);
      background: rgb(239, 68, 68);
      color: white;
    }
    .xkm-sidebar-project-count-hidden,
    .xkm-sidebar-project-list-hidden {
      display: none !important;
    }
    .xkm-asset-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 85;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(15, 23, 42, .42);
      backdrop-filter: blur(12px);
    }
    .xkm-asset-modal {
      width: min(1120px, 100%);
      max-height: min(820px, calc(100vh - 48px));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(148, 163, 184, .28);
      border-radius: 22px;
      background: rgba(255, 255, 255, .98);
      color: rgb(15, 23, 42);
      box-shadow: 0 34px 90px -42px rgba(15, 23, 42, .82);
    }
    .dark .xkm-asset-modal {
      border-color: rgba(255, 255, 255, .12);
      background: rgba(15, 23, 42, .98);
      color: rgb(248, 250, 252);
    }
    .xkm-asset-modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 24px 18px;
      border-bottom: 1px solid rgba(226, 232, 240, .9);
    }
    .dark .xkm-asset-modal-header {
      border-bottom-color: rgba(255, 255, 255, .1);
    }
    .xkm-asset-modal-title {
      margin: 0;
      font-size: 22px;
      line-height: 1.25;
      font-weight: 850;
      letter-spacing: 0;
    }
    .xkm-asset-modal-subtitle {
      margin: 7px 0 0;
      color: rgb(100, 116, 139);
      font-size: 14px;
      line-height: 1.6;
    }
    .dark .xkm-asset-modal-subtitle {
      color: rgb(148, 163, 184);
    }
    .xkm-asset-close {
      width: 36px;
      height: 36px;
      border: 1px solid rgba(148, 163, 184, .32);
      border-radius: 12px;
      background: rgba(248, 250, 252, .84);
      color: inherit;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }
    .dark .xkm-asset-close {
      background: rgba(30, 41, 59, .78);
    }
    .xkm-asset-modal-body {
      overflow: auto;
      padding: 22px 24px 24px;
    }
    .xkm-asset-columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .xkm-asset-section {
      min-width: 0;
      border: 1px solid rgba(226, 232, 240, .92);
      border-radius: 18px;
      background: rgba(248, 250, 252, .56);
      padding: 16px;
    }
    .dark .xkm-asset-section {
      border-color: rgba(255, 255, 255, .1);
      background: rgba(30, 41, 59, .42);
    }
    .xkm-asset-section-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 12px;
    }
    .xkm-asset-section h3 {
      margin: 0;
      font-size: 16px;
      line-height: 1.3;
      font-weight: 800;
      letter-spacing: 0;
    }
    .xkm-asset-count {
      color: rgb(100, 116, 139);
      font-size: 13px;
      white-space: nowrap;
    }
    .dark .xkm-asset-count {
      color: rgb(148, 163, 184);
    }
    .xkm-asset-list {
      display: grid;
      gap: 10px;
    }
    .xkm-asset-card {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      border: 1px solid rgba(226, 232, 240, .9);
      border-radius: 14px;
      background: rgba(255, 255, 255, .86);
      padding: 10px;
    }
    .dark .xkm-asset-card {
      border-color: rgba(255, 255, 255, .1);
      background: rgba(15, 23, 42, .48);
    }
    .xkm-asset-thumb {
      width: 76px;
      height: 76px;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(255, 237, 213, .9), rgba(241, 245, 249, .9));
      color: rgb(248, 113, 113);
      font-size: 12px;
      font-weight: 800;
    }
    .dark .xkm-asset-thumb {
      background: linear-gradient(135deg, rgba(51, 65, 85, .92), rgba(15, 23, 42, .9));
      color: rgb(252, 165, 165);
    }
    .xkm-asset-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .xkm-asset-card-main {
      min-width: 0;
    }
    .xkm-asset-card-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.35;
    }
    .xkm-asset-card-meta {
      margin-top: 4px;
      display: flex;
      gap: 8px;
      color: rgb(100, 116, 139);
      font-size: 12px;
      line-height: 1.4;
    }
    .dark .xkm-asset-card-meta {
      color: rgb(148, 163, 184);
    }
    .xkm-asset-card-desc {
      margin-top: 7px;
      color: rgb(71, 85, 105);
      font-size: 12px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .dark .xkm-asset-card-desc {
      color: rgb(203, 213, 225);
    }
    .xkm-asset-action {
      margin-top: 10px;
      min-height: 30px;
      border: 1px solid rgba(255, 127, 80, .32);
      border-radius: 10px;
      background: rgba(255, 247, 237, .86);
      color: rgb(234, 88, 12);
      padding: 0 12px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
    }
    .xkm-asset-action:hover {
      background: rgba(255, 237, 213, .94);
      border-color: rgba(251, 146, 60, .52);
    }
    .xkm-asset-empty {
      min-height: 164px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed rgba(148, 163, 184, .46);
      border-radius: 14px;
      color: rgb(100, 116, 139);
      text-align: center;
      font-size: 14px;
      line-height: 1.7;
      padding: 16px;
    }
    .dark .xkm-asset-empty {
      color: rgb(148, 163, 184);
      border-color: rgba(148, 163, 184, .28);
    }
    .xkm-asset-message {
      margin: 14px 0 0;
      color: rgb(234, 88, 12);
      font-size: 13px;
      line-height: 1.6;
    }
    @media (max-width: 900px) {
      .xkm-asset-columns {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
};

const xkmOpenDb = (name, version, upgrade) =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onupgradeneeded = () => upgrade?.(request.result);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const xkmOpenStateDb = () =>
  xkmOpenDb(XKM_STATE_DB, 1, (db) => {
    if (!db.objectStoreNames.contains(XKM_STATE_STORE)) {
      db.createObjectStore(XKM_STATE_STORE, { keyPath: "key" });
    }
    if (!db.objectStoreNames.contains(XKM_META_STORE)) {
      db.createObjectStore(XKM_META_STORE, { keyPath: "key" });
    }
  });

const xkmOpenAssetDb = () =>
  xkmOpenDb(XKM_ASSET_DB, 1, (db) => {
    if (!db.objectStoreNames.contains(XKM_ASSET_STORE)) {
      db.createObjectStore(XKM_ASSET_STORE);
    }
  });

const xkmStoreGet = (db, store, key) =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const request = tx.objectStore(store).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
    tx.onerror = () => reject(tx.error);
  });

let xkmEnhanceSnapshotCache = {
  key: "",
  expiresAt: 0,
  snapshot: null
};

const xkmReadCachedSnapshot = async (key, loader, cacheMs = XKM_ENHANCE_SNAPSHOT_CACHE_MS) => {
  const now = Date.now();
  if (
    xkmEnhanceSnapshotCache.key === key &&
    xkmEnhanceSnapshotCache.snapshot &&
    xkmEnhanceSnapshotCache.expiresAt > now
  ) {
    return xkmEnhanceSnapshotCache.snapshot;
  }
  const snapshot = await loader();
  if (snapshot) {
    xkmEnhanceSnapshotCache = {
      key,
      snapshot,
      expiresAt: now + cacheMs
    };
  }
  return snapshot;
};

const xkmReadSnapshot = async () => {
  try {
    const response = await fetch(xkmLocalStoreUrl("/api/local-store/state"), {
      cache: "no-store"
    });
    if (response.ok) return await response.json();
  } catch {}
  if (!("indexedDB" in window)) return null;
  const db = await xkmOpenStateDb();
  try {
    return await xkmStoreGet(db, XKM_STATE_STORE, XKM_PRIMARY_KEY);
  } finally {
    db.close();
  }
};

const xkmStoredOpenProjectId = () => {
  try {
    return localStorage.getItem("xkm-open-project-id") || "";
  } catch {
    return "";
  }
};

const xkmWorkspaceIsVisible = () =>
  !!document.querySelector(".workspace-backdrop") && !document.querySelector(".xkm-home");

const xkmReadProjectSnapshot = async (projectId) => {
  if (!projectId) return null;
  try {
    const response = await fetch(
      xkmLocalStoreUrl(`/api/local-store/project/${encodeURIComponent(projectId)}/state`),
      { cache: "no-store" }
    );
    if (response.ok) return await response.json();
  } catch {}
  return null;
};

const xkmReadEnhancementSnapshot = async () => {
  if (xkmWorkspaceIsVisible()) {
    const projectId = xkmStoredOpenProjectId();
    if (projectId) {
      const projectSnapshot = await xkmReadCachedSnapshot(
        `project:${projectId}`,
        () => xkmReadProjectSnapshot(projectId)
      );
      if (projectSnapshot) return projectSnapshot;
    }
  }
  return xkmReadCachedSnapshot("global", xkmReadSnapshot);
};

const xkmWriteSnapshot = async (snapshot) => {
  if (!snapshot?.state || !("indexedDB" in window)) return;
  const db = await xkmOpenStateDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction([XKM_STATE_STORE, XKM_META_STORE], "readwrite");
      const meta = {
        key: "primary-state",
        value: {
          primaryStore: "disk",
          cacheStore: "indexeddb",
          lastSaveRevision: Number(snapshot.saveRevision || 0),
          lastSavedAt: snapshot.updatedAt || new Date().toISOString(),
          migratedAt: new Date().toISOString()
        }
      };
      tx.objectStore(XKM_STATE_STORE).put(snapshot);
      tx.objectStore(XKM_META_STORE).put(meta);
      tx.oncomplete = () => {
        try {
          localStorage.setItem("drama-app-state-meta-v1", JSON.stringify(meta.value));
        } catch {}
        resolve();
      };
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
};

const xkmDeleteAssetBlobs = async (keys) => {
  if (!keys?.length || !("indexedDB" in window)) return;
  const db = await xkmOpenAssetDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(XKM_ASSET_STORE, "readwrite");
      const store = tx.objectStore(XKM_ASSET_STORE);
      keys.forEach((key) => store.delete(key));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
};

const xkmFetchBlobUrl = async (key) => {
  if (!key) return "";
  try {
    if ("indexedDB" in window) {
      const db = await xkmOpenAssetDb();
      try {
        const blob = await xkmStoreGet(db, XKM_ASSET_STORE, key);
        if (blob) return URL.createObjectURL(blob);
      } finally {
        db.close();
      }
    }
  } catch {}
  try {
    const response = await fetch(
      xkmLocalStoreUrl(`/api/local-store/blob/${encodeURIComponent(key)}`),
      { cache: "no-store" }
    );
    if (!response.ok) return "";
    return URL.createObjectURL(await response.blob());
  } catch {
    return "";
  }
};

const xkmProjectSort = (projects, currentProjectId) =>
  [...projects].sort((a, b) =>
    a.id === currentProjectId ? -1 : b.id === currentProjectId ? 1 : 0
  );

const xkmCssUrl = (url) => `url("${String(url || "").replace(/"/g, '\\"')}")`;

const xkmEscapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => (
    {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]
  ));

const xkmConfirmProjectDelete = (project) =>
  new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "xkm-delete-modal-backdrop";
    const projectName = xkmEscapeHtml(project.name || "未命名项目");
    backdrop.innerHTML = `
      <div class="xkm-delete-modal" role="dialog" aria-modal="true" aria-labelledby="xkm-delete-title">
        <h2 id="xkm-delete-title">删除项目「${projectName}」？</h2>
        <p>将删除这个项目的章节、素材、封面和本地持久化目录。此操作不可恢复。</p>
        <div class="xkm-delete-modal-actions">
          <button type="button" class="xkm-delete-cancel">取消</button>
          <button type="button" class="xkm-delete-confirm">删除项目</button>
        </div>
      </div>
    `;
    const finish = (value) => {
      document.removeEventListener("keydown", onKeyDown);
      backdrop.remove();
      resolve(value);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") finish(false);
    };
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) finish(false);
    });
    backdrop.querySelector(".xkm-delete-cancel")?.addEventListener("click", () => finish(false));
    backdrop.querySelector(".xkm-delete-confirm")?.addEventListener("click", () => finish(true));
    document.addEventListener("keydown", onKeyDown);
    document.body.appendChild(backdrop);
    backdrop.querySelector(".xkm-delete-cancel")?.focus();
  });

const xkmDeleteProject = async (project, button) => {
  if (!(await xkmConfirmProjectDelete(project))) return;
  button.disabled = true;
  try {
    const response = await fetch(
      xkmLocalStoreUrl(`/api/local-store/project/${encodeURIComponent(project.id)}`),
      { method: "DELETE" }
    );
    if (!response.ok) throw new Error(await response.text());
    const payload = await response.json();
    await xkmWriteSnapshot(payload.state);
    await xkmDeleteAssetBlobs(payload.deletedBlobKeys || []);
    try {
      if (localStorage.getItem("xkm-open-project-id") === project.id) {
        localStorage.removeItem("xkm-open-project-id");
      }
    } catch {}
    window.location.reload();
  } catch (error) {
    button.disabled = false;
    alert(`删除失败：${error instanceof Error ? error.message : String(error)}`);
  }
};

const xkmPersistSnapshot = async (snapshot) => {
  const nextSnapshot = {
    ...snapshot,
    saveRevision: Number(snapshot?.saveRevision || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  const response = await fetch(xkmLocalStoreUrl("/api/local-store/state"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nextSnapshot)
  });
  if (!response.ok) throw new Error(await response.text());
  await xkmWriteSnapshot(nextSnapshot);
  return nextSnapshot;
};

const xkmAssetTypeLabel = (type) =>
  ({
    character: "角色",
    scene: "场景",
    prop: "道具",
    storyboard: "分镜",
    video: "视频",
    image: "图片"
  }[type] || type || "素材");

const xkmAssetKey = (asset) =>
  [
    asset?.id || "",
    asset?.type || "",
    asset?.name || "",
    asset?.concept || "",
    asset?.lightweightBlobKey || asset?.blobKey || ""
  ].join("::");

const xkmAssetsContain = (assets, asset) => {
  const key = xkmAssetKey(asset);
  return assets.some((item) => xkmAssetKey(item) === key || (asset?.id && item?.id === asset.id));
};

let xkmAssetLibraryMessage = "";

const xkmCurrentProjectFromSnapshot = (snapshot) =>
  snapshot?.state?.projects?.find((project) => project.id === snapshot?.state?.currentProjectId) ||
  snapshot?.state?.projects?.[0] ||
  null;

const xkmAssetThumbKey = (asset) =>
  asset?.lightweightBlobKey || asset?.thumbnailBlobKey || asset?.imageBlobKey || asset?.blobKey || "";

const xkmRenderAssetCard = (asset, actionLabel, onAction) => {
  const card = document.createElement("article");
  card.className = "xkm-asset-card";

  const thumb = document.createElement("div");
  thumb.className = "xkm-asset-thumb";
  thumb.textContent = xkmAssetTypeLabel(asset?.type);
  const blobKey = xkmAssetThumbKey(asset);
  if (blobKey) {
    void xkmFetchBlobUrl(blobKey).then((url) => {
      if (!url || !card.isConnected) return;
      const image = document.createElement("img");
      image.alt = asset?.name || "素材缩略图";
      image.src = url;
      thumb.replaceChildren(image);
    });
  }

  const main = document.createElement("div");
  main.className = "xkm-asset-card-main";

  const title = document.createElement("div");
  title.className = "xkm-asset-card-title";
  title.textContent = asset?.name || asset?.title || asset?.concept || "未命名素材";

  const meta = document.createElement("div");
  meta.className = "xkm-asset-card-meta";
  meta.textContent = xkmAssetTypeLabel(asset?.type);

  const desc = document.createElement("div");
  desc.className = "xkm-asset-card-desc";
  desc.textContent = asset?.concept || asset?.description || asset?.prompt || "暂无素材描述";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "xkm-asset-action";
  button.textContent = actionLabel;
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await onAction(asset);
    } catch (error) {
      xkmAssetLibraryMessage = `操作失败：${error instanceof Error ? error.message : String(error)}`;
      await xkmRenderAssetLibraryModal();
    }
  });

  main.append(title, meta, desc, button);
  card.append(thumb, main);
  return card;
};

const xkmRenderAssetList = (container, assets, emptyText, actionLabel, onAction) => {
  if (!container) return;
  container.replaceChildren();
  if (!assets.length) {
    const empty = document.createElement("div");
    empty.className = "xkm-asset-empty";
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }
  assets.forEach((asset) => container.appendChild(xkmRenderAssetCard(asset, actionLabel, onAction)));
};

const xkmAddProjectAssetToGlobal = async (asset) => {
  const snapshot = await xkmReadSnapshot();
  const project = xkmCurrentProjectFromSnapshot(snapshot);
  if (!snapshot?.state || !project) return;
  const globalAssets = Array.isArray(snapshot.state.globalAssetLibrary)
    ? snapshot.state.globalAssetLibrary
    : [];
  if (xkmAssetsContain(globalAssets, asset)) {
    xkmAssetLibraryMessage = "全局素材库里已经有这个素材。";
    await xkmRenderAssetLibraryModal();
    return;
  }
  const nextAsset = {
    ...asset,
    sourceProjectId: project.id,
    sourceProjectName: project.name || "未命名项目",
    globalizedAt: new Date().toISOString()
  };
  await xkmPersistSnapshot({
    ...snapshot,
    state: {
      ...snapshot.state,
      globalAssetLibrary: [...globalAssets, nextAsset]
    }
  });
  xkmAssetLibraryMessage = "已加入全局素材库。";
  await xkmRenderAssetLibraryModal();
};

const xkmAddGlobalAssetToProject = async (asset) => {
  const snapshot = await xkmReadSnapshot();
  const project = xkmCurrentProjectFromSnapshot(snapshot);
  if (!snapshot?.state || !project) return;
  const projectAssets = Array.isArray(project.assetLibrary) ? project.assetLibrary : [];
  if (xkmAssetsContain(projectAssets, asset)) {
    xkmAssetLibraryMessage = "当前项目里已经有这个素材。";
    await xkmRenderAssetLibraryModal();
    return;
  }
  const nextProject = {
    ...project,
    assetLibrary: [
      ...projectAssets,
      {
        ...asset,
        importedFromGlobalAt: new Date().toISOString()
      }
    ],
    updatedAt: new Date().toISOString()
  };
  await xkmPersistSnapshot({
    ...snapshot,
    state: {
      ...snapshot.state,
      projects: snapshot.state.projects.map((item) =>
        item.id === project.id ? nextProject : item
      )
    }
  });
  xkmAssetLibraryMessage = "已加入当前项目素材。页面刷新后，生成流程会读取到最新项目素材。";
  await xkmRenderAssetLibraryModal();
};

const xkmRenderAssetLibraryModal = async () => {
  const backdrop = document.getElementById("xkm-asset-modal-backdrop");
  if (!backdrop) return;
  const snapshot = await xkmReadSnapshot();
  const project = xkmCurrentProjectFromSnapshot(snapshot);
  const globalAssets = Array.isArray(snapshot?.state?.globalAssetLibrary)
    ? snapshot.state.globalAssetLibrary
    : [];
  const projectAssets = Array.isArray(project?.assetLibrary) ? project.assetLibrary : [];
  const projectName = project?.name || "当前项目";

  backdrop.innerHTML = `
    <div class="xkm-asset-modal" role="dialog" aria-modal="true" aria-labelledby="xkm-asset-title">
      <div class="xkm-asset-modal-header">
        <div>
          <h2 class="xkm-asset-modal-title" id="xkm-asset-title">资产库</h2>
          <p class="xkm-asset-modal-subtitle">全局素材与「${xkmEscapeHtml(projectName)}」项目素材分开管理，可按需互相加入。</p>
        </div>
        <button type="button" class="xkm-asset-close" aria-label="关闭资产库">×</button>
      </div>
      <div class="xkm-asset-modal-body">
        <div class="xkm-asset-columns">
          <section class="xkm-asset-section">
            <div class="xkm-asset-section-head">
              <h3>全局素材</h3>
              <span class="xkm-asset-count">${globalAssets.length} 个</span>
            </div>
            <div class="xkm-asset-list" data-xkm-global-assets></div>
          </section>
          <section class="xkm-asset-section">
            <div class="xkm-asset-section-head">
              <h3>当前项目素材</h3>
              <span class="xkm-asset-count">${projectAssets.length} 个</span>
            </div>
            <div class="xkm-asset-list" data-xkm-project-assets></div>
          </section>
        </div>
        ${xkmAssetLibraryMessage ? `<p class="xkm-asset-message">${xkmEscapeHtml(xkmAssetLibraryMessage)}</p>` : ""}
      </div>
    </div>
  `;
  backdrop.querySelector(".xkm-asset-close")?.addEventListener("click", xkmCloseAssetLibraryModal);
  xkmRenderAssetList(
    backdrop.querySelector("[data-xkm-global-assets]"),
    globalAssets,
    "暂无全局素材。可以从当前项目素材中加入常用角色、场景或道具。",
    "加入当前项目",
    xkmAddGlobalAssetToProject
  );
  xkmRenderAssetList(
    backdrop.querySelector("[data-xkm-project-assets]"),
    projectAssets,
    "当前项目暂无素材。生成角色、场景或道具后会出现在这里。",
    "加入全局素材",
    xkmAddProjectAssetToGlobal
  );
};

const xkmOpenAssetLibraryModal = async () => {
  let backdrop = document.getElementById("xkm-asset-modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "xkm-asset-modal-backdrop";
    backdrop.className = "xkm-asset-modal-backdrop";
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) xkmCloseAssetLibraryModal();
    });
    document.body.appendChild(backdrop);
  }
  xkmAssetLibraryMessage = "";
  await xkmRenderAssetLibraryModal();
};

const xkmCloseAssetLibraryModal = () => {
  document.getElementById("xkm-asset-modal-backdrop")?.remove();
};

const xkmUseDefaultCover = (cover) => {
  const fallback = cover?.querySelector(".xkm-project-cover-fallback");
  if (!fallback) return;
  fallback.dataset.xkmDefaultCover = "1";
  fallback.classList.add("xkm-default-cover-shell");
};

const xkmTrashIconSvg = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3 6h18"></path>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
    <path d="M10 11v6"></path>
    <path d="M14 11v6"></path>
  </svg>
`;

const xkmOverlayRoot = () => {
  let root = document.getElementById("xkm-project-overlay-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "xkm-project-overlay-root";
    document.body.appendChild(root);
  }
  return root;
};

const xkmProjectDeleteButtonPosition = (card) => {
  const rect = card.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0 || rect.bottom < 0 || rect.top > window.innerHeight) {
    return null;
  }
  return {
    top: Math.max(8, rect.top + 18),
    left: Math.min(window.innerWidth - 44, rect.right - 52)
  };
};

const xkmRenderProjectDeleteButtons = (pairs) => {
  const root = xkmOverlayRoot();
  root.replaceChildren();
  pairs.forEach(({ card, project }) => {
    const position = xkmProjectDeleteButtonPosition(card);
    if (!position) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "xkm-card-delete";
    button.title = "删除项目";
    button.setAttribute("aria-label", `删除项目 ${project.name || ""}`.trim());
    button.style.top = `${position.top}px`;
    button.style.left = `${position.left}px`;
    button.innerHTML = xkmTrashIconSvg;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      xkmDeleteProject(project, button);
    });
    root.appendChild(button);
  });
};

const xkmEnhanceHomeCards = async (snapshot) => {
  const projects = snapshot?.state?.projects;
  if (!Array.isArray(projects) || !document.querySelector(".xkm-home")) {
    xkmOverlayRoot().replaceChildren();
    return;
  }
  const sortedProjects = xkmProjectSort(projects, snapshot.state.currentProjectId);
  const cards = [...document.querySelectorAll(".xkm-project-card")];
  const pairs = [];
  cards.forEach((card, index) => {
    const project = sortedProjects[index];
    if (!project) return;
    card.dataset.xkmProjectId = project.id;
    xkmUseDefaultCover(card.querySelector(".xkm-project-cover"));
    pairs.push({ card, project });
  });
  xkmRenderProjectDeleteButtons(pairs);
};

const xkmEnhanceSidebarCover = async (snapshot) => {
  const project = snapshot?.state?.projects?.find(
    (item) => item.id === snapshot?.state?.currentProjectId
  );
  const panel = [...document.querySelectorAll("aside .sidebar-panel")].find((item) =>
    item.textContent?.includes("当前工作区")
  );
  const shell = panel?.querySelector(".brand-mark-shell");
  const signature = `${project?.id || "default"}:${project?.coverBlobKey || "default"}`;
  if (!shell || shell.dataset.xkmProjectCover === signature) return;
  const coverUrl = project?.coverBlobKey ? await xkmFetchBlobUrl(project.coverBlobKey) : "";
  shell.dataset.xkmProjectCover = signature;
  shell.classList.add("xkm-sidebar-cover-shell");
  shell.style.setProperty("--xkm-sidebar-cover", xkmCssUrl(coverUrl || XKM_DEFAULT_COVER));
};

const xkmFindSmallestTextElement = (root, matcher) =>
  [...root.querySelectorAll("*")]
    .filter((element) => matcher(element.textContent?.replace(/\s+/g, "") || ""))
    .sort((a, b) => a.querySelectorAll("*").length - b.querySelectorAll("*").length)[0] || null;

const xkmHideProjectSidebarBlocks = () => {
  const aside = document.querySelector("aside");
  if (!aside) return;

  const workspacePanel = [...aside.querySelectorAll(".sidebar-panel")].find((panel) =>
    panel.textContent?.includes("当前工作区")
  );
  if (workspacePanel) {
    const projectCount = xkmFindSmallestTextElement(workspacePanel, (text) =>
      /^项目\d+$/.test(text)
    );
    projectCount?.classList.add("xkm-sidebar-project-count-hidden");
  }

  const projectListPanel = [...aside.querySelectorAll(".sidebar-panel")].find((panel) => {
    const text = panel.textContent?.replace(/\s+/g, "") || "";
    return text.startsWith("项目") && text.includes("新建") && text.includes("章");
  });
  projectListPanel?.classList.add("xkm-sidebar-project-list-hidden");
};

const xkmEnhanceAssetLibraryEntry = () => {
  const aside = document.querySelector("aside");
  if (!aside) return;
  const label = xkmFindSmallestTextElement(aside, (text) =>
    text.startsWith("资产库") || text.includes("资产库查看全局素材")
  );
  const entry =
    label?.closest("button") ||
    label?.closest("[role='button']") ||
    label?.closest(".sidebar-panel") ||
    label?.parentElement?.parentElement ||
    label;
  if (!entry || entry.dataset.xkmAssetLibraryEntry === "1") return;
  entry.dataset.xkmAssetLibraryEntry = "1";
  entry.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      void xkmOpenAssetLibraryModal();
    },
    true
  );
};

document.addEventListener(
  "click",
  (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const entry = target.closest("[data-xkm-asset-library-entry='1']");
    if (!entry) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    void xkmOpenAssetLibraryModal();
  },
  true
);

let xkmEnhanceScheduled = false;
const xkmScheduleEnhance = () => {
  if (xkmEnhanceScheduled) return;
  xkmEnhanceScheduled = true;
  window.requestAnimationFrame(async () => {
    xkmEnhanceScheduled = false;
    const snapshot = await xkmReadEnhancementSnapshot();
    await xkmEnhanceHomeCards(snapshot);
    xkmHideProjectSidebarBlocks();
    xkmEnhanceAssetLibraryEntry();
    void xkmEnhanceSidebarCover(snapshot);
  });
};

xkmInjectProjectRuntimeStyles();
xkmScheduleEnhance();
new MutationObserver(xkmScheduleEnhance).observe(document.getElementById("root") || document.body, {
  childList: true,
  subtree: true
});
window.addEventListener("resize", xkmScheduleEnhance);
window.addEventListener("scroll", xkmScheduleEnhance, true);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.getElementById("xkm-asset-modal-backdrop")) {
    xkmCloseAssetLibraryModal();
  }
});
