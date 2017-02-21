/**
 * Created by hyunwoo on 2017-02-20.
 */
let __Formatter = new function () {
    /**
     * @return {string}
     */
    this.number = function (val) {
        if (_.isInteger(val)) {
            return nFormatter(val,1);
        } else {
            return val.toFixed(2);
        }
    };

    function nFormatter(num, digits) {
        var si = [
            {value: 1E18, symbol: "E"},
            {value: 1E15, symbol: "P"},
            {value: 1E12, symbol: "T"},
            {value: 1E9, symbol: "G"},
            {value: 1E6, symbol: "M"},
            {value: 1E3, symbol: "k"}
        ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
        }
        return num.toFixed(digits).replace(rx, "$1");
    }
};