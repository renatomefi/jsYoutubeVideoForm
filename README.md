js Youtube Video Form


============================
jsYoutubeVideoForm is an simple script for load info of any youtube video and show it in a form using jQuery.

jsYoutubeVideoForm é um script simples para carregar as informações de um video do youtube e exibi-las em um formulário.
 
Features
--------

* Use full youtube link or video code only

Using
--------------------

1) Create object passing id of inputs

    videoTest = new youtubeVideoForm('input-url','input-title','input-desc','input-thumb-url');


2) If you want to view thumbnails and preview of the video, pass their ids to the created object.

    videoTest.setIframePreview('iframe-preview').setContainerThumbs('element-thumbs-container');


Getting the code
----------------

jsYoutubeVideoForm is a community project. The Ace source code is hosted on GitHub.

    git clone git://github.com/nidorx/jsYoutubeVideoForm.git
    cd jsYoutubeVideoForm
    git submodule update --init --recursive



