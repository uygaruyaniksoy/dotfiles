var fn_addin=function(s,n,e){var t=t||{};return t.styles=t.styles||{},t.commands=t.commands||{},t.dependencies=e||t.dependencies||{},t.styles.style=function(){},t.views=t.views||{},t.collect=t.collect||{},t.models=t.models||{},t.templates=t.templates||{},t.info={widget:!0,placeholderType:"metric",id:"dashlinks",class:"app-container links dashlinks",region:"top-left",order:"prepend",addin:"db430020-c088-4c07-8992-09ce22377120"},s.console.log(s.elapsed()+": "+t.info.id+" started"),t.templates=t.templates||{},t.templates.dashlinks=Handlebars.template({compiler:[6,">= 2.0.0-beta.1"],main:function(e,t,a,s){return'<span class="app-dash optional-link toggle toggle-icon toggle-chrome-tab" data-momo-id="chromeTab" data-place="dash" data-url="chrome-search://local-ntp/local-ntp.html" title="Chrome Tab"><svg class="icon-svg icon-chrome-tab" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.401 497.401"><g><path d="M478.742 154.382H320.714c28.366 21.765 47.111 55.717 47.111 94.307 0 30.63-14.345 56.386-30.933 79.445-28.322 39.41-95.817 168.878-95.817 168.878 2.567.043 5.026.388 7.636.388 137.341 0 248.69-111.348 248.69-248.69-.022-33.412-6.709-65.229-18.659-94.328z"/><path d="M248.172 129.619c54.402-.388 217.628-2.049 217.628-2.049C423.24 51.511 342.069 0 248.69 0 170.819 0 101.361 35.829 55.782 91.848l75.972 134.925c10.268-55.113 58.349-96.744 116.418-97.154z"/><path d="M248.668 367.825c-51.964 0-91.568-35.117-111.974-79.855-20.535-45.018-98.061-171.984-98.061-171.984C14.301 154.425 0 199.832 0 248.69c0 124.744 91.935 227.744 211.696 245.648l77.288-134.019c-12.641 4.615-26.101 7.506-40.316 7.506z"/><circle cx="248.668" cy="248.711" r="80.416"/></g></svg></span>\x3c!--\n--\x3e<span class="app-dash optional-link toggle toggle-icon toggle-apps" data-momo-id="apps" data-place="dash" data-url="chrome://apps" title="Apps"><svg class="icon-svg icon-apps" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M3 3h6v6H3V3zm10 0h6v6h-6V3zm10 0h6v6h-6V3zM3 13h6v6H3v-6zm10 0h6v6h-6v-6zm10 0h6v6h-6v-6zM3 23h6v6H3v-6zm10 0h6v6h-6v-6zm10 0h6v6h-6v-6z"/></svg></span>\n'},useData:!0}),t.views.DashLinks=Backbone.View.extend({template:t.templates.dashlinks,events:{"click .toggle-icon":"handleClick"},initialize:function(){this.listenTo(s.models.bookmarksSettings,"change:appsLocation",this.checkOptionalLinks),this.listenTo(s.models.bookmarksSettings,"change:chromeTabLocation",this.checkOptionalLinks),this.render()},checkInclusion:function(e){var t=s.models.bookmarksSettings,a=n(e);a.toggleClass("show",t.get(a.attr("data-momo-id")+"Location")==a.attr("data-place"))},checkOptionalLinks:function(){var a=this;this.$(".optional-link").each(function(e,t){a.checkInclusion(t)})},render:function(){if(!isChrome())return this.triggerLoaded(),this;var a=this;return this.$el.html(this.template()),this.$(".optional-link").each(function(e,t){a.checkInclusion(t)}),this.triggerLoaded(),this},triggerLoaded:function(){this.loadTriggered||(s.trigger(t.info.id+":loaded"),this.loadTriggered=!0)},handleClick:function(e){e.stopPropagation(),e.preventDefault();var t=e.currentTarget.dataset.url||e.currentTarget.href;s.models.bookmarksSettings.get("openInNewTab")||e.metaKey?getBrowser().tabs.create({url:t}):getBrowser().tabs.update({url:t})}}),t.styles.style(),t.views.dashlinks=s.widgetManager.handover("dashlinks",t.views.DashLinks,{region:"top-left",order:"prepend"}),t};m.addinManager&&m.addinManager.registerAddinFn("db430020-c088-4c07-8992-09ce22377120",fn_addin);