var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_key';

exports.createToken= function(user) {
    var payload={
        sub:user.id,
        name:user.name,
        rol:user.rol,
        status:user.status,
        image:user.images,
        iat:moment().unix(),
        exp:moment().add(35,'minute').unix()
    }
    return jwt.encode(payload,secret);
}