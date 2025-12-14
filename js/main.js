/* ===========================================
   MAIN
   Application initialization
   =========================================== */

/**
 * Initialize the application
 */
function init() {
  loadEventListeners()
  addSkillGroup()
  addInterest()
  addEducation()
  addExperience()
  updatePreview()
  toggleColumn2ColorPickers(state.sameColors)
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init)
