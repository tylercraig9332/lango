const User = require('./User')
const crypto = require('crypto')

async function create(body) {
    body.salt = crypto.randomBytes(16).toString('hex')
    body.password = crypto.pbkdf2Sync(body.password, body.salt, 10000, 512, 'sha512').toString('hex');
    let newUser = new User(body)
    await newUser.save()
    return await _readByUsername(body.username)
}

async function read(body) {
    let user = await User.findOne(body, (err, user) => {
        if (err) console.log(err)
    })
    return {
        username: user.username,
        id: user._id,
        email: user.email,
        meta: user.meta,
        createdAt: await user._id.getTimestamp()
    }
}

async function _readByUsername(username) {
    let user = await User.findOne({username: username}, (err, user) => {
        if (err) console.log(err)
    })
    return {
        username: user.username,
        id: user._id,
        email: user.email,
        meta: user.meta,
        createdAt: await user._id.getTimestamp()
    }
}

async function _readById(_id) {
    let user = await User.findById(_id, (err, user) => {
        if (err) console.log(err)
    })
    return {
        username: user.username,
        id: user._id,
        email: user.email,
        meta: user.meta,
        createdAt: await user._id.getTimestamp()
    }
}

async function update() {

}

async function _delete() {

}

function validate(data, callback) {
    User.findOne({username: data.username}, (err, user) => {
        if (err) console.error(err)
        console.log('USER: ', user)
        if (user === null) throw Error('User does not exist')
        const hash = crypto.pbkdf2Sync(data.password, user.salt, 10000, 512, 'sha512').toString('hex');
        if (user.password === hash) {
            callback(null, {
                username: user.username,
                id: user._id,
                email: user.email,
                meta: user.meta,
                createdAt: user._id.getTimestamp()
            })
        } else {
            console.log('incorrect password')
            throw new Error('Incorrect Password')
        }
    })
}

module.exports = {
    create,
    read,
    update,
    _delete: _delete,
    validate
}