let PDFJS = window['pdfjs-dist/build/pdf'];

    function loadPDFJS(pageUrl) {
      PDFJS.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.js';
      var currentPage = 1;
      var pages = [];
      var globalPdf = null;
      var container = document.getElementById('rules');
      function renderPage(page) {
        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.createElement('canvas');

        let scale = 1.5
        let viewport = page.getViewport({scale: scale});
        // append the created canvas to the container
        container.appendChild(canvas);
        // Get context of the canvas
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        //
        // Render PDF page into canvas context
        //
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext).then(function () {
          if (currentPage < globalPdf.numPages) {
            pages[currentPage] = canvas;
            currentPage++;
            globalPdf.getPage(currentPage).then(renderPage);
          } else {
                // Callback function here, which will trigger when all pages are loaded
              }
            });
      }
      PDFJS.getDocument(pageUrl).then(function (pdf) {
        if(!globalPdf){
          globalPdf = pdf;
        }
        pdf.getPage(currentPage).then(renderPage);
      });
    }
    loadPDFJS("resources/rules.pdf");