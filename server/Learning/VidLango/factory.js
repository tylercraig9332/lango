const Resource = require('./VidLango')
const SavedResource = require('../../Interaction/Save')
const { checkConnection } = require('../../mongoose');

function create(body) {
    let v = new Resource(body)
    return v.save()
}

function read(body, options, callback) {
    checkConnection()
    /*const options = {
        skip: (page - 1) * 8,
        limit: 8,
        sort: {_id: 'desc'}
    }*/
    Resource.find(body, null, options, (err, res) => {
        if (err) {
            console.error(err)
            callback(err, res)
            return
        }
        callback(null, res)
    })
}

function read_saved(body, options, user, callback) {
    checkConnection()
    SavedResource.find({user: user}, null, options, (err, docs) => {
        if (err || docs === undefined) callback(err, [])
        let data = docs.map(document => {
            if (document.parentType === 'VidLango') {
                return new Promise((resolve, reject) => {
                    Resource.findOne({_id: document.parent, ...body}, (err, doc) => {
                        if (err) reject(err)
                        resolve(doc)
                    })
                })
            }
        })
        Promise.all(data).then(documents => {
            data = documents.filter((element) => {
                return element !== undefined && element !== null;
             });
            callback(null, data)
        }).catch(err => {
            console.error(err)
            callback(err, [])
        })
    })
}

async function update(by, body, callback) {
    await checkConnection()
    if (body.captions !== undefined || body.captions.length > 0) {
        body.captionsAvaliable = await body.captions.map((caption) => caption.lCode)
    }
    Resource.updateOne(by, body, (err, doc) => {
        if (err) throw new Error(err)
        callback(err, doc)
    })
}

function _delete() {

}

module.exports = {
    create,
    read,
    read_saved,
    update,
    delete: _delete
}