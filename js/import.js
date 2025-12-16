/* ===========================================
   IMPORT
   JSON import function
   =========================================== */

/**
 * Import configuration from JSON file
 */
function importJSON(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)

      // Update shared state
      Object.assign(state, data)

      if (!state.timelineImages) {
        state.timelineImages = { bullet: null, dash: null }
      }

      if (!state.timelineIconPosition) state.timelineIconPosition = "before-label";
      document.getElementById("timelineIconPosition").value = state.timelineIconPosition;

      if (state.profilePhoto === undefined) {
        state.profilePhoto = null
      }

      if (state.profilePhotoSize === undefined) {
        state.profilePhotoSize = 80
      }

      // Update form fields
      updateFormFields(state)

      // Rebuild dynamic sections
      rebuildSkills()
      rebuildInterests()
      rebuildEducation()
      rebuildExperience()
      updateTimelineImagePreviews()
      updateProfilePhotoPreview()

      updatePreview()

      // Destroy import button after successful import: idk how to fix an issue with re-importing so f*ck it :)
      document.getElementsByClassName("import-btn")[0].remove();
    } catch (error) {
      console.error("Import error:", error)
      alert("Error importing JSON file. Please check the file format.")
    }
  }
  reader.readAsText(file)
}

/**
 * Update form fields from state
 */
function updateFormFields(state) {
  // Personal info
  document.getElementById("firstName").value = state.firstName || ""
  document.getElementById("lastName").value = state.lastName || ""
  document.getElementById("jobTitle").value = state.jobTitle || ""
  document.getElementById("email").value = state.email || ""
  document.getElementById("phone").value = state.phone || ""
  document.getElementById("linkedin").value = state.linkedin || ""
  document.getElementById("address").value = state.address || ""
  document.getElementById("introduction").value = state.introduction || ""

  document.getElementById("profilePhotoSize").value = state.profilePhotoSize || 80
  document.getElementById("profilePhotoSizeValue").textContent = `${state.profilePhotoSize || 80}px`

  // Options
  document.getElementById("showReference").checked = state.showReference || false
  document.getElementById("sameColors").checked = state.sameColors !== undefined ? state.sameColors : true
  document.getElementById("exportToImg").checked = state.exportToImg || false
  document.getElementById("columnBalance").value = state.columnBalance || 48
  document.getElementById("language").value = state.language || "en"

  // Font sizes
  if (state.fontSizes) {
    document.getElementById("fontGlobal").value = state.fontSizes.global || 1
    document.getElementById("fontGlobalValue").textContent = `${(state.fontSizes.global || 1).toFixed(2)}x`

    document.getElementById("fontSectionTitle").value = state.fontSizes.sectionTitle || 1
    document.getElementById("fontSectionTitleValue").textContent = `${(state.fontSizes.sectionTitle || 1).toFixed(2)}x`

    document.getElementById("fontSubsectionTitle").value = state.fontSizes.subsectionTitle || 1
    document.getElementById("fontSubsectionTitleValue").textContent =
      `${(state.fontSizes.subsectionTitle || 1).toFixed(2)}x`

    document.getElementById("fontLabel").value = state.fontSizes.label || 1
    document.getElementById("fontLabelValue").textContent = `${(state.fontSizes.label || 1).toFixed(2)}x`

    document.getElementById("fontDescription").value = state.fontSizes.description || 1
    document.getElementById("fontDescriptionValue").textContent = `${(state.fontSizes.description || 1).toFixed(2)}x`
  }

  // Colors
  if (state.colors) {
    document.getElementById("headerBgColor").value = state.colors.headerBg || "#bdc3c7"
    document.getElementById("headerTextColor").value = state.colors.headerText || "#2c3e50"
    document.getElementById("introBgColor").value = state.colors.introBg || "#34495e"
    document.getElementById("introTextColor").value = state.colors.introText || "#ffffff"
    document.getElementById("col1BgColor").value = state.colors.col1Bg || "#34495e"
    document.getElementById("col1TextColor").value = state.colors.col1Text || "#ffffff"
    document.getElementById("col2BgColor").value = state.colors.col2Bg || "#ffffff"
    document.getElementById("col2TextColor").value = state.colors.col2Text || "#2c3e50"
  }

  toggleColumn2ColorPickers(state.sameColors)

  // Update column balance display
  const rightColumn = 100 - state.columnBalance
  document.getElementById("columnBalanceValue").textContent = `${state.columnBalance}% / ${rightColumn}%`
}
