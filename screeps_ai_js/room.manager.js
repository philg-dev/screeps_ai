// snippet
// var roomManager = require('room.manager'); roomManager.initAccessPoints(Game.rooms['E36N43']);
// var roomManager = require('room.manager'); roomManager.initTaggedTargets(Game.rooms['E36N43']);

var roomManager = {
    
    initAccessPoints : function(room) {
        var center = room.controller.pos;
        
        var top = center.y - 3;
        var left = center.x - 3;
        var bottom = center.y + 3;
        var right = center.x + 3;
        room.visual.rect(left, top, right - left, bottom - top);
        
        var areaTerrain = room.lookForAtArea(LOOK_TERRAIN, top, left, bottom, right, true);
        /*
        for (var cell of areaTerrain) {
            console.log(cell.terrain);
        }
        */
        var accessibleTerrain = _.filter(areaTerrain, (cell) => { return cell.terrain !== 'wall'; });
        var accessibleRoomPositions = [];
        for (var cell of accessibleTerrain) {
            accessibleRoomPositions.push(new RoomPosition(cell.x, cell.y, room.name));
        }
        console.log("accessible cells around room controller: " + accessibleTerrain.length);
        
        room.memory.rcAccessPoints = [];
        
        var sources = room.find(FIND_SOURCES);
        for (var src of sources) {
            var closestCell = src.pos.findClosestByPath(accessibleRoomPositions, { ignoreCreeps : true })
            if ( closestCell ) {
                // TODO: avoid duplicates (multiple sources having closest path to same cell - don't add x/y when rcAccessPoints already contains it)
                room.memory.rcAccessPoints.push( new RoomPosition(closestCell.x, closestCell.y, room.name) );
            }
        }
    },

    initTaggedTargets : function(room) {
    	// used to track the number of creeps "working" on a given target.
    	// different kinds of targets might have different max numbers of creeps simultaneously working on them
    	room.memory.taggedTargets = new Object();
    }
    
}


module.exports = roomManager;