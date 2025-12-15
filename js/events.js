/* ===========================================
   EVENTS
   Event listeners setup
   =========================================== */

/**
 * Toggle column 2 color pickers visibility
 */
function toggleColumn2ColorPickers(hide) {
  const col2BgLabel = document.getElementById("col2BgLabel")
  const col2TextLabel = document.getElementById("col2TextLabel")

  if (hide) {
    col2BgLabel.classList.add("hidden")
    col2TextLabel.classList.add("hidden")
  } else {
    col2BgLabel.classList.remove("hidden")
    col2TextLabel.classList.remove("hidden")
  }
}

/**
 * Load all event listeners
 */
function loadEventListeners() {
  // Personal info
  document.getElementById("firstName").addEventListener("input", (e) => {
    state.firstName = e.target.value
    updatePreview()
  })

  document.getElementById("lastName").addEventListener("input", (e) => {
    state.lastName = e.target.value
    updatePreview()
  })

  document.getElementById("jobTitle").addEventListener("input", (e) => {
    state.jobTitle = e.target.value
    updatePreview()
  })

  document.getElementById("email").addEventListener("input", (e) => {
    state.email = e.target.value
    updatePreview()
  })

  document.getElementById("phone").addEventListener("input", (e) => {
    state.phone = e.target.value
    updatePreview()
  })

  document.getElementById("linkedin").addEventListener("input", (e) => {
    state.linkedin = e.target.value
    updatePreview()
  })

  document.getElementById("address").addEventListener("input", (e) => {
    state.address = e.target.value
    updatePreview()
  })

  document.getElementById("introduction").addEventListener("input", (e) => {
    state.introduction = e.target.value
    updatePreview()
  })

  // Colors
  document.getElementById("headerBgColor").addEventListener("input", (e) => {
    state.colors.headerBg = e.target.value
    updatePreview()
  })

  document.getElementById("headerTextColor").addEventListener("input", (e) => {
    state.colors.headerText = e.target.value
    updatePreview()
  })

  document.getElementById("introBgColor").addEventListener("input", (e) => {
    state.colors.introBg = e.target.value
    updatePreview()
  })

  document.getElementById("introTextColor").addEventListener("input", (e) => {
    state.colors.introText = e.target.value
    updatePreview()
  })

  document.getElementById("col1BgColor").addEventListener("input", (e) => {
    state.colors.col1Bg = e.target.value
    updatePreview()
  })

  document.getElementById("col1TextColor").addEventListener("input", (e) => {
    state.colors.col1Text = e.target.value
    updatePreview()
  })

  document.getElementById("col2BgColor").addEventListener("input", (e) => {
    state.colors.col2Bg = e.target.value
    updatePreview()
  })

  document.getElementById("col2TextColor").addEventListener("input", (e) => {
    state.colors.col2Text = e.target.value
    updatePreview()
  })

  // Options
  document.getElementById("showReference").addEventListener("change", (e) => {
    state.showReference = e.target.checked
    updatePreview()
  })

  document.getElementById("sameColors").addEventListener("change", (e) => {
    state.sameColors = e.target.checked
    toggleColumn2ColorPickers(state.sameColors)
    updatePreview()
  })

  document.getElementById("exportToImg").addEventListener("change", (e) => {
    state.exportToImg = e.target.checked
  })

  document.getElementById("columnBalance").addEventListener("input", (e) => {
    state.columnBalance = Number.parseInt(e.target.value)
    const rightColumn = 100 - state.columnBalance
    document.getElementById("columnBalanceValue").textContent = `${state.columnBalance}% / ${rightColumn}%`
    updatePreview()
  })

  document.getElementById("language").addEventListener("change", (e) => {
    state.language = e.target.value
    updatePreview()
  })

  // Font sizes
  document.getElementById("fontGlobal").addEventListener("input", (e) => {
    state.fontSizes.global = Number.parseFloat(e.target.value)
    document.getElementById("fontGlobalValue").textContent = `${state.fontSizes.global.toFixed(2)}x`
    updatePreview()
  })

  document.getElementById("fontSectionTitle").addEventListener("input", (e) => {
    state.fontSizes.sectionTitle = Number.parseFloat(e.target.value)
    document.getElementById("fontSectionTitleValue").textContent = `${state.fontSizes.sectionTitle.toFixed(2)}x`
    updatePreview()
  })

  document.getElementById("fontSubsectionTitle").addEventListener("input", (e) => {
    state.fontSizes.subsectionTitle = Number.parseFloat(e.target.value)
    document.getElementById("fontSubsectionTitleValue").textContent = `${state.fontSizes.subsectionTitle.toFixed(2)}x`
    updatePreview()
  })

  document.getElementById("fontLabel").addEventListener("input", (e) => {
    state.fontSizes.label = Number.parseFloat(e.target.value)
    document.getElementById("fontLabelValue").textContent = `${state.fontSizes.label.toFixed(2)}x`
    updatePreview()
  })

  document.getElementById("fontDescription").addEventListener("input", (e) => {
    state.fontSizes.description = Number.parseFloat(e.target.value)
    document.getElementById("fontDescriptionValue").textContent = `${state.fontSizes.description.toFixed(2)}x`
    updatePreview()
  })

  document.getElementById("bulletImageInput").addEventListener("change", (e) => {
    uploadTimelineImage("bullet", e.target.files[0])
  })

  document.getElementById("dashImageInput").addEventListener("change", (e) => {
    uploadTimelineImage("dash", e.target.files[0])
  })

  // Import
  document.getElementById("importJson").addEventListener("change", importJSON)

  updateTimelineImagePreviews()
}
