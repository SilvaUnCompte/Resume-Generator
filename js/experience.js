/* ===========================================
   EXPERIENCE
   Experience items management
   =========================================== */

/**
 * Add a new experience entry
 */
function addExperience() {
  const id = Date.now()
  state.experience.push({ id, label: "", description: "", visible: true })

  const container = document.getElementById("experienceContainer")
  const itemDiv = document.createElement("div")
  itemDiv.className = "item-container"
  itemDiv.id = `experience-${id}`

  itemDiv.innerHTML = `
        <button class="remove-btn" onclick="removeExperience(${id})">Remove</button>
        <div class="visible-checkbox">
            <input type="checkbox" id="experience-visible-${id}" checked onchange="updateExperienceVisible(${id}, this.checked)">
            <label for="experience-visible-${id}">Visible</label>
        </div>
        <input type="text" placeholder="Label (e.g., 2023 to 2026 - Company)"
               onchange="updateExperience(${id}, 'label', this.value)" value="">
        <textarea rows="3" placeholder="Description"
                  onchange="updateExperience(${id}, 'description', this.value)"></textarea>
    `

  container.appendChild(itemDiv)
}

/**
 * Remove an experience entry
 * @param {number} id - Experience ID
 */
function removeExperience(id) {
  state.experience = state.experience.filter((e) => e.id !== id)
  document.getElementById(`experience-${id}`).remove()
  updatePreview()
}

/**
 * Update an experience field
 * @param {number} id - Experience ID
 * @param {string} field - Field name
 * @param {*} value - New value
 */
function updateExperience(id, field, value) {
  const experience = state.experience.find((e) => e.id === id)
  if (experience) {
    experience[field] = value
    updatePreview()
  }
}

/**
 * Update experience visibility
 * @param {number} id - Experience ID
 * @param {boolean} visible - Visibility state
 */
function updateExperienceVisible(id, visible) {
  const experience = state.experience.find((e) => e.id === id)
  if (experience) {
    experience.visible = visible
    updatePreview()
  }
}

/**
 * Rebuild experience UI from state (used after JSON import)
 */
function rebuildExperience() {
  const container = document.getElementById("experienceContainer")
  container.innerHTML = ""

  state.experience.forEach((exp) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "item-container"
    itemDiv.id = `experience-${exp.id}`

    itemDiv.innerHTML = `
            <button class="remove-btn" onclick="removeExperience(${exp.id})">Remove</button>
            <div class="visible-checkbox">
                <input type="checkbox" id="experience-visible-${exp.id}" ${exp.visible ? "checked" : ""} onchange="updateExperienceVisible(${exp.id}, this.checked)">
                <label for="experience-visible-${exp.id}">Visible</label>
            </div>
            <input type="text" placeholder="Label (e.g., 2023 to 2026 - Company)"
                   onchange="updateExperience(${exp.id}, 'label', this.value)" value="${exp.label || ""}">
            <textarea rows="3" placeholder="Description"
                      onchange="updateExperience(${exp.id}, 'description', this.value)">${exp.description || ""}</textarea>
        `

    container.appendChild(itemDiv)
  })
}
