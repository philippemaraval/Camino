function getBadgeDefinitions(hasReachedGlobalRank) {
  return [
    {
      id: "first_game",
      emoji: "🎮",
      name: "Première Partie",
      desc: "Terminer une session",
      check: (profile) => (parseInt(profile.overall?.total_games) || 0) >= 1,
    },
    {
      id: "games_10",
      emoji: "🔟",
      name: "25 Parties",
      desc: "Jouer 25 sessions",
      check: (profile) => (parseInt(profile.overall?.total_games) || 0) >= 25,
    },
    {
      id: "games_50",
      emoji: "💯",
      name: "Habitué",
      desc: "Jouer 100 sessions",
      check: (profile) => (parseInt(profile.overall?.total_games) || 0) >= 100,
    },
    {
      id: "games_100",
      emoji: "💎",
      name: "Vétéran",
      desc: "Jouer 250 sessions",
      check: (profile) => (parseInt(profile.overall?.total_games) || 0) >= 250,
    },
    {
      id: "minot",
      emoji: "🧒",
      name: "Minot",
      desc: "Atteindre Minot dans tous les modes et toutes les zones",
      check: (profile) => hasReachedGlobalRank(profile, "M"),
    },
    {
      id: "habitue",
      emoji: "⚓",
      name: "Habitué du Vieux-Port",
      desc: "Atteindre Habitué dans tous les modes et toutes les zones",
      check: (profile) => hasReachedGlobalRank(profile, "H"),
    },
    {
      id: "vrai",
      emoji: "💪",
      name: "Vrai Marseillais",
      desc: "Atteindre Vrai Marseillais dans tous les modes et toutes les zones",
      check: (profile) => hasReachedGlobalRank(profile, "V"),
    },
    {
      id: "maire",
      emoji: "🏛️",
      name: "Maire de la Ville",
      desc: "Atteindre Maire dans tous les modes et toutes les zones",
      check: (profile) => hasReachedGlobalRank(profile, "MV"),
    },
    {
      id: "celebres",
      emoji: "⭐",
      name: "Étoile de la Caneb",
      desc: "Jouer en Rues Célèbres",
      check: (profile) => (profile.modes || []).some((modeEntry) => modeEntry.mode === "rues-celebres"),
    },
    {
      id: "ville",
      emoji: "🏙️",
      name: "Explorateur",
      desc: "Jouer en Ville Entière",
      check: (profile) => (profile.modes || []).some((modeEntry) => modeEntry.mode === "ville"),
    },
    {
      id: "monuments",
      emoji: "🗿",
      name: "Touriste Culturel",
      desc: "Jouer en mode Monuments",
      check: (profile) => (profile.modes || []).some((modeEntry) => modeEntry.mode === "monuments"),
    },
    {
      id: "all_zones",
      emoji: "🧭",
      name: "Globe-trotter",
      desc: "Jouer dans chaque zone",
      check: (profile) => {
        const playedModes = new Set((profile.modes || []).map((modeEntry) => modeEntry.mode));
        return [
          "ville",
          "quartier",
          "rues-principales",
          "rues-celebres",
          "monuments",
        ].every((mode) => playedModes.has(mode));
      },
    },
    {
      id: "daily_first",
      emoji: "📅",
      name: "Premier Daily",
      desc: "Réussir un Daily Challenge",
      check: (profile) => (parseInt(profile.daily?.successes) || 0) >= 1,
    },
    {
      id: "daily_5",
      emoji: "🔥",
      name: "Série de 10",
      desc: "10 Daily Challenges réussis d'affilée",
      check: (profile) => (parseInt(profile.daily?.max_streak) || 0) >= 10,
    },
    {
      id: "daily_10",
      emoji: "⚡",
      name: "Série de 20",
      desc: "20 Daily Challenges réussis d'affilée",
      check: (profile) => (parseInt(profile.daily?.max_streak) || 0) >= 20,
    },
    {
      id: "daily_30",
      emoji: "🏆",
      name: "Champion du Mois",
      desc: "50 Daily Challenges réussis d'affilée",
      check: (profile) => (parseInt(profile.daily?.max_streak) || 0) >= 50,
    },
    {
      id: "perfect",
      emoji: "🎯",
      name: "Sans Faute",
      desc: "Score de 100 dans une session",
      check: (profile) => (parseFloat(profile.overall?.best_score) || 0) >= 100,
    },
    {
      id: "multi_mode",
      emoji: "🌟",
      name: "Polyvalent",
      desc: "Jouer dans 3 modes de jeu différents",
      check: (profile) => new Set((profile.modes || []).map((modeEntry) => modeEntry.game_type)).size >= 3,
    },
  ];
}

export function computeBadgesRuntime(profile, hasReachedGlobalRank) {
  return getBadgeDefinitions(hasReachedGlobalRank).map((definition) => ({
    ...definition,
    unlocked: definition.check(profile),
  }));
}

export function renderUserStickerRuntime(currentUser) {
  const sticker = document.getElementById("user-sticker");
  const loginHint = document.getElementById("login-hint");
  if (!sticker) {
    return;
  }

  if (currentUser && currentUser.username) {
    const avatarValue = currentUser.avatar || "👤";
    const avatarEl = document.createElement("span");
    const nameEl = document.createElement("span");
    avatarEl.className = "user-sticker-avatar";
    avatarEl.textContent = avatarValue;
    nameEl.className = "user-sticker-name";
    nameEl.textContent = currentUser.username;
    sticker.replaceChildren(avatarEl, nameEl);
    sticker.style.display = "inline-flex";
    if (loginHint) {
      loginHint.style.display = "none";
    }
    return;
  }

  sticker.textContent = "";
  sticker.style.display = "none";
  if (loginHint) {
    loginHint.style.display = "";
  }
}

export function updateUserUIRuntime({
  currentUser,
  renderUserSticker,
  loadProfile,
}) {
  const currentUserLabel = document.getElementById("current-user-label");
  const authBlock = document.querySelector(".auth-block");
  const logoutBtn = document.getElementById("logout-btn");
  const dailyModeBtn = document.getElementById("daily-mode-btn");

  if (currentUser && currentUser.username) {
    if (currentUserLabel) {
      currentUserLabel.textContent = `Connecté en tant que ${currentUser.username}`;
    }
    renderUserSticker();

    if (authBlock) {
      authBlock.querySelectorAll("input").forEach((input) => {
        input.style.display = "none";
      });
      authBlock
        .querySelectorAll("button:not(#logout-btn)")
        .forEach((button) => {
          button.style.display = "none";
        });
    }

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
    }
    if (dailyModeBtn) {
      dailyModeBtn.style.display = "inline-flex";
    }

    const profilePanel = document.getElementById("profile-panel");
    if (profilePanel) {
      profilePanel.style.display = "block";
    }
    loadProfile();
    return;
  }

  if (currentUserLabel) {
    currentUserLabel.textContent = "Non connecté.";
  }
  renderUserSticker();

  if (authBlock) {
    authBlock.querySelectorAll("input").forEach((input) => {
      input.style.display = "";
    });
    authBlock
      .querySelectorAll("button:not(#logout-btn)")
      .forEach((button) => {
        button.style.display = "";
      });
  }

  if (logoutBtn) {
    logoutBtn.style.display = "none";
  }
  if (dailyModeBtn) {
    dailyModeBtn.style.display = "none";
  }

  const profilePanel = document.getElementById("profile-panel");
  if (profilePanel) {
    profilePanel.style.display = "none";
  }
}

export function loadProfileRuntime({
  currentUser,
  apiUrl,
  saveCurrentUserToStorage,
  renderUserSticker,
  getGlobalRankMeta,
  getPlayerTitle,
  zoneLabels,
  gameLabels,
  hasReachedGlobalRank,
  initAvatarSelector,
}) {
  if (!currentUser || !currentUser.token) {
    return;
  }

  const profileContent = document.getElementById("profile-content");
  if (!profileContent) {
    return;
  }

  profileContent.innerHTML =
    '<div class="skeleton skeleton-avatar"></div><div class="skeleton skeleton-line skeleton-line--60"></div><div class="skeleton skeleton-block"></div><div class="skeleton skeleton-line skeleton-line--80"></div>';

  fetch(`${apiUrl}/api/profile`, {
    headers: { Authorization: `Bearer ${currentUser.token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((profile) => {
      if (currentUser) {
        const nextAvatar = profile.avatar || "👤";
        const nextUsername = profile.username || currentUser.username;
        const changed = currentUser.avatar !== nextAvatar || currentUser.username !== nextUsername;

        currentUser.avatar = nextAvatar;
        currentUser.username = nextUsername;

        if (changed) {
          saveCurrentUserToStorage(currentUser);
        }
        renderUserSticker();
      }

      const bestScore = parseFloat(profile.overall?.best_score) || 0;
      const globalRankMeta = getGlobalRankMeta(profile);
      const globalTitle = globalRankMeta.title;
      const totalGames = parseInt(profile.overall?.total_games) || 0;
      const averageScore = parseFloat(profile.overall?.avg_score) || 0;
      const dailyTotalDays = parseInt(profile.daily?.total_days) || 0;
      const dailySuccesses = parseInt(profile.daily?.successes) || 0;
      const dailyAverageAttempts = parseFloat(profile.daily?.avg_attempts) || 0;
      const memberSince = profile.memberSince
        ? new Date(profile.memberSince).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        : "—";

      let html = `
        <div class="profile-header">
          <div class="profile-avatar">
            ${profile.avatar || "👤"}
            <button type="button" class="edit-avatar-badge" id="btn-edit-avatar" title="Changer d'avatar" aria-label="Changer d'avatar">✏️</button>
          </div>
          <div class="profile-info">
            <div class="profile-name">${profile.username}</div>
            <div class="profile-title">${globalTitle}</div>
          </div>
        </div>

        <div class="profile-stats-grid">
          <div class="profile-stat">
            <span class="profile-stat-value">${totalGames}</span>
            <span class="profile-stat-label">Parties</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">${bestScore.toFixed(1)}</span>
            <span class="profile-stat-label">Meilleur</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">${averageScore}</span>
            <span class="profile-stat-label">Moyenne</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat-value">${dailySuccesses}/${dailyTotalDays}</span>
            <span class="profile-stat-label">Daily ✅</span>
          </div>
        </div>`;

      if (profile.modes && profile.modes.length > 0) {
        html += '<div class="profile-modes-title">Détail par mode</div>';
        html += '<div class="profile-modes">';
        profile.modes.forEach((modeEntry) => {
          const zoneLabel = zoneLabels[modeEntry.mode] || modeEntry.mode;
          const gameLabel = gameLabels[modeEntry.game_type] || modeEntry.game_type;
          const highScore = parseFloat(modeEntry.high_score) || 0;
          const scoreLabel =
            modeEntry.game_type === "classique"
              ? highScore.toFixed(1)
              : String(Math.round(highScore));
          const title = getPlayerTitle(
            highScore,
            modeEntry.mode,
            modeEntry.game_type,
            modeEntry.best_items_total || 0,
            modeEntry.best_items_correct || 0,
          );
          html += `
            <div class="profile-mode-row">
              <div class="profile-mode-name">${zoneLabel} — ${gameLabel}</div>
              <div class="profile-mode-details">
                <span>🏆 ${scoreLabel}</span>
                <span>📊 Ø${parseFloat(modeEntry.avg_score).toFixed(1)}</span>
                <span>🎮 ${modeEntry.games_played}</span>
              </div>
              <div class="profile-mode-title">${title}</div>
            </div>`;
        });
        html += "</div>";
      }

      if (dailyTotalDays > 0) {
        html += `
          <div class="profile-daily-summary">
            <span>📅 Daily : ${dailyAverageAttempts} essais en moyenne</span>
            ${profile.daily?.current_streak > 0 ? `<br><span class="profile-daily-current-streak">🔥 Série actuelle : ${profile.daily.current_streak}</span>` : ""}
            ${profile.daily?.max_streak > 0 ? `<br><span class="profile-daily-best-streak">🏆 Meilleure série : ${profile.daily.max_streak}</span>` : ""}
          </div>`;
      }

      const badges = computeBadgesRuntime(profile, hasReachedGlobalRank);
      const unlocked = badges.filter((badge) => badge.unlocked);
      const locked = badges.filter((badge) => !badge.unlocked);

      html += `<div class="profile-badges-title">Succès (${unlocked.length}/${badges.length})</div>`;
      html += '<div class="profile-badges-grid">';

      unlocked.forEach((badge) => {
        html += `<div class="profile-badge unlocked" tabindex="0" title="${badge.name}\n✅ ${badge.desc}" data-tooltip="${badge.name}\n✅ ${badge.desc}" aria-label="${badge.name} débloqué. ${badge.desc}">
          <span class="badge-emoji">${badge.emoji}</span>
          <span class="badge-name">${badge.name}</span>
        </div>`;
      });

      locked.forEach((badge) => {
        html += `<div class="profile-badge locked" tabindex="0" title="${badge.name}\n🔒 ${badge.desc}" data-tooltip="${badge.name}\n🔒 ${badge.desc}" aria-label="${badge.name} verrouillé. ${badge.desc}">
          <span class="badge-emoji">🔒</span>
          <span class="badge-name">${badge.name}</span>
        </div>`;
      });

      html += "</div>";
      html += `<div class="profile-member-since">Membre depuis le ${memberSince}</div>`;

      profileContent.innerHTML = html;
      initAvatarSelector(profile.avatar || "👤", globalRankMeta.level);
    })
    .catch((error) => {
      console.warn("Profile error:", error.message);
      profileContent.innerHTML = '<p class="profile-unavailable">Profil indisponible.</p>';
    });
}

export function initAvatarSelectorRuntime({
  currentAvatar,
  globalRankLevel,
  renderAvatarGrid,
}) {
  const btnEdit = document.getElementById("btn-edit-avatar");
  const modal = document.getElementById("avatar-selector-modal");
  const closeBtn = document.getElementById("avatar-modal-close");
  const grid = document.getElementById("avatar-grid");
  const profileStatsGrid = document.querySelector(".profile-stats-grid");

  if (!btnEdit || !modal || !grid || !closeBtn) {
    return;
  }

  if (profileStatsGrid && profileStatsGrid.parentNode) {
    profileStatsGrid.parentNode.insertBefore(modal, profileStatsGrid.nextSibling);
  }

  btnEdit.addEventListener("click", () => {
    modal.style.display = "block";
    renderAvatarGrid(currentAvatar, globalRankLevel);
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

export function renderAvatarGridRuntime({
  currentAvatar,
  globalRankLevel,
  avatarUnlocks,
  titleNames,
  currentUser,
  getGlobalRankLevelForTitleIndex,
  apiUrl,
  saveCurrentUserToStorage,
  updateUserUI,
  showMessage,
}) {
  const grid = document.getElementById("avatar-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  avatarUnlocks.forEach((avatarDef) => {
    let requiredLevel = 0;
    let isUnlocked = false;

    if (typeof avatarDef.check === "function") {
      isUnlocked = avatarDef.check(currentUser);
    } else {
      requiredLevel = getGlobalRankLevelForTitleIndex(avatarDef.reqTitleIdx);
      isUnlocked = globalRankLevel >= requiredLevel;
    }

    const item = document.createElement("button");
    item.type = "button";
    item.className = "avatar-item";
    item.textContent = avatarDef.emoji;

    if (avatarDef.emoji === currentAvatar) {
      item.classList.add("selected");
    }

    if (typeof avatarDef.check === "function") {
      if (!isUnlocked) {
        item.classList.add("locked");
        item.title = `Titre spécifique requis:\n🔒 ${avatarDef.name}\n(${avatarDef.desc})`;
        item.setAttribute("aria-disabled", "true");
      } else {
        item.title = `Débloqué:\n✅ ${avatarDef.name}\n- ${avatarDef.desc}`;
      }
    } else {
      const requiredTitle = titleNames[avatarDef.reqTitleIdx];
      if (!isUnlocked) {
        item.classList.add("locked");
        item.title = `Titre global requis:\n🔒 ${requiredTitle}\n(à atteindre dans tous les modes et zones)`;
        item.setAttribute("aria-disabled", "true");
      } else {
        item.title = `Débloqué:\n✅ ${requiredTitle} (global)`;
        if (avatarDef.desc) {
          item.title += ` - ${avatarDef.desc}`;
        }
      }
    }

    item.setAttribute("data-tooltip", item.title || "");

    if (isUnlocked) {
      item.addEventListener("click", () => {
        fetch(`${apiUrl}/api/profile/avatar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({ avatar: avatarDef.emoji }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur sauvegarde avatar");
            }
            return response.json();
          })
          .then(() => {
            currentUser.avatar = avatarDef.emoji;
            saveCurrentUserToStorage(currentUser);
            updateUserUI();
            const modal = document.getElementById("avatar-selector-modal");
            if (modal) {
              modal.style.display = "none";
            }
            showMessage("Avatar mis à jour !", "success");
          })
          .catch((error) => {
            console.error(error);
            showMessage("Erreur lors de la sauvegarde de l'avatar", "error");
          });
      });
    }

    grid.appendChild(item);
  });
}

export function sendScoreToServerRuntime({
  isDailyMode,
  currentUser,
  apiUrl,
  payload,
  loadAllLeaderboards,
}) {
  if (isDailyMode || !currentUser || !currentUser.token) {
    return;
  }

  try {
    fetch(`${apiUrl}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({
        mode: payload.zoneMode,
        gameType: payload.gameMode,
        score: payload.score,
        itemsCorrect: payload.itemsCorrect,
        itemsTotal: payload.itemsTotal,
        timeSec: payload.totalTimeSec,
        quartierName: payload.quartierName,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        loadAllLeaderboards();
      })
      .catch((error) => {
        console.error("Erreur envoi score :", error);
      });
  } catch (error) {
    console.error("Erreur envoi score (synchrone) :", error);
  }
}
