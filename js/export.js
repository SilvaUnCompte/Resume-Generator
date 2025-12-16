/* ===========================================
  EXPORT: PDF and JSON export functions
  =========================================== */

// ================== CONSTANTS ==================
const PDF_CONFIG = {
  PX_TO_MM: 0.264583,      // 96 DPI conversion
  PX_TO_PT: 0.75,          // Font size conversion
  FONT_BASELINE_OFFSET: 0.352778, // Vertical text adjustment
  FONT_WIDTH_MARGIN: 0.6,  // Width margin for Helvetica vs Arial difference
  PAGE_WIDTH: 210,          // A4 width in mm
  PAGE_HEIGHT: 297,         // A4 height in mm
  FONT_FAMILY: 'helvetica', // Force font family for all text
}

// =============== UTILITY FUNCTIONS ===============

/**
 * Parse RGB string and convert to array
 * @param {string} rgbString - RGB color string (e.g., "rgb(255, 0, 0)")
 * @returns {number[]} [r, g, b] values
 */
function rgbToArray(rgbString) {
  const match = rgbString.match(/\d+/g)
  if (!match) return [0, 0, 0]
  return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])]
}

/**
 * Clone and prepare resume element for export
 * @param {HTMLElement} element - Resume element to clone
 * @returns {HTMLElement} Prepared clone
 */
function prepareCloneForExport(element) {
  const clone = element.cloneNode(true)

  // Remove UI indicators (page limits, overflow indicators)
  const indicators = clone.querySelectorAll(
    ".resume-page-limit-line, .resume-page-limit-label, .resume-overflow-indicator"
  )
  indicators.forEach((el) => el.remove())

  // Set A4 dimensions
  clone.style.width = `${PDF_CONFIG.PAGE_WIDTH}mm`
  clone.style.height = `${PDF_CONFIG.PAGE_HEIGHT}mm`
  clone.style.overflow = "hidden"
  clone.style.position = "absolute"
  clone.style.left = "-9999px"

  return clone
}

/**
 * Determine font style for jsPDF
 * @param {string} fontWeight - CSS font-weight value
 * @param {string} fontStyle - CSS font-style value
 * @returns {string} jsPDF font style
 */
function getFontStyle(fontWeight, fontStyle) {
  if (fontWeight === 'bold' && fontStyle === 'italic') return 'bolditalic'
  if (fontWeight === 'bold') return 'bold'
  if (fontStyle === 'italic') return 'italic'
  return 'normal'
}

/**
 * Calculate text alignment and position for centered elements
 * @param {HTMLElement} element - DOM element
 * @param {number} x - Element X position in pixels
 * @param {number} y - Element Y position in pixels
 * @param {number} width - Element width in mm
 * @param {CSSStyleDeclaration} styles - Computed styles
 * @returns {Object} Position and alignment data
 */
function calculateTextLayout(element, x, y, width, styles) {
  let elementX = x * PDF_CONFIG.PX_TO_MM
  let elementY = y * PDF_CONFIG.PX_TO_MM
  let elementHeight = element.getBoundingClientRect().height * PDF_CONFIG.PX_TO_MM
  let align = element.tagName === 'SPAN' ? 'left' : styles.textAlign
  let centerVertically = false

  if (element.classList.contains('centered-export')) {
    align = 'center'
    centerVertically = true
    elementX = elementX + (width / 2)
    elementY = elementY + (elementHeight / 2)
  }

  return { elementX, elementY, elementHeight, align, centerVertically }
}

/**
 * Extract text element data from cloned resume
 * @param {HTMLElement} clone - Cloned resume element
 * @returns {Object[]} Array of text element data objects
 */
function extractTextElements(clone) {
  const textElements = clone.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, div')
  const cloneRect = clone.getBoundingClientRect()
  const textData = []

  textElements.forEach((el) => {
    // Clone element to preserve original and replace <br> with \n
    const tempEl = el.cloneNode(true)
    tempEl.innerHTML = tempEl.innerHTML.replace(/<br\s*\/?>/gi, '\n')
    const text = tempEl.textContent.trim()
    if (!text) return

    // Skip elements with children (except specific patterns)
    if (el.children.length > 0) {
      const onlySpanChild = el.children.length === 1 && el.children[0].tagName === 'SPAN'
      if (!onlySpanChild && !el.tagName.match(/^(H[1-6]|P)$/)) return
    }

    const rect = el.getBoundingClientRect()
    const styles = window.getComputedStyle(el)
    const originalColor = styles.color

    const x = rect.left - cloneRect.left
    const y = rect.top - cloneRect.top
    const widthMm = rect.width * PDF_CONFIG.PX_TO_MM + PDF_CONFIG.FONT_WIDTH_MARGIN

    // Get border styling
    const borderBottomWidth = parseFloat(styles.borderBottomWidth) || 0

    // Calculate layout (position, alignment, centering)
    const layout = calculateTextLayout(el, x, y, widthMm, styles)

    textData.push({
      text,
      x: layout.elementX,
      y: layout.elementY,
      height: layout.elementHeight,
      fontSize: parseFloat(styles.fontSize) * PDF_CONFIG.PX_TO_PT,
      fontWeight: styles.fontWeight === 'bold' || parseInt(styles.fontWeight) >= 700 ? 'bold' : 'normal',
      fontStyle: styles.fontStyle,
      color: originalColor,
      width: widthMm,
      align: layout.align,
      centerVertically: layout.centerVertically,
      borderBottomWidth: borderBottomWidth * PDF_CONFIG.PX_TO_MM,
      borderBottomStyle: styles.borderBottomStyle,
      borderBottomColor: styles.borderBottomColor,
    })

    // Make text invisible for screenshot (preserve visual styling)
    el.style.color = 'transparent'
  })

  return textData
}

/**
 * Render text elements onto PDF
 * @param {jsPDF} pdf - jsPDF instance
 * @param {Object[]} textData - Array of text element data
 */
function renderTextOnPDF(pdf, textData) {
  // Force font family at the beginning
  pdf.setFont(PDF_CONFIG.FONT_FAMILY, 'normal')

  textData.forEach((item) => {
    pdf.setFontSize(item.fontSize)
    // Always use PDF_CONFIG.FONT_FAMILY, ignore CSS font-family
    pdf.setFont(PDF_CONFIG.FONT_FAMILY, getFontStyle(item.fontWeight, item.fontStyle))

    // Set text color
    const rgb = rgbToArray(item.color)
    pdf.setTextColor(rgb[0], rgb[1], rgb[2])

    // Calculate Y position (adjust for centered vs normal text)
    const textY = item.centerVertically ? item.y : item.y + item.fontSize * PDF_CONFIG.FONT_BASELINE_OFFSET

    // Add text with proper alignment
    const textOptions = {
      maxWidth: item.width,
      align: item.align === 'center' ? 'center' : item.align === 'right' ? 'right' : 'left',
    }

    pdf.text(item.text, item.x, textY, textOptions)

    // Render border-bottom if present
    if (item.borderBottomWidth > 0 && item.borderBottomStyle !== 'none' && item.borderBottomColor) {
      const borderRgb = rgbToArray(item.borderBottomColor)
      pdf.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2])
      pdf.setLineWidth(item.borderBottomWidth)
      const yLine = item.y + item.height - (item.borderBottomWidth / 2)
      pdf.line(item.x, yLine, item.x + item.width, yLine)
    }
  })
}

/**
 * Get PDF filename
 * @returns {string} Filename with first and last name
 */
function getPDFFilename() {
  return `${state.firstName} ${state.lastName} Resume.pdf`
}

// ============================== MAIN EXPORT FUNCTIONS ==============================

let loaderCount = 0;
const loader = document.getElementById("exportLoader");

/**
 * Export Resume as PDF
 */
async function exportPDF() {
  await loaderShow();
  // Add delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const element = document.getElementById("resumePreview")
  if (state.exportToImg) {
    await exportImagePDF(element)
  } else {
    await exportSelectablePDF(element)
  }
}

/**
 * Export PDF as image (non-selectable text)
 */
async function exportImagePDF(element) {
  try {
    const clone = prepareCloneForExport(element)
    document.body.appendChild(clone)

    const canvas = await window.html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#000000ff",
      width: clone.offsetWidth,
      height: clone.offsetHeight,
    })

    document.body.removeChild(clone)

    const imgData = canvas.toDataURL("image/png", 1.0)
    const pdf = new window.jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    pdf.addImage(imgData, "PNG", 0, 0, PDF_CONFIG.PAGE_WIDTH, PDF_CONFIG.PAGE_HEIGHT)
    pdf.save(getPDFFilename())

    loaderHide(); // <===== Hide loader on success
  } catch (error) {
    console.error("PDF export error:", error)
    loaderHide(); // <===== Hide loader on error
    alert("Error exporting PDF. Please try again.")
  }
}

/**
 * Export PDF with selectable text
 * Uses hybrid approach: background image + overlaid vector text
 */
async function exportSelectablePDF(element) {
  let clone = null
  try {
    // Step 1: Prepare clone and extract text
    clone = prepareCloneForExport(element)
    document.body.appendChild(clone)

    const textData = extractTextElements(clone)

    // Step 2: Render visual background with transparent text
    const canvas = await window.html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: state.colors.col1Bg || "#000000ff",
      width: clone.offsetWidth,
      height: clone.offsetHeight,
    })

    document.body.removeChild(clone)
    clone = null

    // Step 3: Create PDF with image and text layers
    const imgData = canvas.toDataURL("image/png", 1.0)
    const pdf = new window.jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    pdf.addImage(imgData, "PNG", 0, 0, PDF_CONFIG.PAGE_WIDTH, PDF_CONFIG.PAGE_HEIGHT)

    // Step 4: Render selectable text on top
    renderTextOnPDF(pdf, textData)

    pdf.save(getPDFFilename())
    loaderHide(); // <===== Hide loader on success
  } catch (error) {
    console.error("Selectable PDF export error:", error)
    loaderHide(); // <===== Hide loader on error
    if (clone) document.body.removeChild(clone)
    alert("Error exporting selectable PDF. Try with the export to image option.")
  }
}

/**
 * Export configuration as JSON
 */
function exportJSON() {
  loaderShow();

  const dataStr = JSON.stringify(state, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = "resume-data.json"
  link.click()

  URL.revokeObjectURL(url)
  loaderHide();
}

// ============================= LOADER FUNCTIONS ==============================
function loaderShow() {
  loaderCount++;
  loader.style.display = "block";
}

function loaderHide() {
  loaderCount--;
  if (loaderCount <= 0) {
    loader.style.display = "none";
    loaderCount = 0;
  }
}