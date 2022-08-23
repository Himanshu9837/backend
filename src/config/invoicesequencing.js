const mongoose = require("mongoose");

const invoicecounterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
});

const invoicecounter = mongoose.model('invoicecounter', invoicecounterSchema);

const getSequenceNextValue = (seqName) => {
    return new Promise((resolve, reject) => {
        invoicecounter.findByIdAndUpdate(
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
    const newCounter = new invoicecounter({ _id: seqName, seq: 1 });
    return new Promise((resolve, reject) => {
    newCounter.save()
        .then(data => {
            resolve(data.seq);
        })
        .catch(err => reject(error));
    });
}
module.exports = {
    invoicecounter,
    getSequenceNextValue,
    insertCounter
}