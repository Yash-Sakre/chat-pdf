import React from 'react'

function PdfViewer({fileUrl}:{fileUrl:string | undefined}) {
  return (
    <div>
        <embed src={fileUrl + "#toolbar=0"} height="100vh-60px" width="100%" className='h-[calc(100vh-60px)] bg-black'></embed>
    </div>
  )
}

export default PdfViewer