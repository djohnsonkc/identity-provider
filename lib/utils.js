

//example usage
//var utils = require('./lib/utils');
//var a = [1, 2, 3, 4];
//var b = [3, 4, 5];
//var c = utils.intersection(a,b);

//intesection of 2 simple arrays
exports.intersection = function (a, b) {
    var c = [];
    j = 0;
    for (var i = 0; i < a.length; ++i) {
        if (b.indexOf(a[i]) != -1)
            c[j++] = a[i];
    }

    return c;
}

//checks if a value exists in an array
exports.arrayContains = function (ary, k) {
    for (var p in ary)
        if (ary[p] === k)
            return true;
    return false;
}


exports.createRandomPassword = function (length, callback) {

    var crypto = require('crypto');

    //generate an access token
    var password = '';
    crypto.randomBytes(length, function (ex, buf) {
        password = buf.toString('hex');
        console.log("password: " + password);

        callback(password);
    });


}


exports.passwordHash = function (password) {

    var crypto = require('crypto');

    var hash = crypto.createHash('md5').update(password).digest('hex');
    
    //console.log(hash); // 9b74c9897bac770ffc029102a200c5de

    return hash;

}

