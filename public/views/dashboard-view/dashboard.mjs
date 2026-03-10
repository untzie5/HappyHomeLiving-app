import { loadUser, clearUser } from "/components/session.mjs";
import { apiRequest } from "/components/api.mjs";

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

  renderCalendar(app);
  wireTodoForm(app);
  await renderTodos(app);
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

function wireTodoForm(app) {
  const form = app.querySelector("#todo-form");
  const errorEl = app.querySelector("#todo-error");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const text = app.querySelector("#todo-input")?.value?.trim() ?? "";
    const repeatWeekly = app.querySelector("#repeatWeekly")?.checked ?? false;
    const removeWhenDone = app.querySelector("#removeWhenDone")?.checked ?? false;

    if (!text) {
      errorEl.textContent = "Task text is required";
      errorEl.hidden = false;
      return;
    }

    try {
      await apiRequest("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          repeatWeekly,
          removeWhenDone,
        }),
      });

      form.reset();
      await renderTodos(app);
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  });
}

async function renderTodos(app) {
  const list = app.querySelector("#todo-list");
  const errorEl = app.querySelector("#todo-error");
  if (!list) return;

  errorEl.hidden = true;

  try {
    const data = await apiRequest("/api/todos");
    const todos = data.todos ?? [];

    if (todos.length === 0) {
      list.innerHTML = `<li class="todo-empty">No tasks yet</li>`;
      return;
    }

    list.innerHTML = "";

    for (const todo of todos) {
      const li = document.createElement("li");
      li.className = "todo-item";

      const left = document.createElement("div");
      left.className = "todo-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(todo.done);

      checkbox.addEventListener("change", async () => {
        try {
          await apiRequest(`/api/todos/${todo.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done: checkbox.checked }),
          });

          await renderTodos(app);
        } catch (err) {
          errorEl.textContent = err.message;
          errorEl.hidden = false;
        }
      });

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      if (todo.done) {
        text.classList.add("done");
      }

      left.append(checkbox, text);

      const actions = document.createElement("div");
      actions.className = "todo-actions";

      if (todo.repeatWeekly) {
        const badge = document.createElement("span");
        badge.className = "todo-badge";
        badge.textContent = "Weekly";
        actions.append(badge);
      }

      if (todo.removeWhenDone) {
        const badge = document.createElement("span");
        badge.className = "todo-badge";
        badge.textContent = "Auto-remove";
        actions.append(badge);
      }

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "todo-delete-btn";
      delBtn.textContent = "Delete";

      delBtn.addEventListener("click", async () => {
        try {
          await apiRequest(`/api/todos/${todo.id}`, {
            method: "DELETE",
          });

          await renderTodos(app);
        } catch (err) {
          errorEl.textContent = err.message;
          errorEl.hidden = false;
        }
      });

      actions.append(delBtn);

      li.append(left, actions);
      list.append(li);
    }
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
}