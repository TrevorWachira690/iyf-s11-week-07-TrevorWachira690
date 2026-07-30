// recent-searches.js
(() => {
    const STORAGE_KEY = "recent_searches_v1";
    const MAX_ITEMS = 5;

    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");
    const dropdown = document.getElementById("historyDropdown");
    const listEl = document.getElementById("historyList");
    const results = document.getElementById("results");
    const clearBtn = document.getElementById("clearHistoryBtn");
    const searchGroup = document.getElementById("searchGroup");

    function loadHistory() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function saveHistory(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    function addSearch(term) {
        const q = term.trim();
        if (!q) return;
        let items = loadHistory();
        // remove duplicates (case-insensitive)
        items = items.filter(i => i.toLowerCase() !== q.toLowerCase());
        items.unshift(q); // most recent first
        items = items.slice(0, MAX_ITEMS);
        saveHistory(items);
        renderHistory();
    }

    function removeAtIndex(idx) {
        const items = loadHistory();
        items.splice(idx, 1);
        saveHistory(items);
        renderHistory();
    }

    function clearHistory() {
        localStorage.removeItem(STORAGE_KEY);
        renderHistory();
    }

    function renderHistory() {
        const items = loadHistory();
        listEl.innerHTML = "";
        if (!items.length) {
            dropdown.hidden = true;
            return;
        }
        dropdown.hidden = false;
        items.forEach((item, i) => {
            const li = document.createElement("li");
            li.className = "history-item";
            li.setAttribute("role", "listitem");

            const span = document.createElement("span");
            span.className = "history-text";
            span.textContent = item;
            span.title = item;
            span.addEventListener("click", () => {
                performSearch(item);
                hideDropdown();
            });

            const removeBtn = document.createElement("button");
            removeBtn.className = "remove-btn";
            removeBtn.title = "Remove";
            removeBtn.textContent = "✕";
            removeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                removeAtIndex(i);
            });

            li.appendChild(span);
            li.appendChild(removeBtn);
            listEl.appendChild(li);
        });
    }

    function performSearch(q) {
        const query = q !== undefined ? q : input.value.trim();
        if (!query) {
            results.innerHTML = `<em>Please enter a search term.</em>`;
            return;
        }

        // Add to history
        addSearch(query);

        // Simulated search results — replace this with real search logic
        results.innerHTML = `
            <strong>Results for:</strong> <em>${escapeHtml(query)}</em>
            <div style="margin-top:10px;color:var(--muted)">This demo simulates search results. Replace performSearch() with real API calls as needed.</div>
        `;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
    }

    function showDropdown() {
        const items = loadHistory();
        if (items.length) dropdown.hidden = false;
    }
    function hideDropdown() {
        dropdown.hidden = true;
    }

    // Events
    btn.addEventListener("click", () => performSearch());
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
            hideDropdown();
        } else if (e.key === "Escape") {
            hideDropdown();
            input.blur();
        }
    });

    input.addEventListener("focus", () => renderHistory());
    input.addEventListener("input", () => {
        // If input matches nothing, keep dropdown visible but user can type
        renderHistory();
    });

    clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        clearHistory();
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!searchGroup.contains(e.target)) {
            hideDropdown();
        }
    });

    // Initialize
    renderHistory();

    // Expose for debugging (optional)
    window.recentSearches = {
        loadHistory,
        saveHistory,
        addSearch,
        clearHistory
    };
})();