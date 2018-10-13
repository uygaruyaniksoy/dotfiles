var fn_addin=function(l,a,e){var d=d||{};return d.styles=d.styles||{},d.commands=d.commands||{},d.dependencies=e||d.dependencies||{},d.styles.style=function(){},d.views=d.views||{},d.collect=d.collect||{},d.models=d.models||{},d.templates=d.templates||{},d.info={widget:!0,placeholderType:"metric",id:"bookmarks",region:"top-bar",order:"prepend",addin:"e80e5480-46a1-4329-a06c-fc90eecb820c",commands:["settings.enableBookmarks"],visibleSetting:"bookmarksVisible"},l.console.log(l.elapsed()+": "+d.info.id+" started"),d.templates=d.templates||{},d.templates.bookmark=Handlebars.template({1:function(e,o,t,s){return"local"},3:function(e,o,t,s){var i;return'<span class="bookmark-label">'+this.escapeExpression("function"==typeof(i=null!=(i=o.title||(null!=e?e.title:e))?i:o.helperMissing)?i.call(e,{name:"title",hash:{},data:s}):i)+"</span>"},compiler:[6,">= 2.0.0-beta.1"],main:function(e,o,t,s){var i,a,n=o.helperMissing,r="function",l=this.escapeExpression;return'<a draggable="false" href="'+l(typeof(a=null!=(a=o.url||(null!=e?e.url:e))?a:n)===r?a.call(e,{name:"url",hash:{},data:s}):a)+'" title="'+l(typeof(a=null!=(a=o.tooltip||(null!=e?e.tooltip:e))?a:n)===r?a.call(e,{name:"tooltip",hash:{},data:s}):a)+'" class="bookmark '+l(typeof(a=null!=(a=o.classes||(null!=e?e.classes:e))?a:n)===r?a.call(e,{name:"classes",hash:{},data:s}):a)+" "+(null!=(i=o.if.call(e,null!=e?e.local:e,{name:"if",hash:{},fn:this.program(1,s,0),inverse:this.noop,data:s}))?i:"")+'"><img draggable="false" src="'+l(typeof(a=null!=(a=o.favicon_url||(null!=e?e.favicon_url:e))?a:n)===r?a.call(e,{name:"favicon_url",hash:{},data:s}):a)+'" class="bookmark-icon">'+(null!=(i=o.if.call(e,null!=e?e.title:e,{name:"if",hash:{},fn:this.program(3,s,0),inverse:this.noop,data:s}))?i:"")+"</a>\n"},useData:!0}),d.templates.bookmarkfolder=Handlebars.template({1:function(e,o,t,s){var i;return'<span class="bookmark-folder-label">'+this.escapeExpression("function"==typeof(i=null!=(i=o.label||(null!=e?e.label:e))?i:o.helperMissing)?i.call(e,{name:"label",hash:{},data:s}):i)+"</span>"},3:function(e,o,t,s){var i;return'<span class="bookmark-label">'+this.escapeExpression("function"==typeof(i=null!=(i=o.title||(null!=e?e.title:e))?i:o.helperMissing)?i.call(e,{name:"title",hash:{},data:s}):i)+"</span>"},compiler:[6,">= 2.0.0-beta.1"],main:function(e,o,t,s){var i,a,n=o.helperMissing,r="function",l=this.escapeExpression;return'<span draggable="false" class="bookmark toggle-folder main-button '+l(typeof(a=null!=(a=o.classes||(null!=e?e.classes:e))?a:n)===r?a.call(e,{name:"classes",hash:{},data:s}):a)+'" title="'+l(typeof(a=null!=(a=o.tooltip||(null!=e?e.tooltip:e))?a:n)===r?a.call(e,{name:"tooltip",hash:{},data:s}):a)+'">\n\t'+(null!=(i=o.unless.call(e,null!=e?e.title:e,{name:"unless",hash:{},fn:this.program(1,s,0),inverse:this.noop,data:s}))?i:"")+'\n\n\t\x3c!-- Folder icon --\x3e\n\t<svg draggable="false" class="bookmark-icon bookmark-icon-folder" xmlns="http://www.w3.org/2000/svg" width="510" height="510" viewBox="0 0 510 510"><path d="M204 51H51C22.95 51 0 73.95 0 102v306c0 28.05 22.95 51 51 51h408c28.05 0 51-22.95 51-51V153c0-28.05-22.95-51-51-51H255l-51-51z"/></svg>\x3c!--\n\n\t--\x3e'+(null!=(i=o.if.call(e,null!=e?e.title:e,{name:"if",hash:{},fn:this.program(3,s,0),inverse:this.noop,data:s}))?i:"")+'\n\n\t<ul class= "bookmarks-folder-list"></ul>\n</span>\n'},useData:!0}),d.templates.bookmarks=Handlebars.template({compiler:[6,">= 2.0.0-beta.1"],main:function(e,o,t,s){return'<div class="bookmarks-wrapper" style="left:0">\n\t<ul class="bookmarks-list" id="active-bookmarks">\n\t</ul>\n\t<ul class="bookmarks-list" id="active-bookmarks-alt">\n\t</ul>\n\t<div class="bookmarks-guide">\n\t\t<div class="bookmarks-guide-wrapper"><img src="/img/icon-pointer.svg" class="bookmarks-guide-icon"> Drag for more bookmarks</div>\n\t</div>\n</div>\n'},useData:!0}),d.templates.primer=Handlebars.template({compiler:[6,">= 2.0.0-beta.1"],main:function(e,o,t,s){var i;return'<div class="overlay-permissions-content">\n\t<div class="overlay-permissions-icon"><i class="icon-angle-up"></i></div>\n\t<div class="overlay-permissions-content-title">Would you like to see your bookmarks?</div>\n\t<div class="overlay-permissions-content-description">'+this.escapeExpression("function"==typeof(i=null!=(i=o.browser||(null!=e?e.browser:e))?i:o.helperMissing)?i.call(e,{name:"browser",hash:{},data:s}):i)+" requires your permission.</div>\n</div>\n"},useData:!0}),d.styles=d.styles||{},d.styles.style=function(){var e=document.createElement("style");e.type="text/css",e.innerHTML=".has-bookmarks-animating .apps,.has-bookmarks-animating .background,.has-bookmarks-animating .background-overlay{transition:top .5s ease}.bookmarks{text-shadow:none}.bookmarks-wrapper{height:30px;position:fixed;top:0;right:0;left:0;z-index:0;background-color:#fff;border-bottom:1px solid #b6b4b6;overflow:hidden;transform:translateY(-31px)}.show>.bookmarks-wrapper{transform:translateY(0)}.animating>.bookmarks-wrapper{transition:all .5s ease}.bookmarks-list{width:100%;padding:0 4px;position:fixed;list-style-type:none;overflow-x:hidden;-moz-appearance:none;opacity:0;overflow-y:hidden;transition:transform .25s ease,opacity .25s ease;white-space:nowrap}.bookmarks-hide-transition{transition:transform 0s ease,opacity .1s ease}.bookmarks li{margin:4px 1px;display:inline-block;vertical-align:top;color:#000;font-size:75%}.bookmarks li:last-child{margin-right:20px}.bookmarks .hidden{display:none}.bookmark{max-width:150px;padding:5px 5px 2px;position:relative;display:block;border-radius:2px;color:#000;cursor:pointer;line-height:125%;overflow:hidden;transition:background .2s ease;user-select:none;vertical-align:top}.bookmark-folder-label,.bookmarks-guide{position:absolute;left:0;right:0;top:0;bottom:0;text-align:center}.bookmark-back-button .icon-left,.bookmark-icon,.bookmark-label{display:inline-block;vertical-align:top}.bookmark:hover{background:rgba(0,0,0,.07)}.bookmark-icon{height:16px;width:16px;margin:-2px 0 0;line-height:16px;text-align:center}.bookmark-icon-folder{height:15px;width:15px;padding:1px;opacity:.35}.bookmark-label{max-width:120px;margin-left:5px;overflow:hidden;text-overflow:ellipsis}.bookmark-folder-label{z-index:2;color:#fff;font-size:8px;font-weight:500;line-height:25px}.bookmark-back-button{margin:0 4px;background:rgba(0,0,0,.06)}.bookmark-back-button .icon-left{margin-top:-2px;margin-left:1px;font-size:11px;opacity:.4}.bookmark-back-button .bookmark-icon-hide{opacity:.5}.bookmark-back-button:hover{background:rgba(0,0,0,.1)}.bookmark-back-button .bookmark-label{margin-top:-1px;margin-right:3px;font-weight:500;opacity:.7}.bookmarks-guide{z-index:101;display:none;cursor:pointer;font-size:12px;letter-spacing:1px;line-height:32px;transition:opacity .2s ease;user-select:none;vertical-align:top}.bookmarks-guide.active{display:block}.bookmarks-guide-wrapper{width:50%;margin:0 auto;background:rgba(255,255,255,.975);box-shadow:0 0 100px 100px #fff;color:#444}.bookmarks-guide-icon{height:32px;margin-top:1px;position:relative;left:-8px;vertical-align:top;animation:oscilr 1.1s infinite}@keyframes oscilr{50%{transform:translateX(10px)}}.bookmarks-placeholder{display:none}",document.getElementsByTagName("head")[0].appendChild(e)},d.commands.enableBookmarks=l.models.Command.extend({defaults:{id:"settings.enableBookmarks"},execute:function(e){var o=l.models.bookmarksSettings.permissions,t=e.callback,s=l.models.customization;if(s.get("bookmarksVisible"))return l.views.bookmarks.hidePopup(),s.save("bookmarksVisible",!1),void t();function i(){s.save("bookmarksVisible",!0),t()}!function(){try{getBrowser().bookmarks.get("1",function(){}),i()}catch(e){new d.views.BookmarksPrimer({permissions:o,callback:function(){i()}}).render()}}()}}),d.models.Bookmark=Backbone.Model.extend({defaults:function(){return{title:"New Link",url:"",id:0,parentId:0,index:0,local:!1}},saveOptions:function(){return this.collection.saveOptions},saveNewOrder:function(e){this.save({index:e},this.saveOptions())},comparator:"index"}),d.models.BookmarkFolder=Backbone.Model.extend({defaults:function(){return{title:"New Folder",id:0,parentId:0,children:[],index:0}},saveOptions:function(){return this.collection.saveOptions},saveNewOrder:function(e){this.save({index:e},this.saveOptions())},comparator:"index"}),d.views.Bookmark=Backbone.View.extend({tagName:"li",template:d.templates.bookmark,events:{"click a":"handleClick"},destroy:function(){this.remove(),this.unbind()},initialize:function(e){var o=this;this.parent=e.parent,this.bookmarksView=e.bookmarksView,setTimeout(function(){o.listenTo(o.model,"change",o.render),o.listenTo(o.model,"change:archive destroy",o.remove),o.listenTo(l.models.bookmarksSettings,"change:iconsOnly",o.render),o.listenTo(l.models.bookmarksSettings,"change:appsLocation",o.checkInclusion),o.listenTo(l.models.bookmarksSettings,"change:chromeTabLocation",o.checkInclusion),o.listenTo(l.models.bookmarksSettings,"change:includeBookmarks",o.checkInclusion)},1)},checkInclusion:function(){var e=l.models.bookmarksSettings;"apps"==this.model.get("momo_id")?this.$el.toggleClass("hidden","bookmarks"!=e.get("appsLocation")):"chromeTab"==this.model.get("momo_id")?this.$el.toggleClass("hidden","bookmarks"!=e.get("chromeTabLocation")):"bookmarks"==this.model.get("momo_id")&&this.$el.toggleClass("hidden",!e.get("includeBookmarks"))},render:function(){var e=this,o=l.utils.captionFormatter(this.model.get("title")),t=o;l.models.bookmarksSettings.get("iconsOnly")&&(t="");var s=this.model.get("url"),i=this.model.get("local"),a=new Image;this.model.get("img")?(a.src=this.model.get("img"),this.model.get("class")&&this.$el.addClass(this.model.get("class"))):isChrome()?a.src="chrome://favicon/size/16@2x/"+s:a.src=getFavIcon(s);var n={tooltip:o,title:t,url:s,local:i};return e.$el.html(e.template(n)),a.onload=function(){n.favicon_url=a.src,e.$el.html(e.template(n))},this.checkInclusion(),e},handleClick:function(e){return e.preventDefault(),this.bookmarksView.isDragging(e)||(l.models.bookmarksSettings.get("openInNewTab")||e.metaKey?getBrowser().tabs.create({url:e.currentTarget.href}):getBrowser().tabs.update({url:e.currentTarget.href})),!1},updateOnEnter:function(e){13==e.keyCode&&this.close(a(e.currentTarget).data("field"))}}),d.views.BookmarkFolder=Backbone.View.extend({tagName:"li",template:d.templates.bookmarkfolder,events:{"keypress .todo-input":"updateOnEnter"},destroy:function(){this.remove(),this.unbind()},initialize:function(e){var o=this;this.bookmarkViews=[],this.parent=e.parent,this.bookmarksView=e.bookmarksView,this.root=e.root,this.zIndex=e.zIndex,this.parentFolder=e.parentFolder,this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"change:archive destroy",this.remove),this.mainClickHandler=function(e){o.handleClick(e)},this.backClickHandler=function(e){o.handleBack(e)},this.listenTo(l.models.bookmarksSettings,"change:iconsOnly",this.render),this.listenTo(l.models.bookmarksSettings,"change:includeMostVisited",this.checkInclusion),this.listenTo(l.models.bookmarksSettings,"change:includeOtherBookmarks",this.checkInclusion)},render:function(){var e=this,o=l.utils.captionFormatter(this.model.get("title")),t=o,s=t.substring(0,1);l.models.bookmarksSettings.get("iconsOnly")&&(t=""),this.$el.css({zIndex:this.zIndex});var i={tooltip:o,title:t,label:s};return e.$el.html(e.template(i)),a(e.$el.find(".main-button")[0]).on("mouseup",e.mainClickHandler),this.checkInclusion(),e},checkInclusion:function(){var e=l.models.bookmarksSettings;"mostVisited"==this.model.get("momo_id")?this.$el.toggleClass("hidden",!e.get("includeMostVisited")):"other"==this.model.get("momo_id")&&this.$el.toggleClass("hidden",!e.get("includeOtherBookmarks"))},addFolder:function(e){var o=new d.views.BookmarkFolder({model:new d.models.BookmarkFolder(e),parent:this,bookmarksView:this.bookmarksView,root:this.root,zIndex:this.zIndex+1});this.bookmarkViews.push(o)},addOne:function(e){var o=new d.views.Bookmark({model:new d.models.Bookmark(e),bookmarksView:this.bookmarksView,parent:this});this.bookmarkViews.push(o)},handleBack:function(e){if(!this.isOpen)return!0;e.preventDefault(),e.stopPropagation(),this.isOpen=!1;return this.parent.loadBookmarks(-1*this.offset),!1},handleClick:function(e,o){if(this.isOpen||this.bookmarksView.isDragging(e))return!0;e&&2==e.which?this.model.get("children").forEach(function(e){e.url&&getBrowser().tabs.create({url:e.url,active:!1})}):(this.isOpen=!0,a(this.$el.find(".main-button")[0]).off("click",this.mainClickHandler),this.offset=this.$el.offset().left,this.loadBookmarks(o?0:this.offset))},loadBookmarks:function(e){var o=this;this.loaded||(this.bookmarkViews=[],this.model.get("children").forEach(function(e){e.children?o.addFolder(e):o.addOne(e)}),this.loaded=!0);var t=this.bookmarksView.getNewList(e);setTimeout(function(){t.append('<li><a href="#" class="bookmark bookmark-back-button active"><i class="icon icon-left"></i><span class="bookmark-label">'+o.model.get("title")+'</span>\x3c!--<span class="bookmark-icon bookmark-icon-hide">✕</span>--\x3e</a></li>'),a(".bookmark-back-button").on("click",o.backClickHandler),o.bookmarkViews.forEach(function(e){t.append(e.render().$el)}),o.bookmarksView.listLoaded(e)},5)}}),d.views.Bookmarks=Backbone.View.extend({attributes:{id:"bookmarks",class:"bookmarks"},template:d.templates.bookmarks,offline:!0,initialFetchStarted:!1,events:{mousedown:"mouseDown","mousedown .bookmarks-guide":"guided"},initialize:function(e){this.time=(new Date).getTime(),this.listToggle=!0,this.bookmarkViews=[],this.permissions=l.models.bookmarksSettings.permissions,this.renderedOnce=!1,this.mostVisited=[],this.render();var o=this;this.listenTo(l.models.customization,"change:bookmarksVisible",this.visibleChanged),this.listenTo(l.models.bookmarksSettings,"change",this.optionsChanged),this.listenTo(l,"bookmarks:toggle",this.handleHotKey);var t=a(window);t.on("mouseup",function(e){o.mouseUp(e)}),t.on("mousemove",function(e){o.mouseMove(e)})},render:function(){var e=(this.options.order||"append")+"To";this.$placeholder=a("<li></li>").addClass("placeholder"),this.$placeholder.appendTo(this.el),this.$placeholder.hide(),this.$el[e]("."+this.options.region).html(this.template());var o=this;return l.models.customization.get("bookmarksVisible")?null==getBrowser().topSites?(l.models.customization.save("bookmarksVisible",!1),localStorage.setItem("bookmarksEnabled",!1)):l.appsLoaded?(o.$el.addClass("animating"),this.showPopup(!0,!0)):(this.showPopup(!0,!1),setTimeout(function(){o.$el.addClass("animating")},500)):o.$el.addClass("animating"),this.renderedOnce=!0,this},destroy:function(){this.remove(),this.unbind()},optionsChanged:function(e){this.resetView=!0,e&&null!=e.changed.defaultMostVisited&&this.doFetchIfNeeded()},visibleChanged:function(e){localStorage.setItem("bookmarksEnabled",l.models.customization.get("bookmarksVisible")),this.toggleShow(l.models.customization.get("bookmarksVisible"))},doFetchIfNeeded:function(){this.initialFetchStarted?this.resetView&&(this.resetView=!1,this.loadBookmarks(0,!0,!0)):this.doFetch()},doFetch:function(){this.initialFetchStarted=!0,this.bookmarkViews&&_.each(this.bookmarkViews,function(e){e&&e.destroy()}),this.bookmarkViews=[];this.bookmarksAccess=!0,this.getBookmarks()},getBookmarks:function(e){this.loaded=!1,this.loadBookmarks(0,!0,!0,e)},guided:function(){this.$el.find(".bookmarks-guide").removeClass("active")},loadBookmarks:function(t,s,i,e){var a=this,n=function(e){a.bookmarks=e[0].children[0].children,a.otherBookmarks=e[0].children[1].children,a.loadTriggered||(l.trigger(d.info.id+":loaded"),a.loadTriggered=!0)};if(!this.bookmarks||s){a.mostVisited.length=0;var o=localStorage.getItem("bookmarks_mostVisited");null!=o&&0<o.length&&a.mostVisited.push.apply(a.mostVisited,JSON.parse(o));var r=localStorage.getItem("bookmarks_tree");null!=r&&0<r.length&&(n(JSON.parse(r)),a.showChildren(t,s,i)),getBrowser().topSites.get(function(e){var o=JSON.stringify(e);o!=localStorage.getItem("bookmarks_mostVisited")&&(a.mostVisited.length=0,a.mostVisited.push.apply(a.mostVisited,e),localStorage.setItem("bookmarks_mostVisited",o))}),getBrowser().bookmarks.getTree(function(e){var o=JSON.stringify(e);o!=localStorage.getItem("bookmarks_tree")&&(localStorage.setItem("bookmarks_tree",o),n(e),a.showChildren(t,s,i))})}else a.showChildren(t,!1,i)},getNewList:function(e){var o;(new Date).getTime();return this.listToggle=!this.listToggle,this.listToggle?(this.currentList=o=this.$el.find("#active-bookmarks"),this.oldList=this.$el.find("#active-bookmarks-alt")):(this.currentList=o=this.$el.find("#active-bookmarks-alt"),this.oldList=this.$el.find("#active-bookmarks")),o.html(""),o.css({"z-index":100,left:e+"px",opacity:1}),o},listLoaded:function(e){var o=this;this.oldList.addClass("bookmarks-hide-transition"),setTimeout(function(){o.oldList.css({"z-index":90,opacity:0}),o.currentList.css({transform:"translateX("+-1*e+"px)"})},5),setTimeout(function(){o.oldList.removeClass("bookmarks-hide-transition"),o.oldList.css({transform:"none"})},105),setTimeout(function(){var t=0;o.currentList.children().each(function(e,o){t+=a(o).width()}),t>o.$el.find(".bookmarks-wrapper").width()&&!l.models.bookmarksSettings.get("guided")&&setTimeout(function(){o.$el.find(".bookmarks-guide").addClass("active"),l.models.bookmarksSettings.set("guided",!0),l.models.bookmarksSettings.optionsChanged()},5)},400)},showChildren:function(e,o,t){var s=this,i=this.getNewList(e);if(!s.loaded||o){s.bookmarkViews=[];var a=s.addFolder({title:"Most Visited",momo_id:"mostVisited",children:s.mostVisited});if(l.models.bookmarksSettings.get("defaultMostVisited")&&t)return a.handleClick(null,!0),void(s.loaded=!1);isChrome()&&(s.addOne({url:"chrome-search://local-ntp/local-ntp.html",local:!0,title:"Chrome Tab",momo_id:"chromeTab",img:"img/icon-chrome.svg"}),s.addOne({url:"chrome://apps",local:!0,title:"Apps",momo_id:"apps"}),s.addOne({url:"chrome://bookmarks",local:!0,title:"Bookmarks",momo_id:"bookmarks"})),s.bookmarks.forEach(function(e){e.children?s.addFolder(e):s.addOne(e)}),s.addFolder({title:"Other",momo_id:"other",children:s.otherBookmarks}),s.loaded=!0}setTimeout(function(){s.bookmarkViews.forEach(function(e){i.append(e.render().$el),e.delegateEvents()})},1),s.listLoaded(e)},showAdd:function(e){e.preventDefault(),e.stopPropagation(),this.$el.find("#bookmarks-new-title").val(""),this.$el.find("#bookmarks-new-url").val(""),this.$el.find(".add").addClass("active"),this.$el.find(".bookmarks-new").toggle().find("#bookmarks-new-title").focus()},inputsClicked:function(e){e.stopPropagation()},addOne:function(e){var o=new d.views.Bookmark({model:new d.models.Bookmark(e),parent:this,bookmarksView:this});this.bookmarkViews.push(o)},addFolder:function(e){var o=new d.views.BookmarkFolder({model:new d.models.BookmarkFolder(e),parent:this,bookmarksView:this,root:this,zIndex:21});return this.bookmarkViews.push(o),o},toggleShow:function(e){0==e||!e&&this.$el.hasClass("show")?this.hidePopup():this.showPopup(!0,!0),setTimeout(function(){l.trigger("todolist:updateHeight")},20)},showPopup:function(e,o){this.showing=!0;var t=a("body");o&&t.addClass("has-bookmarks-animating");var s=this;setTimeout(function(){s.$el.addClass("show"),t.addClass("has-bookmarks"),setTimeout(function(){t.removeClass("has-bookmarks-animating")},500)},3),e&&this.doFetchIfNeeded()},hidePopup:function(e){if(this.showing=!1,this.$el.hasClass("show")){var o=this,t=a("body");t.addClass("has-bookmarks-animating"),setTimeout(function(){o.$el.removeClass("show"),t.removeClass("has-bookmarks"),setTimeout(function(){t.removeClass("has-bookmarks-animating")},500)},3)}},mouseUp:function(e){if(!this.isDragging(e))return this.dragStarted=!1,void(this.dragging=!1);e.preventDefault(),e.stopPropagation();var o=this;setTimeout(function(){o.dragging=!1,o.dragStarted=!1},20)},mouseDown:function(e){var o=this.currentList;this.lastMouseX=e.originalEvent.pageX,this.originalScroll=o.scrollLeft(),this.dragStarted=!0},mouseMove:function(e){if(this.dragStarted){document.selection?document.selection.empty():window.getSelection&&window.getSelection().removeAllRanges(),this.dragging=!0;var o=this.currentList,t=this.originalScroll+(this.lastMouseX-e.originalEvent.pageX);o.scrollLeft(t)}else this.dragging=!1},isDragging:function(e){return this.dragging&&10<Math.abs(this.lastMouseX-e.originalEvent.pageX)},handleHotKey:function(){var o=this;getBrowser().permissions.contains(this.permissions,function(e){e&&o.toggleShow(!o.showing)})}}),d.views.BookmarksPrimer=Backbone.View.extend({template:d.templates.primer,attributes:{class:"overlay overlay-permissions"},events:{"click a":"handleClick"},initialize:function(e){this.callback=e.callback,this.permissions=e.permissions},render:function(){var o=l.models.bookmarksSettings;this.browser=getBrowserName(),this.$el.html(this.template(this));var t=a("body");t.addClass("blur"),this.$el.remove(),this.$el.appendTo("body").addClass("show");var s=this;return setTimeout(function(){s.$el.addClass("show-animate")},2),getBrowser().permissions.request(s.permissions,function(e){t.removeClass("blur"),s.$el.removeClass("show-animate"),setTimeout(function(){s.$el.removeClass("show")},500),e?(o.set("allowed",!0),s.callback()):(o.set("allowed",!1),o.optionsChanged())}),this}}),d.styles.style(),l.views.bookmarks||(l.views.bookmarks=new d.views.Bookmarks({region:"top-bar",order:"prepend"})),d};m.addinManager&&m.addinManager.registerAddinFn("e80e5480-46a1-4329-a06c-fc90eecb820c",fn_addin);