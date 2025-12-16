/* ===========================================
   EDUCATION
   Education items management
   =========================================== */

/**
 * Add a new education entry
 */
function addEducation() {
  const id = Date.now()
  state.education.push({ id, label: "", description: "", visible: true, icon: null })

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
        <div class="input-row">
            <input type="text" placeholder="Label (e.g., 2023 to 2026 - Master)"
                   oninput="updateEducation(${id}, 'label', this.value)" value="">
            <div class="icon-upload-group">
                <div class="icon-preview" id="education-icon-preview-${id}">
                    <span class="no-icon">No icon</span>
                </div>
                <label class="image-upload-btn small">
                    <input type="file" accept="image/*" onchange="uploadEducationIcon(${id}, this)" hidden>
                    Icon
                </label>
                <button class="remove-icon-btn" id="education-icon-remove-${id}" style="display: none;" onclick="removeEducationIcon(${id})">×</button>
            </div>
        </div>
        <textarea rows="3" placeholder="Description"
                  oninput="updateEducation(${id}, 'description', this.value)"></textarea>
    `

  container.appendChild(itemDiv)
}

/**
 * Upload icon for education item
 */
function uploadEducationIcon(id, input) {
  const file = input.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const education = state.education.find((edu) => edu.id === id)
    if (education) {
      education.icon = e.target.result
      updateEducationIconPreview(id, e.target.result)
      updatePreview()
    }
  }
  reader.readAsDataURL(file)
}

/**
 * Remove icon from education item
 */
function removeEducationIcon(id) {
  const education = state.education.find((edu) => edu.id === id)
  if (education) {
    education.icon = null
    updateEducationIconPreview(id, null)
    updatePreview()
  }
}

/**
 * Update education icon preview in config panel
 */
function updateEducationIconPreview(id, iconData) {
  const preview = document.getElementById(`education-icon-preview-${id}`)
  const removeBtn = document.getElementById(`education-icon-remove-${id}`)

  if (iconData) {
    preview.innerHTML = `<img src="${iconData}" alt="Icon">`
    removeBtn.style.display = "inline-block"
  } else {
    preview.innerHTML = `<span class="no-icon">No icon</span>`
    removeBtn.style.display = "none"
  }
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

    const hasIcon = edu.icon ? true : false
    const iconPreviewContent = hasIcon ? `<img src="${edu.icon}" alt="Icon">` : `<span class="no-icon">No icon</span>`

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
            <div class="input-row">
                <input type="text" placeholder="Label (e.g., 2023 to 2026 - Master)"
                       oninput="updateEducation(${edu.id}, 'label', this.value)" value="${edu.label || ""}">
                <div class="icon-upload-group">
                    <div class="icon-preview" id="education-icon-preview-${edu.id}">
                        ${iconPreviewContent}
                    </div>
                    <label class="image-upload-btn small">
                        <input type="file" accept="image/*" onchange="uploadEducationIcon(${edu.id}, this)" hidden>
                        Icon
                    </label>
                    <button class="remove-icon-btn" id="education-icon-remove-${edu.id}" style="display: ${hasIcon ? "inline-block" : "none"};" onclick="removeEducationIcon(${edu.id})">×</button>
                </div>
            </div>
            <textarea rows="3" placeholder="Description"
                      oninput="updateEducation(${edu.id}, 'description', this.value)">${edu.description || ""}</textarea>
        `

    container.appendChild(itemDiv)
  })
}
