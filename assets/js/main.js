// Speicher der Aufgaben
let tasks = [];
    
// Motivierende Sprüche ... villeicht fällt mir ja noch was ein.
const quotes = [
  "Consider IT solved! - Menten",
  "Jeder Schritt zählt, auch kleine Schritte führen ans Ziel!",
  "Deine Mühe wird belohnt, gib niemals auf!",
  "Erfolg ist kein Zufall, sondern das Ergebnis harter Arbeit!",
];

// Voreingestellte Beispielaufgaben
const defaultTasks = [
  {
    id: 1,
    title: "Bewerbung von B.F.",
    tags: "Bewerbung",
    note: "",
    priority: "hoch",
    completed: false
  },
  {
    id: 2,
    title: "To Do Liste an M. senden",
    tags: "Bewerbung",
    note: "an C.F. senden",
    priority: "hoch",
    completed: true
  },
  {
    id: 3,
    title: "Mathe Arbeit Vorbereitung",
    tags: "Schule",
    note: "Analysis!!!",
    priority: "mittel",
    completed: false
  }
];

let completedCount = 0;

function renderTasks() {

  // Sortierung
  tasks.sort((a, b) => a.completed - b.completed);
  $('#taskList').empty();
        
  tasks.forEach(task => {
    if(task.completed) {
      completedCount++;
    }

    // Farben / Visuell Zeug wenn erledigt oder Priorität hoch
    let rowClass = "";
    if(task.completed) {
      rowClass += " completed";
    }
    if(task.priority === "hoch") {
      rowClass += " high-priority";
    }
    
    const row = $(`
      <tr data-id="${task.id}" class="${rowClass}">
        <td>
          <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
        </td>
        <td>${task.title}</td>
        <td>${task.tags}</td>
        <td>${task.note}</td>
        <td>${task.priority}</td>
        <td>
          <button class="btn btn-danger btn-sm delete-task">Löschen</button>
        </td>
      </tr>
    `);
    $('#taskList').append(row);
  });
  
  $('#taskCounter').text(`Erledigte Aufgaben: ${completedCount} von ${tasks.length}`);
  
  saveTasksToCookies(); // für 1 Jahr ... das sollte für eine Aufgabe doch reichen, oder?
}

function saveTasksToCookies() {
  const d = new Date();
  d.setTime(d.getTime() + (256 * 24 * 60 * 60 * 1000)); // 1 Jahr
  let expires = "expires=" + d.toUTCString();
  document.cookie = "tasks=" + JSON.stringify(tasks) + ";" + expires + ";path=/";
}


function loadTasksFromCookies() {
  let name = "tasks=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      let cookieTasks = c.substring(name.length, c.length);
      if (cookieTasks) {
        tasks = JSON.parse(cookieTasks);
      }
    }
  }
}


$(document).ready(function() {

  loadTasksFromCookies();

  // Standardaufgaben beim ersten ansehen
  if (tasks.length === 0) {
    tasks = defaultTasks;
  }
  renderTasks();
  
  // neue aufgaben Hinzufügen
  $('#taskForm').submit(function(e) {
    e.preventDefault();
    let newTask = {
      id: Date.now(),
      title: $('#taskTitle').val(),
      tags: $('#taskTags').val(),
      note: $('#taskNote').val(),
      priority: $('#taskPriority').val(),
      completed: false
    };
    tasks.push(newTask);
    renderTasks();
    $('#taskForm')[0].reset();
  });
  
  // check!
  $('#taskList').on('change', '.complete-checkbox', function() {
    let taskId = $(this).closest('tr').data('id');
    tasks = tasks.map(task => {
      if (task.id == taskId) {
        task.completed = $(this).is(':checked');
      }
      return task;
    });
    renderTasks();
  });
  
  // löschen
  $('#taskList').on('click', '.delete-task', function() {
    let taskId = $(this).closest('tr').data('id');
    tasks = tasks.filter(task => task.id != taskId);
    renderTasks();
  });
  
  // Random aufgaben wenn mir langweilig ist
  $('#randomTaskBtn').click(function() {
    // Filtere alle offenen (nicht erledigten) Aufgaben
    let openTasks = tasks.filter(task => !task.completed);
    if (openTasks.length > 0) {
      let randomTask = openTasks[Math.floor(Math.random() * openTasks.length)]; // also Python war einfacher glaub ich... dank sei dem Internet!
      alert("Ich glaube diese Aufgabe ist perfekt für deine Langeweile-Bewältigung:\n " + randomTask.title + "?");
    } else {
      alert("Alle Aufgaben sind erledigt! Wie hast du das nur geschafft? Hat der Button etwa geholfen? ;)");
    }
  });
  
  // Brauchst du Motivation? :)
  $('#motivationBtn').click(function() {
    let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    alert(randomQuote);
  });
});