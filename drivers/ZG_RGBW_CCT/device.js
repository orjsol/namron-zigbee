'use strict';

// # Basic

// ManufacturerName: "Sunricher"
// ProductID: "RGBW-CCT", "RGBW Lighting", "RGB-CCT"
// DeviceID: 528
// ProfileID: 49246

// # copiis (github)

// ManufacturerName: "Osram"
// ProductID: "Flex RGBW"
// DeviceID: 528
// ProfileID: 49246

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

module.exports = class ZG_RGBW_CCT extends ZigBeeLightDevice {}