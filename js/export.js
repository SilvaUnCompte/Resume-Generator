/* ===========================================
  EXPORT
  PDF and JSON export functions
  =========================================== */

/**
 * Export Resume as PDF
 */
async function exportPDF() {
  const element = document.getElementById("resumePreview")

  if (state.selectablePdf) {
    await exportSelectablePDF(element)
  } else {
    await exportImagePDF(element)
  }
}

/**
 * Export PDF as image (non-selectable text)
 */
async function exportImagePDF(element) {
  try {
    const clone = element.cloneNode(true)
    const indicators = clone.querySelectorAll(".resume-page-limit-line, .resume-page-limit-label, .resume-overflow-indicator")
    indicators.forEach((el) => el.remove())

    // Set fixed dimensions for A4
    clone.style.width = "210mm"
    clone.style.height = "297mm"
    clone.style.overflow = "hidden"

    // Temporarily append clone to body for rendering
    clone.style.position = "absolute"
    clone.style.left = "-9999px"
    document.body.appendChild(clone)

    const canvas = await window.html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: clone.offsetWidth,
      height: clone.offsetHeight,
    })

    // Remove clone
    document.body.removeChild(clone)

    const imgData = canvas.toDataURL("image/png", 1.0)
    const pdf = new window.jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    pdf.addImage(imgData, "PNG", 0, 0, 210, 297)
    pdf.save("resume.pdf")
  } catch (error) {
    console.error("PDF export error:", error)
    alert("Error exporting PDF. Please try again.")
  }
}

/**
 * Export PDF with selectable text
 */
async function exportSelectablePDF(element) {
  try {
    const clone = element.cloneNode(true)
    const indicators = clone.querySelectorAll(".resume-page-limit-line, .resume-page-limit-label, .resume-overflow-indicator")
    indicators.forEach((el) => el.remove())

    // Set fixed height for single page
    clone.style.width = "210mm"
    clone.style.height = "297mm"
    clone.style.overflow = "hidden"

    // Temporarily append clone to body for rendering
    clone.style.position = "absolute"
    clone.style.left = "-9999px"
    document.body.appendChild(clone)

    const pdf = new window.jspdf.jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    await pdf.html(clone, {
      callback: (pdf) => {
        document.body.removeChild(clone)
        pdf.save("resume.pdf")
      },
      x: 0,
      y: 0,
      width: 210,
      windowWidth: clone.scrollWidth,
      html2canvas: {
        scale: 0.264583,
        useCORS: true,
        logging: false,
      },
    })
  } catch (error) {
    console.error("Selectable PDF export error:", error)
    const clone = document.querySelector('[style*="-9999px"]')
    if (clone) document.body.removeChild(clone)
    alert("Error exporting selectable PDF. Try disabling the selectable text option.")
  }
}

/**
 * Export configuration as JSON
 */
function exportJSON() {
  const dataStr = JSON.stringify(state, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = "resume-data.json"
  link.click()
  URL.revokeObjectURL(url)
}
