function isNumber(evt) {
    var returnVal = true,
        charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        if ((evt.ctrlKey || evt.metaKey) && (charCode == 97 || charCode == 99 || charCode == 118)) {
            returnVal = true;
        }
        returnVal = false;
    }
    return returnVal;
}
var moveToNext = function (evt, element, prevElement, nextElement, numberOfDigitsToValidate) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 13) {
        validateAndSubmit(numberOfDigitsToValidate);
    } else {
        if (element.value != null && element.value != '' && element.value != 'undefined' && element.value.length > 2 || charCode == 190 || charCode == 110) {
            if (nextElement) {
                document.getElementById(nextElement).focus();
            }
        }
        if (charCode == 37) {
            document.getElementById(prevElement).focus();

        }
        if (charCode == 39) {
            document.getElementById(nextElement).focus();
        }
    }

}
var disableBackSpace = function (evt, element, prevElement) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 8 || charCode === 46) {
        if (element.value != null && element.value != '' && element.value != 'undefined') {
            element.value = '';
        } else {
            if (prevElement != null) {
                document.getElementById(prevElement).value = "";
                document.getElementById(prevElement).focus();
            }
        }
    }
}

var pasteValues = function (element) {

    setTimeout(function () {
        var values = element.value.split(".");
        var regex = /^\d+$/;


        for (var index in values) {
            if (values[index].length < 4 && regex.test(values[index])) {
                var location = index;
                var inputBox = 'ip' + (location++) + '';
                document.getElementById(inputBox).value = values[index];
            }
            else {
                var nonint = values[index].replace(/\D/g, '');
                var location = index;
                var inputBox = 'ip' + (location++) + '';
                document.getElementById(inputBox).value = nonint.substring(0, 3);
            }

        };
            if (document.getElementById('ip3').value != '') {
                document.getElementById('ip3').focus();
            }
            else
            {
                return;
            }
    }, 0); //or 4
};

