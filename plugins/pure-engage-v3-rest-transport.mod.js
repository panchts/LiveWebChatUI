/*!
 * widgets
 * @version: 9.0.018.07
 * @copyright: Copyright © 2023 Genesys. All rights reserved.
 * @license: Genesys Telecom Labs
 */
widgetsJsonpFunction([19],{"./webapp/plugins/cx-webchat-service/transports/pure-engage-v3-rest-transport.js":function(e,t,s){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){var s={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(s[o]=e[o]);return s}var a=function(){function e(e,t){for(var s=0;s<t.length;s++){var o=t[s];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,s,o){return s&&e(t.prototype,s),o&&e(t,o),t}}(),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o])}return e},c=s("./node_modules/jquery/dist/jquery.js"),u=o(c),d=s("./webapp/plugins/cx-common/cx-common.js"),g=o(d),p=s("./node_modules/js-cookie/src/js.cookie.js"),f=o(p),h={init:function(e){h.transport=e},getSanitizedIndex:function(e){var t=e;return t&&(t=t.replace("-","")),t},updateSessionCookies:function(){var e=h.transport,t=e.oSessionData,s=h.transport,o=s.bAsyncMode,n=s.getSessionData;o&&"function"==typeof n?h.updateCustomerToken():g.default.setCookie(e.sCookie_Keys,t.token),g.default.setCookie(e.sCookie_Session,t.sessionId)},removeCookies:function(){var e=h.transport;g.default.deleteCookie(e.sCookie_Session),g.default.deleteCookie(e.sCookie_Keys),g.default.deleteCookie(e.sCookie_Index)},getSessionFromCookie:function(){var e=h.transport;e.oSessionData=g.default.decodeJWTToken(g.default.getCookie(e.sCookie_Keys))},getHeaders:function(){var e=h.transport,t=e.sCookie_Keys,s=e.oConfig,o=e.bAsyncMode,n={};if(o&&"function"==typeof h.getCustomerToken){var i=h.getCustomerToken(),a=i.token;n=l({},s.oHeaders,{"x-nexus-client-key":a})}else n=l({},s.oHeaders,{"x-nexus-client-key":g.default.getCookie(t)});return n},transformMessage:function(e){var t=e.from;if(t){var s=t.nickname,o=t.type,n=t.participantId;s&&(e.from.name=s),o&&"Customer"==o&&(e.from.type="Client"),n&&(e.from.id=n)}return e},parseMessageForEvents:function(e){var t=h.transport,s=e.type,o=e.from.type,n=e.from.participantId,i={};if(e=h.transformMessage(e),"Message"!=s&&"PushUrl"!=s&&"Notice"!=s||"Agent"!=o&&"Supervisor"!=o||t.onAgentTypingStopped(e),"ParticipantJoined"==s)switch("Agent"!=o&&"Supervisor"!=o||(t.oAgents[n]={name:e.from.name,connected:!0,supervisor:"Supervisor"==o,connectedTime:e.timestamp,disconnectedTime:!1}),i={message:e,agents:t.oAgents},o){case"Client":t.onClientConnected(i);break;case"Agent":t.onAgentConnected(i);break;case"Supervisor":t.onSuperVisorConnected(i)}else if("ParticipantLeft"==s)switch(t.oAgents[n]&&(t.oAgents[n].connected=!1,t.oAgents[n].disconnectedTime=e.timestamp),i={message:e,agents:t.oAgents},o){case"Client":t.onClientDisconnected(i);break;case"Agent":t.onAgentDisconnected(i),t.onAgentTypingStopped(i);break;case"Supervisor":t.onSuperVisorDisconnected(i)}"Agent"!=o&&"Supervisor"!=o||("TypingStarted"==s&&(t.onAgentTypingStarted(e),t.bAgentTypingTimerActive||(t.bAgentTypingTimerActive=!0,setTimeout(function(){t.bAgentTypingTimerActive=!1,t.onAgentTypingTimeout()},t.iAgentTypingTimer))),"TypingStopped"==s&&t.onAgentTypingStopped(e))},setPreviousIndex:function(e){if(e.length){var t=h.transport;1==e.length&&e[0].index==t.previousStartIndex?(t.bAllMessagesReceived=!0,t.continuePoll(),t.onMessageReceived({data:{}})):(t.bAllMessagesReceived=!1,t.previousStartIndex=e[0].index)}},formatMessages:function(e){var t=[],s=[],o=[],n=h.transport,i=u.default.Deferred();return u.default.each(e||[],function(){var e=this,i={},a=h.getSanitizedIndex(e.index),r=u.default.Deferred();if(e.iTempIndex=a,h.checkChatIndexHash(a)){if(o.push(e),i=l({},e),i.timestamp=i.utcTime,i.index=a,i.type="Text"==i.type?"Message":i.type,"PushUrl"==i.type&&i.url&&(i.text=i.url),i.from){var c=e.from;i.from={name:c.nickname||c.firstName,type:"Customer"==c.type?"Client":c.type,participantId:c.participantId}}i.content&&i.content.length?(t.push(r),h.getFileContents(i.content).done(function(t){i.content=t,h.parseMessageForEvents(e),n.index=a,n.originalIndex=e.index,g.default.setCookie(n.sCookie_Index,a),n.bAsyncMode&&"function"==typeof n.getSessionData&&h.updateCustomerToken(),s.push(i),r.resolve({aMessages:s,aUniqueOriginalMessages:o})})):(h.parseMessageForEvents(e),n.index=a,n.originalIndex=e.index,g.default.setCookie(n.sCookie_Index,a),n.bAsyncMode&&"function"==typeof n.getSessionData&&h.updateCustomerToken(),s.push(i),r.resolve({aMessages:s,aUniqueOriginalMessages:o}),t.push(r))}else r.resolve(),t.push(r)}),u.default.when.apply(void 0,t).then(function(){s?i.resolve({aMessages:s,aUniqueOriginalMessages:o}):i.reject()}),i.promise()},messagesInSync:function(e,t){var s=!0;return e.length!=t.length?s=!1:e.forEach(function(e,o){e.index&&t[o]&&t[o].iTempIndex?e.index!=t[o].iTempIndex&&(s=!1):s=!1}),s},parseTranscript:function(e,t){var s=h.transport,o=!1;(t&&"restore"==t.type||t&&"fetchHistory"==t.type)&&h.setPreviousIndex(e,t),Object.keys(e).length&&h.formatMessages(e).done(function(e){var n=e.aMessages,i=e.aUniqueOriginalMessages;n&&n.length>0&&(t&&t.type&&("restore"==t.type&&(n.sort(function(e,t){return e.index-t.index}),i&&i.length>0&&i.sort(function(e,t){return e.iTempIndex-t.iTempIndex})),"fetchHistory"==t.type&&(n.sort(function(e,t){return t.index-e.index}),i&&i.length>0&&i.sort(function(e,t){return t.iTempIndex-e.iTempIndex}))),o=h.messagesInSync(n,i),i&&i.length>0&&(i=i.map(function(e){return delete e.iTempIndex,e})),o&&s.onMessageReceived({data:{originalMessages:i,messages:n,restoring:s.bRestoring,oldMessages:s.bFetchOldAsyncMessages&&t&&"fetchHistory"==t.type}}),s.bPausePoll&&s.bFetchOldAsyncMessages&&t&&"fetchHistory"==t.type&&s.continuePoll())})},refresh:function(e){if(e.data){var t=e.data,s=h.transport;1==t.chatEnded&&1==s.bSessionActive&&h.terminateChatSession(),t.messages&&!s.bPausePoll&&h.parseTranscript(t.messages)}},restore:function(e,t){var s=h.transport;if(e.data){var o=e.data;return s.bSessionActive=!0,localStorage.setItem(s.sLocalStgPollPending,"false"),s.onRestore({async:!(!s.bAsyncMode&&!t)}),o.messages&&h.parseTranscript(o.messages,{type:"restore"}),s.bRestoring=!1,s.bFetchOldAsyncMessages=!1,s.startPoll(),!0}return!1},getFormData:function(e){var t=h.transport.oConfig,s=g.default.getBrowserandOS(),o={_genesys_source:g.default.isMobileDevice()?"mobile":"web",_genesys_referrer:document.referrer,_genesys_url:document.location.href,_genesys_pageTitle:document.title,_genesys_browser:s.browser,_genesys_OS:s.os},n=l({},t.oUserData,o),a={endpoint:t.sEndpoint,userData:n};if(t.sClientType&&(a.clientType=t.sClientType),t.sTransportStream&&(a.stream=t.sTransportStream),e){var c=e.firstname,u=e.lastname,d=e.nickname,p=i(e,["firstname","lastname","nickname"]);return"object"==r(e.userData)&&(a.userData=l({},a.userData,e.userData)),l({firstName:c,lastName:u,nickname:d||c||e.firstName},a,p)}return a},terminateChatSession:function(){var e=h.transport;h.removeCookies(),e.stopPoll(),e.bSessionActive=!1,h.reset()},checkChatIndexHash:function(e){var t=h.transport;return e=h.getSanitizedIndex(e),!t.oChatIndexHash[e]&&(t.oChatIndexHash[e]=!0,!0)},reset:function(){var e=h.transport;e.oChatIndexHash={},e.oAgents={},e.oSessionData={},e.previousStartIndex=0,e.bAllMessagesReceived=!1},sendRequest:function(e){var t=u.default.Deferred(),s=h.transport,o=s.oSessionData.sessionId,n=s.oConfig;return g.default.request({url:n.sServerURL+"/"+o+"/messages",type:"POST",crossDomain:!0,headers:h.getHeaders(),data:{operationId:g.default.guid(),data:{type:e.type||"Text",text:e.message||""}},timeout:n.iAjaxTimeout,success:function(e){return t.resolve(e)},error:function(e){return t.reject(e)}}),t.promise()},getFileContents:function(e){var t=h.transport.oConfig.sServerURL,s=h.transport.oConfig,o=[],n=t.replace("/sessions",""),i=[];return u.default.each(e,function(e,t){var a=new u.default.Deferred;t.mime&&t.url&&(t.url=n+t.url),t.type&&"image"==t.type?g.default.getImageFromURL({url:t.url,headers:h.getHeaders(),ajaxTimeout:s.iAjaxTimeout}).done(function(e){e&&(t.url=e.base64Data,o.push(t),a.resolve(o))}).fail(function(e){a.reject(e)}):(o.push(t),a.resolve(o)),i.push(a)}),u.default.when.apply(void 0,i).promise()},handleSessionLost:function(e){var t=h.transport;t.bFetchOldAsyncMessages=!1,t.deleteSessionData&&(t.deleteSessionData({sessionData:t.oSessionData,response:e},f.default,g.default.getCookieOptions()),t.bRestoring=!1),t.onSessionLost(e),t.onError(e),h.terminateChatSession(),localStorage.setItem(t.sLocalStgPollPending,"false")},handleError:function(e){var t=h.transport,s=e&&(e.responseJSON||e.responseText&&JSON.parse(e.responseText)||{}),o=void 0,n=void 0;if(s){var i=s.status;i&&(o=i.message||"",n=i.code||"")}"INVALID_SESSION"==n||e&&404==e.status?h.handleSessionLost(e):t.bAsyncMode&&t.bRestoring&&e&&401==e.status?h.handleSessionLost(e):t.onError({code:1!==n?t.errorPrefix+n:"",text:o||"",response:e})},disconnected:function(){var e=h.transport;e.bDisconnected=!0,e.onDisconnected()},reconnected:function(){var e=h.transport;e.bDisconnected=!1,e.onReconnected()},updateCustomerToken:function(){var e=h.transport,t=e.oSessionData,s=h.transport.getSessionData;t.token&&s({messageIndex:e.index,token:t.token},f.default,g.default.getCookieOptions())},getCustomerToken:function(){var e=h.transport,t=e.setSessionData,s=e.sCookie_open,o=e.capabilities;h.transport.onCapabilitiesChanged(o);var n=t(s,f.default,g.default.getCookieOptions());return"undefined"!==n&&n&&"string"==typeof n&&n.length>0?n=JSON.parse(n):!(!n||"object"!=(void 0===n?"undefined":r(n))||!Object.keys(n).length)&&n}},m=function(){function e(t){n(this,e),this.oConfig=t,this.bDisconnected=!1;var s="."+t.transport.type;if(this.oAgents={},this.bSessionActive=!1,this.oSessionData={},this.sCookie_Session=t.sCookie_Prefix+s+".session",this.sCookie_Keys=t.sCookie_Prefix+s+".keys",this.sCookie_Index=t.sCookie_Prefix+s+".index",this.sCookie_open=t.sCookie_Prefix+s+".open",this.fPollTimeout=!1,this.bPausePoll=!1,this.sLocalStgPollPending="_genesys.widgets.chatPollPending",this.bPolling=!1,this.bPollingPending=!1,localStorage.setItem(this.sLocalStgPollPending,localStorage.getItem(this.sLocalStgPollPending)||"false"),this.oPollAjax=!1,this.bPollError=!1,this.iPollIntervalMultiplier=1.2,this.iAgentTypingTimer=3e3,this.bAgentTypingTimerActive=!1,this.onChatStarted=this.onChatStarted.bind(this),this.onMessageReceived=this.onMessageReceived.bind(this),this.onRestore=this.onRestore.bind(this),this.onPollingStarted=this.onPollingStarted.bind(this),this.onError=this.onError.bind(this),this.bRestoring=!1,this.oChatIndexHash={},this.previousStartIndex=0,this.maxMessagePageSize=20,this.index=0,this.originalIndex=0,this.bAllMessagesReceived=!1,this.bAsyncMode=!1,this.getSessionData=!1,this.setSessionData=!1,this.deleteSessionData=!1,this.bStartNewAsyncChat=!1,this.bFetchOldAsyncMessages=!1,this.errorPrefix=t.transport.type+"-",this.oMapping={"userData.phone":{target:"userData.PhoneNumber",type:"string"}},"object"==r(t.transport)){var o=t.transport,i="function",a="string",l="number",c=this.oConfig;if(r(o.dataURL)==a&&(c.sServerURL=o.dataURL),"object"==r(o.headers)&&(c.oHeaders=o.headers),r(o.endpoint)==a&&(c.sEndpoint=o.endpoint),r(o.clientType)==a&&(c.sClientType=o.clientType),r(o.pollTimeout)==l&&(c.pollTimeout=o.pollTimeout),r(o.stream)==a&&(c.sTransportStream=o.stream),r(o.pollExceptionLimit)==l&&(c.iPollExceptionLimit=o.pollExceptionLimit),r(o.maxMessagePageSize)==l&&(this.maxMessagePageSize=o.maxMessagePageSize),r(o.pollIntervalMultiplier)==l&&(this.iPollIntervalMultiplier=o.pollIntervalMultiplier),this.maxMessagePageSize<16&&(this.maxMessagePageSize=16),"object"==r(o.async)){var u=o.async;"boolean"==r(u.enabled)&&(this.bAsyncMode=u.enabled),r(u.setSessionData)==i&&r(u.getSessionData)==i&&(this.setSessionData=u.setSessionData,this.getSessionData=u.getSessionData),u.deleteSessionData&&r(u.deleteSessionData)==i&&(this.deleteSessionData=u.deleteSessionData)}}this.capabilities={async:this.bAsyncMode,asyncClose:"endChat",pagination:this.bAsyncMode},this.iPollTimeout_ms=this.oConfig.pollTimeout||3e3,this.iPollTimeout_ms<100&&(this.iPollTimeout_ms=100),this.iIncrementalPollTimeout_ms=this.iPollTimeout_ms,t.iAjaxTimeout=t.iAjaxTimeout||9e3,this.onCapabilitiesChanged(this.capabilities),h.init(this)}return a(e,[{key:"onChatStarted",value:function(e,t){}},{key:"onTypingStarted",value:function(e){}},{key:"onTypingStopped",value:function(e){}},{key:"onMessageReceived",value:function(e){}},{key:"onChatEnded",value:function(e){}},{key:"onError",value:function(e){}},{key:"onRestore",value:function(e){}},{key:"onReconnected",value:function(){}},{key:"onDisconnected",value:function(){}},{key:"onRestoreFailed",value:function(e){}},{key:"onSessionLost",value:function(e){}},{key:"onPollingStarted",value:function(){}},{key:"onPollingStopped",value:function(){}},{key:"onCapabilitiesChanged",value:function(e){}},{key:"onSleep",value:function(){}},{key:"onWake",value:function(){}},{key:"startChat",value:function(e){var t=u.default.Deferred(),s=this.oConfig,o=h.getFormData(e.form),n=s.oHeaders,i=this;if("boolean"==e.async&&(this.bAsyncMode=e.async),e.headers&&(s.oHeaders=e.headers),this.bAsyncMode&&"function"==typeof this.setSessionData){var a=h.getCustomerToken(),r=a.token;r&&(n["x-nexus-client-key"]=r)}return o.userData=u.default.extend({},o.userData,e.userData||{},!0),o.userData&&(o=g.default.mapProperties(i.oMapping,{userData:o.userData},o)),g.default.request({url:e.dataURL||s.sServerURL,type:"POST",crossDomain:!0,headers:e.headers||n,data:{data:o,operationId:g.default.guid()},timeout:s.iAjaxTimeout,success:function(e){if(e.data&&e.data.clientToken){var s=e.data;i.bSessionActive=!0,i.oSessionData=g.default.decodeJWTToken(s.clientToken),i.oSessionData.token=s.clientToken,h.updateSessionCookies(),i.onChatStarted({data:i.oSessionData},e),i.startPoll(),t.resolve(e)}else t.reject(e),i.onError(e)},error:function(e){t.reject(e||{}),h.handleError(e)}}),t.promise()}},{key:"startPoll",value:function(){this.bPolling=!0,this.bFetchOldAsyncMessages=!1,this.poll()}},{key:"stopPoll",value:function(){var e=u.default.Deferred();return localStorage.setItem(this.sLocalStgPollPending,"false"),this.fPollTimeout?(this.bPolling&&(this.bPolling=!1,clearTimeout(this.fPollTimeout),this.fPollTimeout=!1,this.bPollError=!1,this.iIncrementalPollTimeout_ms=this.iPollTimeout_ms,this.onPollingStopped(),e.resolve()),e.promise()):(e.reject("Not currently polling. Ignoring command."),e.promise())}},{key:"continuePoll",value:function(){this.bPausePoll&&(this.bPolling=!0,this.bPausePoll=!1,this.bFetchOldAsyncMessages=!1,localStorage.setItem(this.sLocalStgPollPending,"false"),this.poll(this.originalIndex),this.onWake())}},{key:"pausePoll",value:function(){this.bPolling=!1,this.bPausePoll=!0,clearTimeout(this.fPollTimeout),this.fPollTimeout=!1,this.bPollError=!1,this.iIncrementalPollTimeout_ms=this.iPollTimeout_ms,this.bPollingPending&&this.oPollAjax&&(localStorage.setItem(this.sLocalStgPollPending,"false"),this.oPollAjax.abort()),this.onSleep()}},{key:"_longPoll",value:function(){var e=this;this.bPolling&&(this.bFetchOldAsyncMessages=!1,this.bPollError?this.iIncrementalPollTimeout_ms=parseInt(this.iIncrementalPollTimeout_ms*this.iPollIntervalMultiplier):this.iIncrementalPollTimeout_ms=this.iPollTimeout_ms,this.fPollTimeout=setTimeout(function(){e.bPausePoll||this.poll()}.bind(this),this.iIncrementalPollTimeout_ms))}},{key:"poll",value:function(e){var t=this,s="",o=u.default.Deferred(),n=this.oSessionData.sessionId,i=localStorage.getItem(this.sLocalStgPollPending);if(this.bFetchOldAsyncMessages=!1,!t.bSessionActive)return o.reject("There is no active chat session"),!1;if(!n||this.bPollingPending||"false"!=i||t.bPausePoll)o.reject("previous poll has not finished.");else{var a=this.oConfig;this.bPollingPending=!0,localStorage.setItem(t.sLocalStgPollPending,"true"),this.onPollingStarted(),s=e?a.sServerURL+"/"+n+"/messages?operationId="+g.default.guid()+"&index="+e:a.sServerURL+"/"+n+"/messages?operationId="+g.default.guid(),this.oPollAjax=g.default.request({url:s,type:"GET",crossDomain:!0,headers:h.getHeaders(),success:function(e){t.bPollError=!1,t.bPollingPending=!1,localStorage.setItem(t.sLocalStgPollPending,"false"),t.oPollAjax=!1,h.refresh(e),t.bPausePoll||t._longPoll(),t.bDisconnected&&h.reconnected(),o.resolve()},error:function(e){t.bPollingPending=!1,localStorage.setItem(t.sLocalStgPollPending,"false"),t.oPollAjax=!1,t.bPausePoll?o.reject():(e&&0==e.status&&!t.bDisconnected?h.disconnected():t.bDisconnected||h.handleError(e),429!==e.status&&(t.bPollError=!0),t._longPoll(),o.reject())}})}return o.promise()}},{key:"sendMessage",value:function(e){var t=u.default.Deferred(),s=this;return this.bFetchOldAsyncMessages=!1,this.bDisconnected?(t.resolve({statusCode:1}),!1):(this.bSessionActive?("text"==e.type&&(e.type="Text"),h.sendRequest(e).done(function(e){1==e.chatEnded&&1==s.bSessionActive&&h.terminateChatSession(),t.resolve(e)}).fail(function(e){s.onError(e),t.reject()})):t.reject("There is no active chat session."),t.promise())}},{key:"sendFile",value:function(e){var t=u.default.Deferred();if(this.bFetchOldAsyncMessages=!1,this.bSessionActive){var s=e.data.files,o=s.files[0];if(g.default.isFeatureSupported("FormData")){var n=new FormData,i=this.oSessionData.sessionId,a=this.oConfig.sServerURL;o&&n.append("file",o),n.append("operationId",g.default.guid()),g.default.request({url:a+"/"+i+"/images",type:"POST",crossDomain:!0,mimeType:"multipart/form-data",contentType:!1,processData:!1,headers:h.getHeaders(),data:n,success:function(e){t.resolve(e)},error:function(e){h.handleError(e),t.reject(e)}})}else t.reject("Sorry, cannot send attachments. HTMl5 FormData is not support on your browser")}else t.reject("There is no active chat session.");return t.promise()}},{key:"sendTyping",value:function(e){var t=u.default.Deferred(),s=this;return this.bFetchOldAsyncMessages=!1,this.bSessionActive?h.sendRequest(e).done(function(e){t.resolve(e)}).fail(function(e){s.onError(e),t.reject(e)}):t.reject("There is no active chat session."),t.promise()}},{key:"updateUserData",value:function(e){var t=u.default.Deferred(),s=this.oSessionData.sessionId,o=this.oConfig;return g.default.request({url:o.sServerURL+"/"+s+"/userdata",type:"PUT",crossDomain:!0,headers:h.getHeaders(),data:{data:e,operationId:g.default.guid()},timeout:o.iAjaxTimeout,success:function(e){return t.resolve(e)},error:function(e){return t.reject(e)}}),t.promise()}},{key:"fetchHistory",value:function(){var e=u.default.Deferred(),t=this,s=this.maxMessagePageSize,o=this.previousStartIndex,n=this.bAllMessagesReceived,i=this.oSessionData,a=this.oConfig;if(!this.bAsyncMode)return e.reject("Fetching messages history applies to only Asynchronous chat."),e.promise();if(this.bFetchOldAsyncMessages=!0,n)t.continuePoll(),e.reject("No more messages to fetch");else{var r=i.sessionId,l=a.sServerURL;r&&o&&(this.pausePoll(),g.default.request({url:l+"/"+r+"/messages?index="+o+"&count="+s+"&operationId="+g.default.guid(),type:"GET",crossDomain:!0,headers:h.getHeaders(),success:function(s){if(s&&s.data){var o=s.data.messages;o&&o.length&&h.parseTranscript(o,{type:"fetchHistory"}),e.resolve(s)}else t.bFetchOldAsyncMessages=!1,t.continuePoll(),e.reject(s)},error:function(s){t.bFetchOldAsyncMessages=!1,t.continuePoll(),t.onError(s),e.reject(s)}}))}return e.promise()}},{key:"asyncRestore",value:function(){var e=u.default.Deferred(),t=void 0,s=this;if(g.default.getCookie(this.sCookie_Session))this.restore(),e.resolve();else if(this.bAsyncMode&&"function"==typeof this.setSessionData){var o=h.getCustomerToken(),n=o.token;n?(this.restore(n),e.resolve()):e.reject()}else e.reject(),(t=localStorage.getItem(this.sLocalStgPollPending))&&"true"==t&&!this.bSessionActive&&localStorage.setItem(s.sLocalStgPollPending,"false");return e.promise()}},{key:"restore",value:function(e){var t=u.default.Deferred(),s=this.oConfig,o=s.sServerURL,n=s.iAjaxTimeout,i=s.oHeaders,a=this;if(this.bRestoring)return t.reject("Already restoring. Ignoring request."),!1;if(this.bSessionActive&&t.reject("Chat session is already active, ignoring restore command."),this.bAsyncMode&&"string"==typeof e){this.bRestoring=!0,this.onCapabilitiesChanged(this.capabilities);var r=h.getFormData(),c={"x-nexus-client-key":e};i&&(c=l({},c,i)),g.default.request({url:o,type:"POST",crossDomain:!0,headers:c,data:{data:r,operationId:g.default.guid()},timeout:n,success:function(s){if(s.data&&s.data.clientToken){var n=s.data;a.oSessionData=g.default.decodeJWTToken(n.clientToken),a.oSessionData.token=n.clientToken,h.updateSessionCookies();var i=a.oSessionData.sessionId;i?g.default.request({url:o+"/"+i+"/messages?count="+a.maxMessagePageSize+"&operationId="+g.default.guid(),type:"GET",crossDomain:!0,headers:h.getHeaders(),success:function(s){var o=!!e;1==h.restore(s,o)?t.resolve(s):t.reject(s)},error:function(e){a.onRestoreFailed(e),a.onError(e),t.reject(e)}}):t.reject("Cannot restore async chat")}else t.reject("Cannot start async chat:"),a.onRestoreFailed(s),a.onError(s)},error:function(e){t.reject(e||{}),a.onRestoreFailed(e),h.handleError(e)}})}else{h.getSessionFromCookie();var d=a.oSessionData.sessionId;if(this.bAsyncMode&&!d){d=g.default.getCookie(a.sCookie_Session);var p=h.getCustomerToken(),f=p.token;a.oSessionData=g.default.decodeJWTToken(f)}d?(a.bRestoring=!0,a.onCapabilitiesChanged(a.capabilities),a.capabilities.pagination||(a.maxMessagePageSize=1e4),g.default.request({url:o+"/"+d+"/messages?count="+a.maxMessagePageSize+"&operationId="+g.default.guid(),type:"GET",crossDomain:!0,timeout:n,headers:h.getHeaders(),success:function(e){1==h.restore(e)?t.resolve(e):(t.reject(e),a.onRestoreFailed(e),h.terminateChatSession())},error:function(e){a.onError(e),a.onRestoreFailed(e),h.terminateChatSession(),t.reject(e)}})):t.reject("No chat session found to restore.")}return t.promise()}},{key:"fetchSessionAndRestoringInfo",value:function(){var e=!1;h.getSessionFromCookie();var t=this.oSessionData,s=t.sessionId,o=t.participantId;if(this.bAsyncMode&&!s){var n=h.getCustomerToken(),i=n.token;this.oSessionData=g.default.decodeJWTToken(i),s=this.oSessionData&&this.oSessionData.sessionId,o=this.oSessionData&&this.oSessionData.participantId}return s&&this.oSessionData&&Object.keys(this.oSessionData).length&&o&&(e=!0),{bRestoring:this.bRestoring,bSessionValid:e}}},{key:"endChat",value:function(){var e=u.default.Deferred(),t=this.oSessionData,s=t.sessionId,o=t.participantId,n=this.oConfig,i=this;return this.bFetchOldAsyncMessages=!1,this.bSessionActive||e.reject("There is no active chat session"),this.stopPoll(),g.default.request({url:n.sServerURL+"/"+s+"/participants/"+o,type:"DELETE",crossDomain:!0,headers:h.getHeaders(),data:{operationId:g.default.guid()},success:function(t){i.onChatEnded(t),i.onAgentDisconnected({agents:i.oAgents}),e.resolve(t)},error:function(t){i.onChatEnded(),e.reject()}}).always(h.terminateChatSession),e.promise()}},{key:"fetchSessionData",value:function(){return this.oSessionData}},{key:"getAgents",value:function(){return this.oAgents}},{key:"getFileLimits",value:function(){return u.default.Deferred().reject("This transport doesn't support getFileLimits command.").promise()}},{key:"downloadFile",value:function(){return u.default.Deferred().reject("This transport doesn't support file download.").promise()}},{key:"sendCustomNotice",value:function(){return u.default.Deferred().reject("This transport doesn't support sendCustomNotice command.").promise()}},{key:"resetPollExceptions",value:function(){return u.default.Deferred().reject("This transport doesn't support any poll Exceptions.").promise()}}]),e}();CXBus.registerModule("pure-engage-v3-rest-transport",m)}},["./webapp/plugins/cx-webchat-service/transports/pure-engage-v3-rest-transport.js"]);