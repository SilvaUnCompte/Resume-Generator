/* ====================================================
   ICONS MANAGEMENT - Timeline images upload and reset
   ==================================================== */

function uploadTimelineImage(type, file) {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    state.timelineImages[type] = e.target.result
    updateTimelineImagePreviews()
    updatePreview()
  }
  reader.readAsDataURL(file)
}

function resetTimelineImage(type) {
  state.timelineImages[type] = null
  updateTimelineImagePreviews()
  updatePreview()
}

function updateTimelineImagePreviews() {
  const bulletImg = document.getElementById("bulletPreviewImg")
  const dashImg = document.getElementById("dashPreviewImg")
  const bulletResetBtn = document.getElementById("bulletResetBtn")
  const dashResetBtn = document.getElementById("dashResetBtn")

  bulletImg.src = state.timelineImages.bullet || DEFAULT_TIMELINE_IMAGES.bullet
  dashImg.src = state.timelineImages.dash || DEFAULT_TIMELINE_IMAGES.dash

  bulletResetBtn.style.display = state.timelineImages.bullet ? "inline-block" : "none"
  dashResetBtn.style.display = state.timelineImages.dash ? "inline-block" : "none"
}

function updateTimelineIconPosition(value) {
  state.timelineIconPosition = value
  updatePreview()
}