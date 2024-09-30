function apiCall_EWT() {
    return jQuery.ajax({
        url: `${HOST_URL}:${PORT}/genesys/2/ewt/ewt2`,
        type: 'GET',
        success: function (response) {


            console.log('ewt response:', response);


        },
        error: function (error) {
            console.error('ewt error:', error)
        }
    })
}

function apiCall_PIQ() {
   
    return jQuery.ajax({
        url: `${HOST_URL}:${PORT}/genesys/1/internal_statistic`,
        type: 'POST',
        data: {
            metric: 'CurrNumberWaitingCalls',
            objectType: 'Queue',
            objectId: 'vq_CHAT@ioc_switch',
            tenant: 'Resources'
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function (response) {

            console.log('piq respone', response);

        },
        error: function (error) {
            console.error('piq error:', error)
        }
    })

}

function apiCall_RMIU() {
    return jQuery.ajax({
        url: `${HOST_URL}:${PORT}/genesys/2/ewt/ewt2`,
        type: 'GET',
        success: function (response) {


            console.log('ewt response:', response);


        },
        error: function (error) {
            console.error('ewt error:', error)
        }
    })
}


function apiCall_contact_details(){
    return jQuery.ajax({
        url: `${HOST_URL}/api/v2/contacts?limit=100&sortBy=name&order=Ascending`,
        type: 'GET',
        success: function (response) {


            console.log('contact details response:', response);


        },
        error: function (error) {
            console.error('contact details error:', error)
        }
    })
}

function apiCall_RetrieveContactHistory(){
    return jQuery.ajax({
        url: `${HOST_URL}/api/v2/ucs/contacts/${id}/interactions`,
        type: 'GET',
        success: function (response) {


            console.log('contact history response:', response);


        },
        error: function (error) {
            console.error('contact history error:', error)
        }
    })
}


function apiCall_SAP_Activity_PhoneCall(data){

    return jQuery.ajax({
        url: `https://apiutcld.sce.com/sce/ut/v1.0/customer/activity/phonecall`,
        type: 'POST',
        data: JSON.stringify(data),
        headers: {
            'X-IBM-Client-Id':clientID,
            'X-IBM-Client-Secret':clientSecret
        },
        contentType: 'application/json',
        success: function (response) {

            console.log('SAP Activity PhoneCall', response);

        },
        error: function (error) {
            console.error('SAP Activity PhoneCall error:', error)
        }
    })
}

function apiCall_SAP_Activity_PhoneCall_Notes(data){

    return jQuery.ajax({
        url: `https://apiutcld.sce.com/sce/ut/v1.0/customer/activity/phonecall/notes`,
        type: 'POST',
        data: JSON.stringify(data),
        headers: {
            'X-IBM-Client-Id':clientID,
            'X-IBM-Client-Secret':clientSecret
        },
        contentType: 'application/json',
        success: function (response) {

            console.log('SAP Activity PhoneCall', response);

        },
        error: function (error) {
            console.error('SAP Activity PhoneCall error:', error)
        }
    })
}
