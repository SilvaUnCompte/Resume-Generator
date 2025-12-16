/* ===========================================
   INTERESTS
   Interest items management
   =========================================== */

/**
 * Add a new interest
 */
function addInterest() {
  const id = Date.now()
  state.interests.push({ id, label: "", description: "", image: "", visible: true })

  const container = document.getElementById("interestsContainer")
  const itemDiv = document.createElement("div")
  itemDiv.className = "item-container"
  itemDiv.id = `interest-${id}`

  itemDiv.innerHTML = `
        <button class="remove-btn" onclick="removeInterest(${id})">Remove</button>
        <div class="visible-checkbox">
            <input type="checkbox" id="interest-visible-${id}" checked onchange="updateInterestVisible(${id}, this.checked)">
            <label for="interest-visible-${id}">Visible</label>
        </div>
        <input type="text" placeholder="Label"
               oninput="updateInterest(${id}, 'label', this.value)" value="">
        <input type="text" placeholder="Description"
               oninput="updateInterest(${id}, 'description', this.value)" value="">
        <div class="input-row">
            <label class="image-upload-btn">
                <input type="file" accept="image/*" onchange="uploadInterestImage(${id}, this.files[0])" hidden>
                Upload Image
            </label>
            <div id="interest-image-preview-${id}" style="display: flex; align-items: center;"></div>
        </div>
    `

  container.appendChild(itemDiv)
}

/**
 * Remove an interest
 * @param {number} id - Interest ID
 */
function removeInterest(id) {
  state.interests = state.interests.filter((i) => i.id !== id)
  document.getElementById(`interest-${id}`).remove()
  updatePreview()
}

/**
 * Update an interest field
 * @param {number} id - Interest ID
 * @param {string} field - Field name
 * @param {*} value - New value
 */
function updateInterest(id, field, value) {
  const interest = state.interests.find((i) => i.id === id)
  if (interest) {
    interest[field] = value
    updatePreview()
  }
}

/**
 * Update interest visibility
 * @param {number} id - Interest ID
 * @param {boolean} visible - Visibility state
 */
function updateInterestVisible(id, visible) {
  const interest = state.interests.find((i) => i.id === id)
  if (interest) {
    interest.visible = visible
    updatePreview()
  }
}

/**
 * Upload image for an interest
 * @param {number} id - Interest ID
 * @param {File} file - Uploaded file
 */
function uploadInterestImage(id, file) {
  if (!file) return

  const interest = state.interests.find((i) => i.id === id)
  if (!interest) return

  const reader = new FileReader()
  reader.onload = (e) => {
    interest.image = e.target.result

    const previewContainer = document.getElementById(`interest-image-preview-${id}`)
    previewContainer.innerHTML = `
            <img src="${e.target.result}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-left: 8px;">
        `

    updatePreview()
  }
  reader.readAsDataURL(file)
}

/**
 * Rebuild interests UI from state (used after JSON import)
 */
function rebuildInterests() {
  const container = document.getElementById("interestsContainer")
  container.innerHTML = ""

  state.interests.forEach((interest) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "item-container"
    itemDiv.id = `interest-${interest.id}`

    itemDiv.innerHTML = `
            <button class="remove-btn" onclick="removeInterest(${interest.id})">Remove</button>
            <div class="visible-checkbox">
                <input type="checkbox" id="interest-visible-${interest.id}" ${interest.visible ? "checked" : ""} onchange="updateInterestVisible(${interest.id}, this.checked)">
                <label for="interest-visible-${interest.id}">Visible</label>
            </div>
            <input type="text" placeholder="Label"
                   oninput="updateInterest(${interest.id}, 'label', this.value)" value="${interest.label || ""}">
            <input type="text" placeholder="Description"
                   oninput="updateInterest(${interest.id}, 'description', this.value)" value="${interest.description || ""}">
            <div class="input-row">
                <label class="image-upload-btn">
                    <input type="file" accept="image/*" onchange="uploadInterestImage(${interest.id}, this.files[0])" hidden>
                    Upload Image
                </label>
                <div id="interest-image-preview-${interest.id}" style="display: flex; align-items: center;">
                    ${interest.image ? `<img src="${interest.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-left: 8px;">` : ""}
                </div>
            </div>
        `

    container.appendChild(itemDiv)
  })
}
