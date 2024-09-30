// for testing purpose set account details and userinfo t local and session storage
sessionStorage.setItem('myaccountDetails', JSON.stringify({
    "firstName": "Eric",
    "lastName": "Luther",
    "mailingAddress": "11655 Bellflower St Victorville CA 92392",
    "contractAccountNumber": "700231405769"
}))
localStorage.setItem('userInfo', JSON.stringify({
    "userId": "00u24ezfa6gvQAbta0h8",
    "email": "myactpass2+HUcross@gmail.com",
    "profileData": {
        "oktaSessionId": "102N0SUlnPhQnGJZtAUFDGHVw",
        "businessPartnerNumber": "1004594744",
        "accountDetails": {
            "bpNumber": "1004594744",
            "contractAccountNumber": "700231405769",
            "contractNavigation": [
                {
                    "contractNumber": "8002000027",
                }
            ]
        },
        "profile": {
            "email": "myactpass2+HUcross@gmail.com",
            "primaryPhone": "8005838425",
        },
        "accountData": {
            "mainBusinessPartner": {
                "businessPartnerNumber": "1004594744",
                "BPName": "LUTHER,ERIC",
            },
            "authBusinessPartners": null
        }
    },
    "accountType": "Residential | Single"
}))
// .................................................................................


// SAP Activity
const Subject = ["Billing Question", "How-do-I-pay-my-bill-Copy", "Make a Payment", "Ways to Save"]
const Category_Code = ["Z031", "Z031", "Z038", "Z039"]
const Sub_category_code = ["374", "374", "205", "234"]
let transcriptString = ' '  //transcript message to pass in phone call API 
let Subject_Data = '', Category_Code_Data = '', Sub_category_code_Data = '' // SAP phone call activity variables
let transcriptData = []

//agent name
let agentName
let isWebChatReady = false;
//chat session data
let showChatSessionData = false;
//fetch api timer
let shouldFetch = true

//clear the fetch api timer function
function stopFetching() {
    shouldFetch = false; // Set the flag to false to stop further calls
    console.log('Stopped fetching data.');
}

//page reload
function setPageLoadedFlag() {
    // Check if the page has been loaded before in the current session
    if (!sessionStorage.getItem('pageLoaded')) {
        // If not, set the flag
        sessionStorage.setItem('pageLoaded', 'true');
        // console.log("First load detected, setting sessionStorage flag.");
        return false; // Indicates first load
    }
    // console.log("Page was refreshed or navigated to.");
    return true; // Indicates page was refreshed
}


// WebChat Widget
if (!window._genesys.widgets.extensions) {

    window._genesys.widgets.extensions = {};
}

window._genesys.widgets.extensions["TestExtension"] = function ($, CXBus, Common) {

    var oTestExtension = CXBus.registerPlugin("TestExtension");

    var ewt, piq, firstName, lastName, email

    // global variable declaration (for storing session and local storage data)
    let customerType, customerName, singleOrMulti, customerAccountLevel1AuthBP,
        customerAccountLevel1CustBP, customerAccountLevel1CustBPName, customerAccountLevel2,
        customerAccountLevel3, contractNumber, oktaToken, BPNumber, serviceAccountNumber, currentPage,
        primaryPhoneNumber, browserLocalData, browserSessionData

    oTestExtension.republish("ready"); // Publishes "TestExtension.ready"
    //page load and refresh condition
    if (setPageLoadedFlag()) {
        console.log('refreshed');
        showChatSessionData = true  // for showing the chat transcript when page is refreshed
        webchatLoad() // webchat open function call

    }
    else {
        console.log('first load');
        showChatSessionData = false // for showing the chat transcript when page is refreshed
        webchatLoad() // webchat open function call

    }


    // function for loading the webchat
    function webchatLoad() {

        $(document).ready(function () {
            $('.WebChat').prop('disabled', true);
            $('.cx-smokescreen').css('display', 'none') // removing refresh smoke screen
            if (window._genesys && window._genesys.widgets && window._genesys.widgets.bus) {
                console.log("inside")
                oTestExtension.subscribe('WebChat.ready', function () {
                    try {
                        console.log("WebChat is ready")
                        $('.WebChat').prop('disabled', false);
                        $('.WebChat').click(
                            function () {
                                console.log("Sidebar button clicked")
                                try {
                                    //autosubmit form field when webchat is ready
                                    oTestExtension.command("WebChat.open",
                                        {
                                            form: {
                                                autoSubmit: true,
                                                firstname: firstName,
                                                lastname: lastName,
                                                email: email,
                                                subject: 'webchat'
                                            }
                                        })
                                }
                                catch (commandError) {
                                    console("Error executing webChat open command :", commandError)
                                    alert("webChat failed to open")
                                }
                            })
                    }
                    catch (subscriptionError) {
                        console.log("Error in subscribing to webChat ready event:", subscriptionError)
                        alert("webchat failed to load")
                    }
                })
            }
            else {
                console.log("Genesys WebChat is not initialized")
            }
        })
    }

    //when the webchat is opened
    oTestExtension.subscribe("WebChat.opened", function (e) {
        console.log('webchat opened subscribed');
        shouldFetch = true  // fetch api timer setting
        let previousPiq = null;
        let previousEwt = null;
        let queueMessage = '';
        let agentQueueMessage = '';

        // Function to update messages
        function updateMessages(piq, ewt) {
            queueMessage = `<div id="queue-message">An agent will reply within about ${ewt} minutes. <br></br> You are currently #${piq} in line.</div>`;
            agentQueueMessage = `An agent should reply within ${ewt} minutes. You are currently ${piq} in line.`;

            // Update the DOM with jQuery
            if ($('#queue-message').length) {
                $('#queue-message').html(queueMessage)
            }
            // console.log(agentQueueMessage); // Log to console
        }

        //customized intro messages
        async function main() {
            let response_ewt = null;
            let response_piq = null;
            await fetchAPI()  // function call for ewt and piq api
            async function fetchAPI() {
                // Fetch EWT API response
                try {
                    response_ewt = await apiCall_EWT(); // calling the ewt api
                    console.log('EWT response:', response_ewt);
                } catch (error) {
                    console.error('EWT error:', error);
                    response_ewt = { vq_CHAT_ioc_switch: { ewt: 60000 } }; // Default value for testing
                }

                // Fetch PIQ API response
                try {
                    response_piq = await apiCall_PIQ(); // calling the position in queue api
                    console.log('PIQ response:', response_piq);
                } catch (error) {
                    console.error('PIQ error:', error);
                    response_piq = { value: 1 }; // Default value for testing
                }

                //position in queue value 
                piq = response_piq.value
                //estimated wait time value
                var min = response_ewt.vq_CHAT_ioc_switch.ewt / 60000
                ewt = min > 1 ? Math.round(min) : 1  //rounding off the ewt value
                console.log('piq and ewt 1', piq, ewt);

                // Update messages if values changed
                if (piq !== previousPiq || ewt !== previousEwt) {
                    previousPiq = piq;
                    previousEwt = ewt;
                    updateMessages(piq, ewt); // Update messages here
                }
                // If the flag is still true, schedule the next fetch
                if (shouldFetch) {
                    setTimeout(fetchAPI, 1200); // Call fetchAPI again after 2 minutes
                }
            }





            // var queueMessage = `<div id="queue-message">An will reply within about ${ewt} minutes. <br></br> You are currently #${piq} in line.</div>`
            // let agentQueueMessage = `An agent should reply within ${ewt} minutes. You are currently ${piq} in line.`

            //insert the custom message above "Chat Started" message
            $(document).ready(function () {
                let flag = false
                $('.cx-message-text').each(function () {
                    // Get the current text of the element
                    let currentText = $(this).text();

                    if (currentText.trim() === "Chat Started") {

                        flag = true

                        //show only if page is refreshed
                        if (showChatSessionData) {
                            let sessionStorage_transcriptData = JSON.parse(sessionStorage.getItem('chatTranscriptData')) || []
                            //retrieving the user button click value when page is refreshed
                            if (sessionStorage.getItem('formOptionButtonClick')) {
                                switch (sessionStorage.getItem('formOptionButtonClick')) {
                                    case 'Billing Question':
                                        $('#click-message').text('We will let the agent know that you have a billing question, and you will be connected shortly.')
                                        $('#click-message').show()
                                        break;
                                    case 'Start, Transfer or Stop Service':
                                        $('#click-message').text('We will let the agent know that you have a Start, Transfer or Stop Service question, and you will be connected shortly.')
                                        $('#click-message').show()
                                        break;
                                    case 'Make a Payment':
                                        $('#click-message').text('We will let the agent know that you have a make a payment question, and you will be connected shortly.')
                                        $('#click-message').show()
                                        break;
                                    case 'Ways to Save':
                                        $('#click-message').text('We will let the agent know that you have a ways to save question, and you will be connected shortly.')
                                        $('#click-message').show()
                                        break;
                                    default:
                                        console.log("not matching");
                                }
                            }

                            console.log('local storage chat data', sessionStorage_transcriptData);
                            //retrieving the chat history for current session 
                            if (sessionStorage_transcriptData.length > 0) {
                                $(this).prepend(`<div id="chat-transcript"><div id="chat-message--heading">Chat Transcript</div></div>`)
                                for (var i = 0; i < sessionStorage_transcriptData.length; i++)
                                    $('#chat-transcript').append(`<div><span>Message ${i + 1}:</span> ${sessionStorage_transcriptData[i]} </div>`)
                            }
                        }

                        //adding UI display messages
                        $(this).prepend(clickMessage) // pre chat form button click message
                        $(this).prepend(chatIntroMessage) // pre chat form
                        $(this).prepend(queueMessage) // queue message
                        $(this).prepend(chatNotificationElement) // privacy policy notification (minimize functionality)
                        $('.cx-titlebar').prepend(mode)  //dark or light mode

                    }
                });
                if (flag === false) {
                    //adding UI display messages
                    $('.cx-transcript').append(chatNotificationElement) // privacy policy notification (minimize functionality)
                    $('.cx-transcript').append(queueMessage) // queue message
                    $('.cx-transcript').append(chatIntroMessage)// pre chat form
                    $('.cx-transcript').append(clickMessage) // pre chat form button click message
                    $('.cx-titlebar').prepend(mode) //dark or light mode

                    //show only if page is reloaded
                    if (showChatSessionData) {
                        let sessionStorage_transcriptData = JSON.parse(sessionStorage.getItem('chatTranscriptData')) || []
                        // retrieving pre chat form user button click data
                        if (sessionStorage.getItem('formOptionButtonClick')) {
                            switch (sessionStorage.getItem('formOptionButtonClick')) {
                                case 'Billing Question':
                                    $('#click-message').text('We will let the agent know that you have a billing question, and you will be connected shortly.')
                                    $('#click-message').show()
                                    break;
                                case 'Start, Transfer or Stop Service':
                                    $('#click-message').text('We will let the agent know that you have a Start, Transfer or Stop Service question, and you will be connected shortly.')
                                    $('#click-message').show()
                                    break;
                                case 'Make a Payment':
                                    $('#click-message').text('We will let the agent know that you have a make a payment question, and you will be connected shortly.')
                                    $('#click-message').show()
                                    break;
                                case 'Ways to Save':
                                    $('#click-message').text('We will let the agent know that you have a ways to save question, and you will be connected shortly.')
                                    $('#click-message').show()
                                    break;
                                default:
                                    console.log("not matching");
                            }
                        }

                        console.log('local storage chat data', sessionStorage_transcriptData);
                        //retrieving user chat history for the current session
                        if (sessionStorage_transcriptData.length > 0) {
                            $('.cx-transcript').append(`<div id="chat-transcript"><div id="chat-message--heading">Chat Transcript</div></div>`)
                            for (var i = 0; i < sessionStorage_transcriptData.length; i++)
                                $('#chat-transcript').append(`<div><span>Message ${i + 1}:</span> ${sessionStorage_transcriptData[i]} </div>`)
                        }
                    }
                }
                //dark-light mode toggle functionality
                $('#theme-toggle').click(function () {
                    var currentIcon = $('#theme-icon').html().trim(); // Get the current SVG content

                    if (currentIcon === darkModeIcon_light) {
                        $('#theme-icon').html(darkModeIcon_dark); // Switch to dark mode SVG
                        //mode change
                        oTestExtension.command('App.setTheme', { theme: 'dark' })
                    } else {
                        $('#theme-icon').html(darkModeIcon_light); // Switch to light mode SVG
                        oTestExtension.command('App.setTheme', { theme: 'light' })
                    }

                });

                // Set the initial icon
                $('#theme-icon').html(darkModeIcon_light); // Start with light mode

                //notification minimize functionality
                $('#notification-icon').click(function () {
                    console.log('notification button clicked')
                    $('.notification-section').remove()
                })

                //button click functionality
                $('#option-button-billing-question').click(function () {
                    console.log('billing question button clicked');
                    Subject_Data = Subject[0];
                    Category_Code_Data = Category_Code[0];
                    Sub_category_code_Data = Sub_category_code[0];
                    $('#queue-message').text(agentQueueMessage)
                    $('#click-message').text('We will let the agent know that you have a billing question, and you will be connected shortly.')
                    $('#click-message').show()
                    sessionStorage.setItem('formOptionButtonClick', "Billing Question")
                    oTestExtension.command('WebChatService.updateUserData',
                        {
                            preChatFormInput: "Billing Question"
                        }).done(function (e) {
                            // WebChatService updated user data successfully
                            console.log("WebChatService updated user data successfully")
                        }).fail(function (e) {
                            // WebChatService failed to update user data
                            console.log("WebChatService failed to update user data")
                        });
                });

                $('#option-button-how-to-pay-my-bill-copy').click(function () {
                    console.log('how to pay my bill copy button clicked');
                    Subject_Data = Subject[1];
                    Category_Code_Data = Category_Code[1];
                    Sub_category_code_Data = Sub_category_code[1];
                    $('#queue-message').text(agentQueueMessage)
                    $('#click-message').text('We will let the agent know that you have a Start, Transfer or Stop Service question, and you will be connected shortly.')
                    $('#click-message').show()
                    sessionStorage.setItem('formOptionButtonClick', "Start, Transfer or Stop Service")
                    oTestExtension.command('WebChatService.updateUserData',
                        {
                            preChatFormInput: "Start, Transfer or Stop Service"
                        }).done(function (e) {
                            // WebChatService updated user data successfully
                            console.log("WebChatService updated user data successfully")
                        }).fail(function (e) {
                            // WebChatService failed to update user data
                            console.log("WebChatService failed to update user data")
                        });
                });

                $('#option-button-make-a-payment').click(function () {
                    console.log('make a payment button clicked');
                    Subject_Data = Subject[2];
                    Category_Code_Data = Category_Code[2];
                    Sub_category_code_Data = Sub_category_code[2];
                    $('#queue-message').text(agentQueueMessage)
                    $('#click-message').text('We will let the agent know that you have a make a payment question, and you will be connected shortly.')
                    $('#click-message').show()
                    sessionStorage.setItem('formOptionButtonClick', "Make a Payment")
                    oTestExtension.command('WebChatService.updateUserData',
                        {
                            preChatFormInput: "Make a Payment"
                        }).done(function (e) {
                            // WebChatService updated user data successfully
                            console.log("WebChatService updated user data successfully")
                        }).fail(function (e) {
                            // WebChatService failed to update user data
                            console.log("WebChatService failed to update user data")
                        });
                });

                $('#option-button-ways-to-save').click(function () {
                    console.log('ways to save button clicked');
                    Subject_Data = Subject[3];
                    Category_Code_Data = Category_Code[3];
                    Sub_category_code_Data = Sub_category_code[3];
                    $('#queue-message').text(agentQueueMessage)
                    $('#click-message').text('We will let the agent know that you have a ways to save question, and you will be connected shortly.')
                    $('#click-message').show()
                    sessionStorage.setItem('formOptionButtonClick', "Ways to Save")
                    oTestExtension.command('WebChatService.updateUserData',
                        {
                            preChatFormInput: "Ways to Save"
                        }).done(function (e) {
                            // WebChatService updated user data successfully
                            console.log("WebChatService updated user data successfully")
                        }).fail(function (e) {
                            // WebChatService failed to update user data
                            console.log("WebChatService failed to update user data")
                        });
                });
            });
            //-------- Updates the customer data (received from session and local storage of sce.com) to agent
            if (browserLocalData !== null && browserSessionData !== null) {
                console.log("customerName:", customerName, "customerType:", customerType, "email:", email, "singleOrMulti:", singleOrMulti,
                    "customerAccountLevel1AuthBP:", customerAccountLevel1AuthBP, "customerAccountLevel1CustBP:", customerAccountLevel1CustBP,
                    "customerAccountLevel1CustBPName:", customerAccountLevel1CustBPName, "customerAccountLevel2:", customerAccountLevel2,
                    "customerAccountLevel3:", customerAccountLevel3, "contractNumber:", contractNumber, "oktaToken:", oktaToken, "BPNumber:", BPNumber, "serviceAccountNumber:", serviceAccountNumber)


                oTestExtension.command('WebChatService.updateUserData',
                    {
                        customerName: customerName,
                        customerType: customerType,
                        email: email,
                        singleOrMulti: singleOrMulti, email: email,
                        customerAccountLevel1AuthBP: customerAccountLevel1AuthBP,
                        customerAccountLevel1CustBP: customerAccountLevel1CustBP,
                        customerAccountLevel1CustBPName: customerAccountLevel1CustBPName,
                        customerAccountLevel2: customerAccountLevel2,
                        customerAccountLevel3: customerAccountLevel3,
                        landingPageName: currentPage,
                        primaryPhoneNumber: primaryPhoneNumber,
                        contractNumber: contractNumber,
                        serviceAccountNumber: serviceAccountNumber,
                        oktaToken: oktaToken,
                        BPNumber: BPNumber

                    }).done(function (e) {
                        // WebChatService updated user data successfully
                        console.log("WebChatService updated user data successfully")
                    }).fail(function (e) {
                        // WebChatService failed to update user data
                        console.log("WebChatService failed to update user data")
                    });
            }

            // function to maintain the session and refresh the token
            function maintainChatSession() {
                shouldFetch = true;
                if (window.liveChatWidget && typeof window.liveChatWidget.maintainSession === 'function') {
                    window.liveChatWidget.maintainSession()
                    console.log("window.liveChatWidget.maintainSession function call")
                }
                else {
                    console.error("liveChatWidget.maintainSession function not available")
                }
                // If the flag is still true, schedule the next fetch
                if (shouldFetch) {
                    setTimeout(maintainChatSession, 180000); // Call fetchAPI again after 3 minutes
                }

            }
            maintainChatSession()


        }
        main()


    })


    oTestExtension.subscribe('WebChatService.started', function (e) {
        console.log('webchatservice started subscribed');
        //alert user for inactivity
        var _genesys = {
            chat: {
                onReady: function (chat) {

                    chat.onSession(function (session) {
                        var timeout = 30000,  // 1 minute
                            sessionTimeout;

                        function startCountdown() {
                            sessionTimeout = setTimeout(function () {
                                oTestExtension.command('Toaster.open', {

                                    type: 'generic',
                                    title: 'Chat session',
                                    body: 'Do you wish to continue with the Chat ?',
                                    // icon: 'chat',
                                    controls: 'close',
                                    immutable: false,
                                    buttons: {

                                        type: 'binary',
                                        primary: 'Yes',
                                        secondary: 'No'
                                    }

                                })

                                oTestExtension.subscribe('Toaster.opened', function (e) {
                                    $('.cx-btn.cx-btn-default').click(function () {
                                        console.log('No button clicked !!!');
                                        oTestExtension.command('WebChatService.endChat') // end chat

                                    });
                                    $('.cx-btn.cx-btn-primary').click(function () {
                                        console.log('YES button clicked !!!');
                                        oTestExtension.command('Toaster.close') // close toaster
                                        session.leave();
                                    });
                                })

                            }, timeout);
                        }

                        session.onMessageReceived(function (event) {
                            clearTimeout(sessionTimeout);
                            startCountdown();
                        });
                    });
                    // function call to check wheather okta session id is valid or no
                    checkOKTASessionId()
                    //function call to check if the mandatory parameters are avilable or not
                    checkMandatoryParametersAvailable()

                    const chatWidget = document.getElementsByClassName('.cx-widget');
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.target.style.display === 'none') {
                                closeChat();
                            }
                        })

                    })
                    observer.observe(chatWidget, { attributes: true, attributeFilter: ['style'] })
                    console.log(chatWidget, observer, "getElementsByClassName")

                }
            }
        };
    });

    // function to check okta session id is valid or not
    function checkOKTASessionId() {
        const oktaSessionId = oktaToken;
        if (!oktaSessionId) {
            //toaster open 
            oTestExtension.command('Toaster.open', {
                type: 'generic',
                title: 'Chat session',
                body: 'Sorry, we are unable to verify your login information at this time. Please enter your user ID and password to sign in, or try again later.',
                // icon: 'chat',
                controls: 'close',
                immutable: false
            })
        }
        else {
            console.log("OKTA Session ID is valid", oktaSessionId)
        }
    }

    //One or more mandatory parameters(first name, last name and current page) are missed in chat 
    function checkMandatoryParametersAvailable() {

        if (!firstName && !lastName && !currentPage) {
            //toaster open 
            oTestExtension.command('Toaster.open', {
                type: 'generic',
                title: 'Chat session',
                body: 'Sorry, we are unable to locate your account details due to missing information. Please close your browser, then try logging in again.',
                // icon: 'chat',
                controls: 'close',
                immutable: false
            })
        }
        else {
            console.log("One or more mandatory parameters are missed in chat")
        }
    }

    //agent connected to the chat
    oTestExtension.subscribe('WebChatService.agentConnected', function (e) {
        console.log('webchatservice agentConnected subscribed');
        $('#queue-message').remove()

        oTestExtension.command('WebChatService.getAgents').done(function (e) {

            // WebChatService got agents successfully
            // e == Object with agents information in chat
            console.log('agent details:', e);
            agentName = e.agents[3].name
            console.log('agent name', agentName);
            //editing "Chat Ended" message from server
            $(document).ready(function () {
                $('.cx-message-text').each(function () {
                    // Get the current text of the element
                    let currentText = $(this).text();

                    // Construct the message based on agentName
                    let message = agentName ? `${agentName} is connected to chat and will help you.` : null;

                    if (currentText.trim() === " Connected") {

                        let divTag = `<div id='agent-connected-message'>${message}</div>`
                        $(this).append(divTag)
                    }
                });
            });


        })
    })


    //agent disconnected from the chat
    oTestExtension.subscribe('WebChatService.agentDisconnected', function (e) {
        console.log('webchatservice agentDisconnected subscribed');
    })


    //message added (check user messages)
    oTestExtension.subscribe('WebChat.messageAdded', function (e) {
        console.log('webchat message added');
        //current chat session message
        oTestExtension.command('WebChatService.getTranscript').done(function (e) {

            // WebChatService got transcript successfully
            // e == Object with an array of messages
            console.log(e, 'chat transcript 2');
            //setting transcriptData length as 0
            transcriptData.length = 0
            if (e.originalMessages.length) {
                // Get the current timestamp or a unique identifier for the data
                const timestamp = new Date().toISOString();


                for (var i = 0; i < e.originalMessages.length; i++) {
                    //chat transcript displaying on screen
                    if (e.originalMessages[i]?.messageType === 'text') {
                        transcriptData.push(e.originalMessages[i].text)
                        console.log('Transcript data', transcriptData);

                    }
                }
            }

        })

    })


    //when the chat session is ended
    oTestExtension.subscribe('WebChatService.ended', function (e) {
        console.log('webchat service ended subscribed');

        // clearing the timer for fetch api
        stopFetching()

        //editing "Chat Ended" message from server
        $(document).ready(function () {

            $('.cx-message-text').each(function () {
                // Get the current text of the element
                let currentText = $(this).text();

                if (currentText.trim() === "Chat Ended") {

                    // Construct the message based on agentName
                    let message = agentName ? `${agentName} has ended this chat` : 'Chat Ended';
                    // Create a new div with the message
                    let newDiv = `<div style="width: 70%; margin: 0 auto; text-align: center; font-weight: 700">${message}</div>`;

                    // Update the element with the new div
                    $(this).html(newDiv);
                    $(this).append(chatEndMessage)
                }
            });

            //feedback form
            $('#feedback-button').click(function () {
                window.open('https://pluggedincustomers.sce.com/c/r/SCElivechat', '_blank');
            })

        });


        //current chat session message
        oTestExtension.command('WebChatService.getTranscript').done(function (e) {

            // WebChatService got transcript successfully
            // e == Object with an array of messages
            console.log(e, 'chat transcript 1');
            if (e.originalMessages.length) {
                // Get the current timestamp or a unique identifier for the data
                const timestamp = new Date().toISOString();


                for (var i = 0; i < e.originalMessages.length; i++) {

                    //SAP activity API
                    if (e.originalMessages[i]?.messageType === 'text') {
                        transcriptString = transcriptString + `${e.originalMessages[i].text}\n`
                        console.log('transcript string', transcriptString);
                    }
                }
            }

        })


        // SAP activity API function 
        async function SAP_Activity_Call() {
            try {
                let phone_call_response_data
                let phone_call_notes_response_data
                const data = {
                    subject: Subject_Data,
                    category: Category_Code_Data,
                    subCategoryKUT: Sub_category_code_Data,
                    typeKUT: "131"
                }
                phone_call_response_data = await apiCall_SAP_Activity_PhoneCall(data)
                    .then(async (data) => {
                        try {
                            const phoneID = data.results.ID
                            console.log('phoneID', phoneID);
                            const notes_data = {
                                "phoneCallID": phoneID,
                                "text": transcriptString,
                                "typeCode": "10072"
                            }
                            phone_call_notes_response_data = await apiCall_SAP_Activity_PhoneCall_Notes(notes_data)
                            console.log('phone call notes data updated', phone_call_notes_response_data)
                        } catch (error) {
                            console.error('phone call notes api error ', error);
                        }

                    })
                    .catch((error) => {
                        console.error('PhoneID fetch error', error);
                    })

                console.log('phone call response data:', phone_call_response_data)
            } catch (error) {
                console.error('phone call api error:', error);
            }
        }

        //SAP activity API function call
        SAP_Activity_Call()
    });

    oTestExtension.subscribe('WebChat.chatEnded', function (e) {
        console.log('webchat ended subscribed')


    });
    oTestExtension.subscribe('WebChat.closed', function (e) {
        console.log('webchat closed subscribed !!!');
        window.liveChatWidget.onChatWindowClose() 
    })


    ///window is removed from screen
    oTestExtension.subscribe('WindowManager.changed', function (e) {
        console.log('webchat window manager subscribed !!!');

        //adding user data in localstorage
        if (transcriptData.length > 0) {
            sessionStorage.setItem('chatTranscriptData', JSON.stringify(transcriptData))
        }

        oTestExtension.command('WebChatService.endChat')

    })



    // function to get session and local v storage data
    async function openWebChatIfDataExists() {
        console.log("Inside openWebChatIfDataExists")
        oTestExtension.command('WebChatService.getSessionData').then(async sessionData => {
            try {
                sessionDataGenesys = sessionData;
                // Retrieves the browser sessionStorage and localStorage data
                browserSessionData = JSON.parse(await Promise.resolve(sessionStorage.getItem('myaccountDetails')));
                browserLocalData = JSON.parse(await Promise.resolve(localStorage.getItem('userInfo')));
                console.log("Active session data:", sessionData, browserSessionData, browserLocalData)
                //customer type(residential) from local storage
                customerType = browserLocalData.accountType;
                // customer name from session data
                firstName = browserSessionData.firstName;
                lastName = browserSessionData.lastName;
                customerName = firstName + " " + lastName;
                //customer mail id
                email = browserLocalData.email;
                console.log("loginCredentals", firstName, lastName, email)
                //single or multi from session storage
                singleOrMulti = sessionStorage.getItem('isSingleCa') === true
                // primary customer account levels  from local storage
                customerAccountLevel1AuthBP = browserLocalData.profileData.accountData.authBusinessPartners
                customerAccountLevel1CustBP = browserLocalData.profileData.accountData.mainBusinessPartner.businessPartnerNumber
                customerAccountLevel1CustBPName = browserLocalData.profileData.accountData.mainBusinessPartner.BPName
                customerAccountLevel2 = browserLocalData.profileData.accountDetails.contractAccountNumber
                customerAccountLevel3 = browserLocalData.profileData.accountDetails.contractNavigation[0].contractNumber
                // contract Number from myaccountDetails
                contractNumber = browserSessionData.contractAccountNumber;
                //oktaToken from userInfo
                oktaToken = browserLocalData.profileData.oktaSessionId;
                //bpNumber from userInfo account Details
                BPNumber = browserLocalData.profileData.accountDetails.bpNumber;
                //Service Account Number
                serviceAccountNumber = browserLocalData.profileData.accountDetails.contractNavigation[0].contractNumber; //should update with the path
                // currentPage
                currentPage = sessionStorage.getItem('currentPage');
                primaryPhoneNumber = browserLocalData.profileData.profile.primaryPhone;
            }
            catch (error) {
                console.error("Error retrieving session data:", error)
            }
        })
    }
    openWebChatIfDataExists();



    //--------Function to end the chat session-----------------------
    window.liveChatWindow = {
        closeChatWindow: () => {
            CXBus.command("WebChat.endChat").always(() => CXBus.command("WebChat.close"), {
                data: {},
                onSuccess: function (response) {
                    console.log("Chat session ended successfully:", response)
                },
                onFailure: function (error) {
                    console.error("Failed to end chat session:", error)
                }
            })
        },
        startChat: () => {
            startChat()
        },
        isSessionActive: async () => {
            const res = await CXBus.command('WebChatService.verifySession');
            return res.sessionActive

        }
    }



    async function startChat() {

        try {
            browserSessionData = JSON.parse(await Promise.resolve(sessionStorage.getItem('myaccountDetails')));
            browserLocalData = JSON.parse(await Promise.resolve(localStorage.getItem('userInfo')));
            firstName = browserSessionData.firstName;
            lastName = browserSessionData.lastName;
            customerName = firstName + " " + lastName;
            //customer mail id
            email = browserLocalData.email;
            try {
                if (typeof CXBus !== 'undefined') {
                    if (firstName !== undefined && lastName !== undefined && email !== undefined) {
                        CXBus.command("WebChat.open", {
                            form: {
                                autoSubmit: true,
                                firstname: firstName,
                                lastname: lastName,
                                email: email,
                                subject: 'webchat'
                            }
                        })
                    }
                }
            }
            catch (commandError) {
                console("Error executing webChat open command :", commandError)
                alert("webChat failed to open")
            }
        }
        catch (error) {
            console.error("Error retrieving session data:", error)
        }
    }
    // startChat();

};

