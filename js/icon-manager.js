/* ====================================================
   ICONS MANAGEMENT - Timeline images upload and reset
   ==================================================== */


   
// ============================= Timeline images management =============================

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

// ============================= Profile photo management =============================

function uploadProfilePhoto(file) {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    state.profilePhoto = e.target.result
    updateProfilePhotoPreview()
    updatePreview()
  }
  reader.readAsDataURL(file)
}

function resetProfilePhoto() {
  state.profilePhoto = null
  updateProfilePhotoPreview()
  updatePreview()
}

function updateProfilePhotoPreview() {
  const previewDiv = document.getElementById("profilePhotoPreview")
  const resetBtn = document.getElementById("profilePhotoResetBtn")
  const sizeLabel = document.getElementById("profilePhotoSizeLabel")

  if (state.profilePhoto) {
    previewDiv.innerHTML = `<img src="${state.profilePhoto}" alt="Profile photo">`
    resetBtn.style.display = "inline-block"
    sizeLabel.style.display = "flex"
  } else {
    previewDiv.innerHTML = '<span class="no-photo">No photo</span>'
    resetBtn.style.display = "none"
    sizeLabel.style.display = "none"
  }
}