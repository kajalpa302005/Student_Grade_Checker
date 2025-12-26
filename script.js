// Load students from LocalStorage
let students = JSON.parse(localStorage.getItem("students")) || [];
let chart; // for Chart.js

// ================= ADD STUDENT =================
function addStudent() {
    let name = document.getElementById("name").value.trim();
    let marks = Number(document.getElementById("marks").value);

    // Validation
    if (name === "" || isNaN(marks)) {
        Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Please fill all fields"
        });
        return;
    }

    if (marks < 0 || marks > 100) {
        Swal.fire({
            icon: "warning",
            title: "Invalid Marks",
            text: "Marks must be between 0 and 100"
        });
        return;
    }

    // Grade & Performance
    let grade = "", performance = "";

    if (marks >= 90) { grade = "A+"; performance = "Excellent 🌟"; }
    else if (marks >= 80) { grade = "A"; performance = "Very Good 👍"; }
    else if (marks >= 70) { grade = "B"; performance = "Good 🙂"; }
    else if (marks >= 60) { grade = "C"; performance = "Average 😐"; }
    else { grade = "F"; performance = "Fail ❌"; }

    // Save student
    students.push({ name, marks, grade, performance });
    localStorage.setItem("students", JSON.stringify(students));

    // Result message
    document.getElementById("result").innerHTML =
        `<b>${name}</b> scored <b>${marks}</b> marks → Grade <b>${grade}</b>`;

    // Update UI
    displayStudents();

    // Success Alert
    Swal.fire({
        icon: "success",
        title: "Success 🎉",
        text: "Student record added successfully!"
    });

    // Clear inputs
    document.getElementById("name").value = "";
    document.getElementById("marks").value = "";
}

// ================= DISPLAY STUDENTS =================
function displayStudents() {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    // Rank system (sort by marks)
    students.sort((a, b) => b.marks - a.marks);

    students.forEach((s, i) => {
        let gradeClass = s.grade.replace("+", "plus");

        let row = `
        <tr class="${i === 0 ? 'topper' : ''}">
            <td>${i + 1}</td>
            <td>${s.name}</td>
            <td>${s.marks}</td>
            <td class="${gradeClass}">${s.grade}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar" style="width:${s.marks}%"></div>
                </div>
            </td>
            <td>${s.performance}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    updateStats();
    renderChart();
}

// ================= UPDATE STATISTICS =================
function updateStats() {
    if (students.length === 0) return;

    let total = students.length;

    let sum = students.reduce((a, b) => a + Number(b.marks), 0);
    let avg = (sum / total).toFixed(2);
    let max = Math.max(...students.map(s => Number(s.marks)));

    document.getElementById("total").innerText = total;
    document.getElementById("average").innerText = avg;
    document.getElementById("highest").innerText = max;
}

// ================= SEARCH STUDENT =================
function searchStudent() {
    let value = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        let name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(value) ? "" : "none";
    });
}

// ================= TOGGLE THEME =================
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// ================= EXPORT CSV =================
function exportCSV() {
    let csv = "Rank,Name,Marks,Grade\n";
    students.forEach((s, i) => {
        csv += `${i + 1},${s.name},${s.marks},${s.grade}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "student_results.csv";
    a.click();
}

// ================= EXPORT PDF =================
function exportPDF() {
    let element = document.querySelector(".container");
    html2pdf().from(element).save("Student_Report.pdf");
}

// ================= CHART.JS =================
function renderChart() {
    let grades = { "A+": 0, "A": 0, "B": 0, "C": 0, "F": 0 };

    students.forEach(s => grades[s.grade]++);

    let data = {
        labels: Object.keys(grades),
        datasets: [{
            label: "Grade Distribution",
            data: Object.values(grades),
            backgroundColor: ["green", "seagreen", "orange", "brown", "red"]
        }]
    };

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("gradeChart"), {
        type: "bar",
        data: data
    });
}

// Initial load
displayStudents();
