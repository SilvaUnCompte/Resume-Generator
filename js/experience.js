/* ===========================================
   EXPERIENCE
   Experience items management
   =========================================== */

/**
 * Add a new experience entry
 */
function addExperience() {
  const id = Date.now()
  state.experience.push({ id, label: "", description: "", visible: true, icon: null })

  const container = document.getElementById("experienceContainer")
  const itemDiv = document.createElement("div")
  itemDiv.className = "item-container"
  itemDiv.id = `experience-${id}`

  itemDiv.innerHTML = `
        <button class="remove-btn" onclick="removeExperience(${id})">Remove</button>
        <div class="reorder-buttons">
            <button class="reorder-btn" onclick="moveExperience(${id}, -1)" title="Move up">&#9650;</button>
            <button class="reorder-btn" onclick="moveExperience(${id}, 1)" title="Move down">&#9660;</button>
        </div>
        <div class="visible-checkbox">
            <input type="checkbox" id="experience-visible-${id}" checked onchange="updateExperienceVisible(${id}, this.checked)">
            <label for="experience-visible-${id}">Visible</label>
        </div>
        <div class="input-row">
            <input type="text" placeholder="Label (e.g., 2023 to 2026 - Company)"
                   onchange="updateExperience(${id}, 'label', this.value)" value="">
            <div class="icon-upload-group">
                <div class="icon-preview" id="experience-icon-preview-${id}">
                    <span class="no-icon">No icon</span>
                </div>
                <label class="image-upload-btn small">
                    <input type="file" accept="image/*" onchange="uploadExperienceIcon(${id}, this)" hidden>
                    Icon
                </label>
                <button class="remove-icon-btn" id="experience-icon-remove-${id}" style="display: none;" onclick="removeExperienceIcon(${id})">×</button>
            </div>
        </div>
        <textarea rows="3" placeholder="Description"
                  onchange="updateExperience(${id}, 'description', this.value)"></textarea>
    `

  container.appendChild(itemDiv)
}

/**
 * Upload icon for experience item
 */
function uploadExperienceIcon(id, input) {
  const file = input.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const experience = state.experience.find((exp) => exp.id === id)
    if (experience) {
      experience.icon = e.target.result
      updateExperienceIconPreview(id, e.target.result)
      updatePreview()
    }
  }
  reader.readAsDataURL(file)
}

/**
 * Remove icon from experience item
 */
function removeExperienceIcon(id) {
  const experience = state.experience.find((exp) => exp.id === id)
  if (experience) {
    experience.icon = null
    updateExperienceIconPreview(id, null)
    updatePreview()
  }
}

/**
 * Update experience icon preview in config panel
 */
function updateExperienceIconPreview(id, iconData) {
  const preview = document.getElementById(`experience-icon-preview-${id}`)
  const removeBtn = document.getElementById(`experience-icon-remove-${id}`)

  if (iconData) {
    preview.innerHTML = `<img src="${iconData}" alt="Icon">`
    removeBtn.style.display = "inline-block"
  } else {
    preview.innerHTML = `<span class="no-icon">No icon</span>`
    removeBtn.style.display = "none"
  }
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

function moveExperience(id, direction) {
  const index = state.experience.findIndex((e) => e.id === id)
  if (index === -1) return

  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= state.experience.length) return

  // Swap elements in the array
  const temp = state.experience[index]
  state.experience[index] = state.experience[newIndex]
  state.experience[newIndex] = temp

  // Rebuild UI and preview
  rebuildExperience()
  updatePreview()
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

    const hasIcon = exp.icon ? true : false
    const iconPreviewContent = hasIcon ? `<img src="${exp.icon}" alt="Icon">` : `<span class="no-icon">No icon</span>`

    itemDiv.innerHTML = `
            <button class="remove-btn" onclick="removeExperience(${exp.id})">Remove</button>
            <div class="reorder-buttons">
                <button class="reorder-btn" onclick="moveExperience(${exp.id}, -1)" title="Move up">&#9650;</button>
                <button class="reorder-btn" onclick="moveExperience(${exp.id}, 1)" title="Move down">&#9660;</button>
            </div>
            <div class="visible-checkbox">
                <input type="checkbox" id="experience-visible-${exp.id}" ${exp.visible ? "checked" : ""} onchange="updateExperienceVisible(${exp.id}, this.checked)">
                <label for="experience-visible-${exp.id}">Visible</label>
            </div>
            <div class="input-row">
                <input type="text" placeholder="Label (e.g., 2023 to 2026 - Company)"
                       onchange="updateExperience(${exp.id}, 'label', this.value)" value="${exp.label || ""}">
                <div class="icon-upload-group">
                    <div class="icon-preview" id="experience-icon-preview-${exp.id}">
                        ${iconPreviewContent}
                    </div>
                    <label class="image-upload-btn small">
                        <input type="file" accept="image/*" onchange="uploadExperienceIcon(${exp.id}, this)" hidden>
                        Icon
                    </label>
                    <button class="remove-icon-btn" id="experience-icon-remove-${exp.id}" style="display: ${hasIcon ? "inline-block" : "none"};" onclick="removeExperienceIcon(${exp.id})">×</button>
                </div>
            </div>
            <textarea rows="3" placeholder="Description"
                      onchange="updateExperience(${exp.id}, 'description', this.value)">${exp.description || ""}</textarea>
        `

    container.appendChild(itemDiv)
  })
}
