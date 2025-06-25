let allStudents = [];

function loadStudentData() {
  const year = document.getElementById('year').value;
  const branch = document.getElementById('branch').value;
  const section = document.getElementById('section').value;

  if (!year || !branch || !section) {
    alert("Please select year, branch, and section.");
    return;
  }

  const filePath = `excel_sheets/${year}_batch_${branch}_${section}.xlsx`;
  const imgFolder = `img_${year}_batch_${branch}_${section}/`;

  fetch(filePath)
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      allStudents = json;
      renderStudents(allStudents, imgFolder);
    })
    .catch(error => {
      alert("Error loading Excel file: " + error);
    });
}

function renderStudents(data, imgFolder) {
  const container = document.getElementById('student-container');
  container.innerHTML = "";

  data.forEach(student => {
    const rollNo = student["Roll No./Register No."] || student["Roll No"] || student["Roll Number"];
    const name = `${student["First Name"] || ""} ${student["Last Name"] || ""}`.trim();
    const father = `${student["Father Name"] || ""} ${student["Father Last Name"] || ""}`.trim();
    const mobile = student["Mobile No."] || "";
    const phone = student["Phone No."] || "";
    const fMobile = student["Father Address Mobile Number"] || "";
    const fPhone = student["Father Address Phone Number"] || "";

    const card = document.createElement("div");
    card.className = "student-card";
    card.innerHTML = `
      <div class="student-details">
        <h3>${name}</h3>
        <h3>${rollNo}</h3>
        <p><strong>Parent:</strong> ${father}</p>
        <div class="contact-row">
          <span><strong>Student:</strong> ${mobile || phone}</span>
          <span>
            <a href="tel:${mobile || phone}">Call</a>
            
            <a href="sms:${mobile || phone}">Message</a>
          </span>
        </div>
        <div class="contact-row">
          <span><strong>Parent:</strong> ${fMobile || fPhone}</span>
          <span>
            <a href="tel:${fMobile || fPhone}">Call</a>
            
            <a href="sms:${fMobile || fPhone}">Message</a>
          </span>
        </div>
      </div>
      <img id="img-${rollNo}" class="student-img" alt="${rollNo}" />
    `;
    container.appendChild(card);

    const imgElement = card.querySelector(`#img-${rollNo}`);
    tryImageExtensions(rollNo, imgFolder, imgElement);
  });
}

function tryImageExtensions(rollNo, folder, imgElement) {
  const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
  let index = 0;

  function tryNext() {
    if (index >= extensions.length) {
      imgElement.src = "img/not_provided.png";
      return;
    }
    const ext = extensions[index++];
    const testSrc = `${folder}${rollNo}.${ext}`;
    imgElement.onerror = tryNext;
    imgElement.src = testSrc;
  }

  tryNext();
}

function searchStudents() {
  const query = document.getElementById('search').value.toLowerCase();
  const filtered = allStudents.filter(student => {
    return Object.values(student).some(value =>
      String(value).toLowerCase().includes(query)
    );
  });

  const year = document.getElementById('year').value;
  const branch = document.getElementById('branch').value;
  const section = document.getElementById('section').value;
  const imgFolder = `img_${year}_batch_${branch}_${section}/`;

  renderStudents(filtered, imgFolder);
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}
