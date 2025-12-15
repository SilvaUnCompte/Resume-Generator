/* ===========================================
   EDUCATION
   Education items management
   =========================================== */

/**
 * Add a new education entry
 */
function addEducation() {
  const id = Date.now()
  state.education.push({ id, label: "", description: "", visible: true })

  const container = document.getElementById("educationContainer")
  const itemDiv = document.createElement("div")
  itemDiv.className = "item-container"
  itemDiv.id = `education-${id}`

  itemDiv.innerHTML = `
        <button class="remove-btn" onclick="removeEducation(${id})">Remove</button>
        <div class="reorder-buttons">
            <button class="reorder-btn" onclick="moveEducation(${id}, -1)" title="Move up">&#9650;</button>
            <button class="reorder-btn" onclick="moveEducation(${id}, 1)" title="Move down">&#9660;</button>
        </div>
        <div class="visible-checkbox">
            <input type="checkbox" id="education-visible-${id}" checked onchange="updateEducationVisible(${id}, this.checked)">
            <label for="education-visible-${id}">Visible</label>
        </div>
        <input type="text" placeholder="Label (e.g., 2023 to 2026 - Master)"
               onchange="updateEducation(${id}, 'label', this.value)" value="">
        <textarea rows="3" placeholder="Description"
                  onchange="updateEducation(${id}, 'description', this.value)"></textarea>
    `

  container.appendChild(itemDiv)
}

/**
 * Remove an education entry
 * @param {number} id - Education ID
 */
function removeEducation(id) {
  state.education = state.education.filter((e) => e.id !== id)
  document.getElementById(`education-${id}`).remove()
  updatePreview()
}

/**
 * Update an education field
 * @param {number} id - Education ID
 * @param {string} field - Field name
 * @param {*} value - New value
 */
function updateEducation(id, field, value) {
  const education = state.education.find((e) => e.id === id)
  if (education) {
    education[field] = value
    updatePreview()
  }
}

/**
 * Update education visibility
 * @param {number} id - Education ID
 * @param {boolean} visible - Visibility state
 */
function updateEducationVisible(id, visible) {
  const education = state.education.find((e) => e.id === id)
  if (education) {
    education.visible = visible
    updatePreview()
  }
}

function moveEducation(id, direction) {
  const index = state.education.findIndex((e) => e.id === id)
  if (index === -1) return

  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= state.education.length) return

  // Swap elements in the array
  const temp = state.education[index]
  state.education[index] = state.education[newIndex]
  state.education[newIndex] = temp

  // Rebuild UI and preview
  rebuildEducation()
  updatePreview()
}

/**
 * Rebuild education UI from state (used after JSON import)
 */
function rebuildEducation() {
  const container = document.getElementById("educationContainer")
  container.innerHTML = ""

  state.education.forEach((edu) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "item-container"
    itemDiv.id = `education-${edu.id}`

    itemDiv.innerHTML = `
            <button class="remove-btn" onclick="removeEducation(${edu.id})">Remove</button>
            <div class="reorder-buttons">
                <button class="reorder-btn" onclick="moveEducation(${edu.id}, -1)" title="Move up">&#9650;</button>
                <button class="reorder-btn" onclick="moveEducation(${edu.id}, 1)" title="Move down">&#9660;</button>
            </div>
            <div class="visible-checkbox">
                <input type="checkbox" id="education-visible-${edu.id}" ${edu.visible ? "checked" : ""} onchange="updateEducationVisible(${edu.id}, this.checked)">
                <label for="education-visible-${edu.id}">Visible</label>
            </div>
            <input type="text" placeholder="Label (e.g., 2023 to 2026 - Master)"
                   onchange="updateEducation(${edu.id}, 'label', this.value)" value="${edu.label || ""}">
            <textarea rows="3" placeholder="Description"
                      onchange="updateEducation(${edu.id}, 'description', this.value)">${edu.description || ""}</textarea>
        `

    container.appendChild(itemDiv)
  })
}
