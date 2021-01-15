import { saveAs } from 'file-saver'

type ExportFileType = {
  fileName: string
  content: string
}

export default function ({
  fileName,
  content
}: ExportFileType) {
  if (!fileName) {
    fileName = `crud-${+new Date()}.vue`
  }
  if (!fileName.endsWith('.vue')) {
    fileName = `${fileName}.vue`
  }
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, fileName)
}
