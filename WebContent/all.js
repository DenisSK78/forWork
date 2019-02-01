//getMassage notify
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

    function showMessages(typeMsg, title) {
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

var validatorC = {

    /**
     * date format: 'dd.mm.yyyy'
     * @param selector HTML-object (for example: $('#input_id') (JQuery))
     * @param {boolean} booleanShowRed if parameter true show red for input (optional)
     * @param {boolean} booleanDefaultMsg if parameter  true show default message (optional)
     * @return {boolean} false if is not Date
     */
    isDate: function (selector, booleanShowRed, booleanDefaultMsg) {
        var date = $(selector).val();
        var show = false;
        var msg = false;
        if (booleanShowRed === true) show = true;
        if (booleanDefaultMsg === true) msg = true;
        if (validDateString(date)) { return true; }
        else {
            if (msg) getMessage('user.msg.wrong-date-datepicker', 'warning');
            if (show) showValidError(selector, 3000);
            return false;
        }
    },

    /**
     * date format: 'dd.mm.yyyy'
     * @param selector HTML-object (for example: $('#input_id') (JQuery))
     * @param {string} datePattern date for compare date format: 'dd.mm.yyyy'
     * @param {boolean} booleanShowRed if parameter true show red for input (optional)
     * @param {boolean} booleanDefaultMsg if parameter  true show default message (optional)
     * @return {boolean} false if is not Date or less then pattern date
     */
    isDateAndEqualsOrMoreThen: function (selector, datePattern, booleanShowRed, booleanDefaultMsg) {
        var date = $(selector).val();
        var show = false;
        var msg = false;
        if (booleanShowRed === true) show = true;
        if (booleanDefaultMsg === true) msg = true;

        if (validDateString(date))
            if (parseDateValid(date) >= parseDateValid(datePattern))
                return true;
            else {
                showFalse(msg, show);
                return false;
            }
        else {
            showFalse(msg, show);
            return false;
        }

        function showFalse(msg, show) {
            if (msg) getMessage('user.msg.wrong-date-datepicker', 'warning');
            if (show) showValidError(selector, 3000);
        }
    }
};

//date format: dd.mm.yyyy
function validDateString(date) {
    var regexp = /^(((0[1-9]|[12]\d|3[01])\.(0[13578]|1[02])\.((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\.(0[13456789]|1[012])\.((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\.02\.((19|[2-9]\d)\d{2}))|(29\.02\.((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/;
    return date.search(regexp) >= 0;
}

//date format: dd.mm.yyyy
function parseDateValid(valDateStr) {
    var date = valDateStr.split('.');
    return new Date(parseInt(date[2], 10) , parseInt(date[1], 10) - 1, parseInt(date[0], 10));
}

//show error use bootstrap class 'has-error' or need create css with this name
function showValidError(selector, time){
    $(selector).addClass("has-error");
    setTimeout(function () {
        $(selector).removeClass("has-error");
    }, time);
}