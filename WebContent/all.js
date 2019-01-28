
function getMessage(keyMsg, typeMsg, titleMsg) {

    // var lang = getCookie("KanclerLocaleCookie");
    var lang = "ru";
    var textMessage;
    var msg = {
        textMsg : "",
        titleMsg : ""
    };

    if(keyMsg === 'error'){
        textMessage = typeMsg;
        showMessages('danger', titleMsg);
        return;
    }

    title = titleMsg === null || titleMsg === undefined ? getDefaultTitle() : titleMsg;

    $.ajax({
        type: 'get',
        url: "http://localhost:8080/ajax/messages?key=" + keyMsg + "&lang=" + lang  + "&title=" + title,
        success: function (data) {
            msg = data;
            textMessage = msg.textMsg;
            showMessages(typeMsg, msg.titleMsg )
        },
        error: function errorResponse() {
            textMessage = 'Не получен ответ от сервера!';
            showMessages('danger','404:');
        }
    });

    function showMessages( typeMsg, title) {
        $.notify({
            title: title,
            message: textMessage
        }, {
            type: 'pastel-' + typeMsg,
            delay: 3000,
            z_index: 9999,
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '<span data-notify="title">{1}</span>' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
    }

    function getDefaultTitle() {
        var def;
        switch (typeMsg) {
            case 'success': def = 'user.msg.title.default-success';
                break;
            case 'info': def = 'user.msg.title.default-info';
                break;
            case 'warning': def = 'user.msg.title.default-warning';
                break;
            case 'danger': def = 'user.msg.title.default-danger';
                break;
        }
        return def;
    }
}