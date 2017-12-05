module.exports = {

    validateStr: (label, str, maxLen) => {

        str = str.trim().replace(/<(?:.|\n)*?>/gm, '');
        if (str === "") {
            return label + " cannot be blank";
        } else if (str.length > maxLen) {
            return label + " cannot be over " + maxLen + " characters";
        } else {
            return ""
        }
    },

    validateInt: (label, i, len) => {
        i = i.trim().replace(/<(?:.|\n)*?>/gm, '');
        if (!(i)) {
            return label + " cannot be blank";
        } else if (!(/^\d+$/.test(i))) {
            return label + " must be a number"
        } else if (i.toString().length != len) {
            return label + " must be " + len + " digits";
        } else {
            return ""
        }
    },

    validatePrice: (label, price) => {
        i = price.trim().replace(/<(?:.|\n)*?>/gm, '');
        if (!(i)) {
            return label + " cannot be blank";
        } else if (!(/^\d+\.?\d{0,2}$/.test(i))) {
            return label + " must be a number";
        } else {
            return "";
        }
    },

// Takes phone string and returns numbers
    getPhoneFromInput:  (input) => {
        var re = /[0-9]/g;
        phone = input.match(re);
        if (phone) {
            phone = phone.join("");
            return phone;
        }
        return "";
    },

// Given input, returns the response body as JSON
// There may be a better way to do this
    parseResponseBody: (response) => {
        return JSON.parse(JSON.parse(JSON.stringify(response._bodyInit)));
    },

}