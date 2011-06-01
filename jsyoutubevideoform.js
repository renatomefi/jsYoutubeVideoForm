
/**
 * Cria o objeto para tratamento de videos do youtube
 * 
 * @param {string} inputUrl Seletor do campo da url do video
 * @param {string} inputTitle Seletor do input usado como título
 * @param {string} inputDesc Seletor do input usado para descrição do video
 * @param {string} inputThumb Seletor do input usado para guardar a url da imagem selecionada
 */
var youtubeVideoForm = window.youtubeVideoForm = function(inputUrl, inputTitle, inputDesc, inputThumb){
                 
               
    /**
     * Ultima url chamada, para evitar chamadas duplicadas
     */
    var _lastUrl =  ''; 
               
    /**
     * Elemento que recebe a url do video
     *
     * @type DOMElement
     */
    var _inputUrl = null;
               
    /**
     * Input que recebe o titulo do vídeo
     *
     * @type DOMElement
     */
    var _inputTitle = null;
               
    /**
     * Input que recebe a descrição do video
     *
     * @type DOMElement
     */
    var _inputDesc = null;
               
    /**
     * Input que guardará a url da miniatura selecionada
     *
     * @type DOMElement
     */
    var _inputThumb = null;
               
    /**
     * container usado para exibir os thumbnails do vídeo
     *
     * @type DOMElement
     */
    var _containerThumbs = null;
               
    /**
     * Iframe que será usado para exibir o video do usuário
     *
     * @type DOMElement
     */
    var _iframeVideo = null;
               
               
    /**
     * Seta a url do thumbnail selecionado
     */
    function setSelectedThumb(src){
        if(_inputThumb)
            _inputThumb.value = src;
    }
    
    /**
     * Faz o parsing das miniaturas do video
     *
     * @param {array} thumbs
     * @type null
     */
    function parseThumbNails(thumbs){        
        if(_containerThumbs ){
            _containerThumbs.innerHTML = '';
            for(var i in thumbs){
                var thumb = thumbs[i];
                try{
                    if(thumb.yt$name != 'hqdefault'){ 
                        var url = thumb.url;
                    
                        var spanThumb = document.createElement('span');
                        var spanTime = document.createElement('span');
                        var imageThumb = document.createElement('img');
                    
                        if(thumb.yt$name == 'default'){
                            setSelectedThumb(url);
                            spanThumb.className = 'youtube-video-thumb selected';                                     
                        }else{
                            spanThumb.className = 'youtube-video-thumb';
                        }
                    
                        spanTime.innerHTML = thumb.time;
                        imageThumb.setAttribute('src',thumb.url );
                        imageThumb.setAttribute('height',thumb.height );
                        imageThumb.setAttribute('width',thumb.width );
                    
                        spanThumb.setAttribute('data-url', url);
                        spanThumb.appendChild(imageThumb);
                        spanThumb.appendChild(spanTime);
                   
                               
                        spanThumb.onclick = function(){ 
                            var url = this.getAttribute('data-url');
                            setSelectedThumb(url);
                            if (_containerThumbs.hasChildNodes())
                            {
                                var children = _containerThumbs.childNodes;
                                for (var b = 0; b < children.length; b++)                            
                                    children[b].className = 'youtube-video-thumb';                            
                            }
                            this.className = 'youtube-video-thumb selected';          
                        };
                        _containerThumbs.appendChild(spanThumb);
                    }
                }catch(e){
                           
                }
            }
        }        
    }
    /**
     * Trata os dados e exibe o video,modifica tambem os campos dos formulários
     * 
     * @param {json} jsonInfo Resultado obtido do youtube
     * @param {string} videoId Link que o usuario digitou no campo
     */
    function parseVideoInfo(jsonInfo,videoId){
        try{
            //Verificando se os dados estão corretos
            if(!!jsonInfo.entry){
                var videoTitle = jsonInfo.entry.title.$t;
                var videoDesc = jsonInfo.entry.media$group.media$description.$t;
                var videoThumbs = jsonInfo.entry.media$group.media$thumbnail;
               
                _inputTitle.value = videoTitle;
                _inputDesc.value = videoDesc;
               
                if( _iframeVideo){
                    var url = 'http://www.youtube.com/embed/'+videoId+'?fs=1&autoplay=1&loop=0';
                    _iframeVideo.src = url;
                    _iframeVideo.width = 320;
                    _iframeVideo.height = 195;
                }
                                                     
                parseThumbNails(videoThumbs);
                     
            }                     
        }catch(e){
                   
        }             
               
    }
    
    
    /**
     * Obtém as informações do video da API do youtube
     * 
     * @param {string} videoId Link que o usuário digitou no campo
     */
    function getVideoInfo(videoId) {    
        var http_request = null;
        //activeX versions to check for in IE
        var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] 
        //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        if (window.ActiveXObject){
            for (var i=0; i<activexmodes.length; i++){
                try{
                    http_request =  new ActiveXObject(activexmodes[i])
                }
                catch(e){
                //suppress error
                }
            }
        } else if (window.XMLHttpRequest) {
            // if Mozilla, Safari etc
            http_request =  new XMLHttpRequest();
        }
        
        if(!http_request){
            return;
        }
        
        http_request.onreadystatechange = function(){
            
            if (http_request.readyState == 4 && (http_request.status == 200  || http_request.status == 0)){
                var responseText = http_request.responseText;
                var jsonInfo = null;
                jsonInfo = eval('(' + responseText + ')');
                
                                
                if(jsonInfo)
                    parseVideoInfo(jsonInfo,videoId)
                
            }
        }

        http_request.open("GET", "http://gdata.youtube.com/feeds/api/videos/"+videoId+"?v=2&alt=json", true);
        http_request.send(null);
    }
    
    /**
     * Inicializa o objeto
     */
    function _init(){               
        (inputUrl) && (_inputUrl = document.getElementById(inputUrl));
        (inputTitle) && (_inputTitle = document.getElementById(inputTitle));
        (inputDesc) && (_inputDesc = document.getElementById(inputDesc));
        (inputThumb) && (_inputThumb = document.getElementById(inputThumb));
               
        if(!_inputUrl || !_inputTitle || !_inputDesc ){
            return ;
        }
           
        //Adicionando eventos ao input de url        
        _inputUrl.onblur = function(){ 
            
            var url = this.value;
                       
            if(url != '' && _lastUrl != url){
                //Atualiza o lastUrl
                _lastUrl = url;
                
                // Tratando uma url do youtube
                // Geralmente http://www.youtube.com/watch?v=U15r79CqFtU          
                var videoId = url;
                
                videoId = videoId.split('v=',2);
                
                if(videoId.length > 1){
                    videoId = videoId[1];
                } else{
                    videoId = videoId[0];
                }                       
                videoId = videoId.split('&',1)[0];
                videoId = videoId.split('=',1)[0];
                
                if(videoId){
                    getVideoInfo(videoId);
                }
                
            }
        }
    } 
    
    _init();
    
    /**
     * Seta o iframe usado para exibir a visualização do video 
     * 
     * @param {string} iframeId Id do iframe
     */
    function _setIframePreview(iframeId){
        if(iframeId){
            _iframeVideo = document.getElementById(iframeId);
        }
        return this;
    }
    /**
     * Seta o container usado para para abrigar as miniaturas do video
     * 
     * @param {string} containerId Id do container que abriga as miniaturas
     */
    function _setContainerThumbs(containerId){
        if(containerId){
            _containerThumbs = document.getElementById(containerId)
        }
        return this;
    }
    
    /**
     * Métodos publicos
     */
    var self = {
        setIframePreview : _setIframePreview,
        setContainerThumbs : _setContainerThumbs
    }
    
    return self;
};

