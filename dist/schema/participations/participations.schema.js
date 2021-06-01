"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participations = void 0;
const mongoose = require("mongoose");
const ParticipationsSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});
exports.Participations = mongoose.model('Participations', ParticipationsSchema);
//# sourceMappingURL=participations.schema.js.map