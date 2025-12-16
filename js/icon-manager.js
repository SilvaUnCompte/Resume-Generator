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
    const img = new Image()
    img.onload = () => {
      const srcW = img.naturalWidth || img.width
      const srcH = img.naturalHeight || img.height
      if (!srcW || !srcH) {
        // Fallback: keep original if dimensions unavailable
        state.profilePhoto = e.target.result
        updateProfilePhotoPreview()
        updatePreview()
        return
      }

      // Center-crop to a square (object-fit: cover equivalent)
      const side = Math.min(srcW, srcH)
      const sx = Math.floor((srcW - side) / 2)
      const sy = Math.floor((srcH - side) / 2)

      const canvas = document.createElement('canvas')
      canvas.width = side
      canvas.height = side
      const ctx = canvas.getContext('2d')
      if (ctx && ctx.imageSmoothingQuality) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side)

      // Preserve original MIME when possible (jpeg/png), default to PNG
      const mime = (file.type && /image\/(png|jpeg|jpg)/i.test(file.type)) ? file.type : 'image/png'
      const quality = mime === 'image/jpeg' ? 0.92 : 1.0
      const dataUrl = canvas.toDataURL(mime, quality)

      state.profilePhoto = dataUrl
      updateProfilePhotoPreview()
      updatePreview()
    }
    img.src = e.target.result
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