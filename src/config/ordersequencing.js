const mongoose = require("mongoose");

const ordercounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
});

const ordercounter = mongoose.model('ordercounter', ordercounterSchema);

const getSequenceNextValue = (seqName) => {
    return new Promise((resolve, reject) => {
        ordercounter.findByIdAndUpdate(
            { "_id": seqName },
            { "$inc": { "seq": 1 } }
            , (error, counter) => {
                if (error) {
                    reject(error);
                }
                if(counter) {
                    resolve(counter.seq + 1);
                } else {
                    resolve(null);
                }
            });
    });
};

const insertCounter = (seqName) => {
    const newCounter = new ordercounter({ _id: seqName, seq: 1 });
    return new Promise((resolve, reject) => {
    newCounter.save()
        .then(data => {
            resolve(data.seq);
        })
        .catch(err => reject(error));
    });
}
module.exports = {
    ordercounter,
    getSequenceNextValue,
    insertCounter
}