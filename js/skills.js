/* ===========================================
   SKILLS
   Skill groups and items management
   =========================================== */

/**
 * Add a new skill group
 */
function addSkillGroup() {
  const id = Date.now()
  state.skills.push({ id, title: "", items: [], visible: true })

  const container = document.getElementById("skillsContainer")
  const groupDiv = document.createElement("div")
  groupDiv.className = "item-container"
  groupDiv.id = `skill-group-${id}`

  groupDiv.innerHTML = `
        <button class="remove-btn" onclick="removeSkillGroup(${id})">Remove</button>
        <div class="visible-checkbox">
            <input type="checkbox" id="skill-group-visible-${id}" checked onchange="updateSkillGroupVisible(${id}, this.checked)">
            <label for="skill-group-visible-${id}">Visible</label>
        </div>
        <input type="text" placeholder="Group Title (e.g., Programming languages)"
               onchange="updateSkillGroupTitle(${id}, this.value)" value="">
        <div id="skill-items-${id}"></div>
        <button class="add-skill-item-btn" onclick="addSkillItem(${id})">+ Add Skill</button>
    `

  container.appendChild(groupDiv)
  addSkillItem(id)
}

/**
 * Remove a skill group
 * @param {number} id - Group ID
 */
function removeSkillGroup(id) {
  state.skills = state.skills.filter((g) => g.id !== id)
  document.getElementById(`skill-group-${id}`).remove()
  updatePreview()
}

/**
 * Update skill group title
 * @param {number} id - Group ID
 * @param {string} value - New title
 */
function updateSkillGroupTitle(id, value) {
  const group = state.skills.find((g) => g.id === id)
  if (group) {
    group.title = value
    updatePreview()
  }
}

/**
 * Update skill group visibility
 * @param {number} id - Group ID
 * @param {boolean} visible - Visibility state
 */
function updateSkillGroupVisible(id, visible) {
  const group = state.skills.find((g) => g.id === id)
  if (group) {
    group.visible = visible
    updatePreview()
  }
}

/**
 * Add a skill item to a group
 * @param {number} groupId - Parent group ID
 */
function addSkillItem(groupId) {
  const group = state.skills.find((g) => g.id === groupId)
  if (!group) return

  const itemId = Date.now()
  group.items.push({ id: itemId, name: "", icons: [], visible: true })

  const container = document.getElementById(`skill-items-${groupId}`)
  const itemDiv = document.createElement("div")
  itemDiv.className = "skill-item"
  itemDiv.id = `skill-item-${itemId}`

  itemDiv.innerHTML = `
        <button class="remove-skill-btn" onclick="removeSkillItem(${groupId}, ${itemId})">×</button>
        <div class="visible-checkbox">
            <input type="checkbox" id="skill-item-visible-${itemId}" checked onchange="updateSkillItemVisible(${groupId}, ${itemId}, this.checked)">
            <label for="skill-item-visible-${itemId}">Visible</label>
        </div>
        <div class="input-row">
            <input type="text" placeholder="Skill Name"
                   onchange="updateSkillItem(${groupId}, ${itemId}, 'name', this.value)" value="">
            <label class="image-upload-btn">
                <input type="file" accept="image/*" multiple onchange="uploadSkillIcons(${groupId}, ${itemId}, this.files)" hidden>
                Upload Icons
            </label>
        </div>
        <div id="skill-icons-preview-${itemId}" style="display: flex; gap: 5px; flex-wrap: wrap;"></div>
    `

  container.appendChild(itemDiv)
}

/**
 * Remove a skill item
 * @param {number} groupId - Parent group ID
 * @param {number} itemId - Item ID
 */
function removeSkillItem(groupId, itemId) {
  const group = state.skills.find((g) => g.id === groupId)
  if (group) {
    group.items = group.items.filter((i) => i.id !== itemId)
    document.getElementById(`skill-item-${itemId}`).remove()
    updatePreview()
  }
}

/**
 * Update a skill item field
 * @param {number} groupId - Parent group ID
 * @param {number} itemId - Item ID
 * @param {string} field - Field name
 * @param {*} value - New value
 */
function updateSkillItem(groupId, itemId, field, value) {
  const group = state.skills.find((g) => g.id === groupId)
  if (group) {
    const item = group.items.find((i) => i.id === itemId)
    if (item) {
      item[field] = value
      updatePreview()
    }
  }
}

/**
 * Update skill item visibility
 * @param {number} groupId - Parent group ID
 * @param {number} itemId - Item ID
 * @param {boolean} visible - Visibility state
 */
function updateSkillItemVisible(groupId, itemId, visible) {
  const group = state.skills.find((g) => g.id === groupId)
  if (group) {
    const item = group.items.find((i) => i.id === itemId)
    if (item) {
      item.visible = visible
      updatePreview()
    }
  }
}

/**
 * Upload icons for a skill item
 * @param {number} groupId - Parent group ID
 * @param {number} itemId - Item ID
 * @param {FileList} files - Uploaded files
 */
function uploadSkillIcons(groupId, itemId, files) {
  const group = state.skills.find((g) => g.id === groupId)
  if (!group) return

  const item = group.items.find((i) => i.id === itemId)
  if (!item) return

  const previewContainer = document.getElementById(`skill-icons-preview-${itemId}`)

  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      item.icons.push(e.target.result)

      const img = document.createElement("img")
      img.src = e.target.result
      img.style.width = "30px"
      img.style.height = "30px"
      img.style.objectFit = "contain"
      img.style.border = "1px solid #ddd"
      img.style.borderRadius = "3px"
      img.style.cursor = "pointer"
      img.onclick = () => {
        item.icons = item.icons.filter((icon) => icon !== e.target.result)
        img.remove()
        updatePreview()
      }

      previewContainer.appendChild(img)
      updatePreview()
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Rebuild skills UI from state (used after JSON import)
 */
function rebuildSkills() {
  const container = document.getElementById("skillsContainer")
  container.innerHTML = ""

  state.skills.forEach((group) => {
    const groupDiv = document.createElement("div")
    groupDiv.className = "item-container"
    groupDiv.id = `skill-group-${group.id}`

    groupDiv.innerHTML = `
            <button class="remove-btn" onclick="removeSkillGroup(${group.id})">Remove</button>
            <div class="visible-checkbox">
                <input type="checkbox" id="skill-group-visible-${group.id}" ${group.visible ? "checked" : ""} onchange="updateSkillGroupVisible(${group.id}, this.checked)">
                <label for="skill-group-visible-${group.id}">Visible</label>
            </div>
            <input type="text" placeholder="Group Title"
                   onchange="updateSkillGroupTitle(${group.id}, this.value)" value="${group.title || ""}">
            <div id="skill-items-${group.id}"></div>
            <button class="add-skill-item-btn" onclick="addSkillItem(${group.id})">+ Add Skill</button>
        `

    container.appendChild(groupDiv)

    const itemsContainer = document.getElementById(`skill-items-${group.id}`)
    group.items.forEach((item) => {
      const itemDiv = document.createElement("div")
      itemDiv.className = "skill-item"
      itemDiv.id = `skill-item-${item.id}`

      itemDiv.innerHTML = `
                <button class="remove-skill-btn" onclick="removeSkillItem(${group.id}, ${item.id})">×</button>
                <div class="visible-checkbox">
                    <input type="checkbox" id="skill-item-visible-${item.id}" ${item.visible ? "checked" : ""} onchange="updateSkillItemVisible(${group.id}, ${item.id}, this.checked)">
                    <label for="skill-item-visible-${item.id}">Visible</label>
                </div>
                <div class="input-row">
                    <input type="text" placeholder="Skill Name"
                           onchange="updateSkillItem(${group.id}, ${item.id}, 'name', this.value)" value="${item.name || ""}">
                    <label class="image-upload-btn">
                        <input type="file" accept="image/*" multiple onchange="uploadSkillIcons(${group.id}, ${item.id}, this.files)" hidden>
                        Upload Icons
                    </label>
                </div>
                <div id="skill-icons-preview-${item.id}" style="display: flex; gap: 5px; flex-wrap: wrap;"></div>
            `

      itemsContainer.appendChild(itemDiv)

      // Rebuild icon previews
      const previewContainer = document.getElementById(`skill-icons-preview-${item.id}`)
      if (item.icons && item.icons.length > 0) {
        item.icons.forEach((iconData) => {
          const img = document.createElement("img")
          img.src = iconData
          img.style.width = "30px"
          img.style.height = "30px"
          img.style.objectFit = "contain"
          img.style.border = "1px solid #ddd"
          img.style.borderRadius = "3px"
          img.style.cursor = "pointer"
          img.onclick = () => {
            item.icons = item.icons.filter((icon) => icon !== iconData)
            img.remove()
            updatePreview()
          }
          previewContainer.appendChild(img)
        })
      }
    })
  })
}
