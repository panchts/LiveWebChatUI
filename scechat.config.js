if (!window._genesys) window._genesys = {};
if (!window._genesys.widgets) window._genesys.widgets = {};
if (!window._gt) window._gt = [];

window._genesys.widgets = {
    main: {
        debug: false,
        theme: "light",
        lang: "en",
        i18n: "i18n/widgets-en.i18n.json",
        customStylesheetID: "genesys_widgets_custom"//,
        //preload: [
        //      "sidebar"
        //]
    },
    webchat: {
        userData: { key1: "testValue1", key2: "testValue2" },
        emojis: false,
        //form: regForm,
        cometD: {
            enabled: false
        },
        autoInvite: {
            enabled: false,
            timeToInviteSeconds: 5,
            inviteTimeoutSeconds: 30
        },
        chatButton: {
            enabled: false,
            openDelay: 1000,
            effectDuration: 300,
            hideDuringInvite: true
        },
        uploadsEnabled: false,
        dataURL: "https://iywcsges02.scet.eixt.com:8443/genesys/2/chat/customer-support",
        ajaxTimeout: 10000
    }
};


