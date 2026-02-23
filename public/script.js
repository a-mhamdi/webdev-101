/**
 * Show a toast notification for 3 seconds.
 * @param {string} msg - The text to display.
 * @param {string} [type='ok'] - The type of notification, one of 'ok', 'err'.
 */
function showToast(msg, type = 'ok') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `show ${type}`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.className = ''; }, 3000);
}

/**
 * Returns an HTML string representing a score pill.
 * The score pill is a colored indicator of the score, with green for high scores (15+), yellow for mid scores (10-14), and red for low scores (0-9).
 * @param {number|string} score - The score to display.
 * @returns {string} An HTML string representing the score pill.
 */
function scorePill(score) {
    const s = Number(score);
    const cls = s >= 15 ? 'score-high' : s >= 10 ? 'score-mid' : 'score-low';
    return `<span class="score-pill ${cls}">${score}</span>`;
}

/**
 * Renders the student table from an array of student objects.
 * If the array is empty or null, displays a "no students found" message.
 * @param {Student[]} students - The array of student objects to render.
 */
function renderTable(students) {
    const tbody = document.getElementById('studentTable');
    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No students found.</td></tr>';
        return;
    }
    tbody.innerHTML = students.map(s => `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.specialty}</td>
          <td>${scorePill(s.score)}</td>
        </tr>
      `).join('');
}

/* ── CREATE ───────────────────────────────────────── */
async function createStudent(e) {
    e.preventDefault();
    const body = {
        id: document.getElementById('create-id').value.trim(),
        name: document.getElementById('create-name').value.trim(),
        specialty: document.getElementById('create-specialty').value.trim(),
        score: document.getElementById('create-score').value,
    };
    try {
        const res = await fetch('/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        showToast(`✓ Student ${body.id} added`, 'ok');
        document.getElementById('createForm').reset();
    } catch (err) {
        showToast(`✗ ${err.message}`, 'err');
    }
}

/* ── READ ─────────────────────────────────────────── */
async function getStudents(e) {
    e.preventDefault();
    const id = document.getElementById('get-id').value.trim();
    const url = id ? `/students/${id}` : '/students';
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        renderTable(Array.isArray(data) ? data : [data]);
    } catch (err) {
        showToast(`✗ ${err.message}`, 'err');
        renderTable([]);
    }
}

/* ── UPDATE ───────────────────────────────────────── */
async function updateStudent(e) {
    e.preventDefault();
    const id = document.getElementById('update-id').value.trim();
    const body = {
        name: document.getElementById('update-name').value.trim(),
        specialty: document.getElementById('update-specialty').value.trim(),
        score: document.getElementById('update-score').value,
    };
    // strip empty fields
    Object.keys(body).forEach(k => { if (!body[k]) delete body[k]; });
    try {
        const res = await fetch(`/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        showToast(`✓ Student ${id} updated`, 'ok');
        document.getElementById('updateForm').reset();
    } catch (err) {
        showToast(`✗ ${err.message}`, 'err');
    }
}

/* ── DELETE ───────────────────────────────────────── */
async function deleteStudent(e) {
    e.preventDefault();
    const id = document.getElementById('delete-id').value.trim();
    try {
        const res = await fetch(`/students/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        showToast(`✓ Student ${id} deleted`, 'ok');
        document.getElementById('deleteForm').reset();
    } catch (err) {
        showToast(`✗ ${err.message}`, 'err');
    }
}
