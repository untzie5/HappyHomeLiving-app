import { loadUser, clearUser } from "/components/session.mjs";
import "/components/delete-user.mjs";

export async function mount({ app, navigate }) {
  const user = loadUser();
  if (!user) return navigate("/login");

  app.querySelector("#usernameText").textContent = user.username;

  app.querySelector("#edit-user-btn")?.addEventListener("click", () => {
    navigate("/edit-user");
  });

  app.querySelector("#logout-btn")?.addEventListener("click", () => {
    clearUser();
    navigate("/login");
  });

  const del = app.querySelector("#deleteUser");
  if (del) {
    del.user = user;

    del.addEventListener("user-deleted", () => {
      clearUser();
      navigate("/login");
    });
  }

  renderCalendar(app);
}

function renderCalendar(app) {
  const container = app.querySelector("#calendar-container");
  if (!container) return;

  const now = new Date();
  const locale = localStorage.getItem("language") || "en";

  const monthName = now.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  const weekdayNames = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(2024, 0, 7 + i);
    weekdayNames.push(day.toLocaleDateString(locale, { weekday: "short" }));
  }

  let html = `<div class="calendar">`;
  html += `<h3 class="calendar-month">${monthName}</h3>`;
  html += `<div class="calendar-grid">`;

  for (const dayName of weekdayNames) {
    html += `<div class="calendar-cell calendar-weekday">${dayName}</div>`;
  }

  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < adjustedFirstDay; i++) {
    html += `<div class="calendar-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === now.getDate();
    html += `<div class="calendar-cell ${isToday ? "today" : ""}">${day}</div>`;
  }

  html += `</div></div>`;
  container.innerHTML = html;
}