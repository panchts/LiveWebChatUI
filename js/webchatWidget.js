 if (!window._genesys) window._genesys = {};
 if (!window._gt) window._gt = [];
if(!window._genesys.widgetsInitialized){
    window._genesys.widgets = {
        main: {
            debug: true,
            theme: 'light',
            lang: "en",
            i18n: "i18n/widgets-en.i18n.json",
            customStylesheetID: "genesys_widgets_custom",
            preload: [
                "sidebar"
            ]
        },
        webchat: {
            autoStart: true,
            userData: { key1: "testValue1", key2: "testValue2" },
            emojis: true,
            autoInvite: {
                enabled: true,
                timeToInviteSeconds: 5,
                inviteTimeoutSeconds: 30
            },
            chatButton: {
                enabled: true,
                openDelay: 1000,
                effectDuration: 300,
                hideDuringInvite: true
            },
            transport: {
                on: {
                    'ended': function () {
    var chatWindow = $('.cx-webchat');
    if(chatWindow){
        // var surveyMessage = document.createElement('div');
        console.log("transport",chatWindow)
        $('.cx-webchat').addClass('survey-link');
        surveyMessage.innerHTML = '<p>Thank you for chatting with us! Please take a moment to complete our <a href="">survey</a></p>'
        
    }
                    }
                }
            },
            uploadsEnabled: true,
            dataURL: "https://iywcsges02.scet.eixt.com:8443/genesys/2/chat/customer-support",
            ajaxTimeout: 10000
        },
        sidebar: {
            enabled:true,
            channels: [
                {
                    type:'WebChat',
                    name: 'WebChat',
                      clickCommand: 'WebChat.ready',
                }
            ]
        },
        notification:{
            enabled:false
        }
      
    };
    window._genesys.widgetsInitialized = true;
}


















































