import { TlookupTransmission } from './tlookup-transmission';
import { describe, it } from 'node:test';
import assert from 'node:assert';


// describe('Transmission', function(){
//
//   const transmission = new TlookupTransmission();
//
//   it('rpcRequest', function(){
//
//     return transmission.rpcRequest('session-stats')
//     .then(data=>{
//       // console.log(data.body)
//       assert.equal(data.body.result, "success");
//       assert.ok(data.body.arguments);
//     })
//
//   });
//
//
//
//   it('torrentAdd', function(){
//
//     let file = __dirname + '/fixtures/t1/Sheltered [rutracker.org].t5364696.torrent';
//     let location = __dirname + '/fixtures/t1/gog_sheltered_2.1.0.2.sh';
//
//     return transmission.torrentAdd(file, location, {paused:true})
//       .then(result=>{
//         console.log(result);
//         assert.ok(result.id);
//         assert.ok(result.name);
//         assert.ok(result.hashString);
//
//       });
//   });
//
//
//   it('push and torrentGet', function(){
//
//     let file = __dirname + '/fixtures/t2/Quake 4 [rutracker.org].t963112.torrent';
//     let location = __dirname + '/home/maksim/Downloads';
//
//     let expectedWanted = [
//       false,
//       false,
//       true,
//       false,
//       true,
//       true,
//       false
//     ];
//
//     return transmission.push(file, location, {paused:true})
//       .then(result=>{
//         // console.log(result);
//         assert.ok(result.id);
//         assert.ok(result.name);
//         assert.ok(result.hashString);
//
//         return t.torrentGet(result.id, ['fileStats']);
//       })
//       .then(result=>{
//         // console.log(prettyFormat(result[0].fileStats));
//
//         let wanted = result[0].fileStats.map(f=>f.wanted);
//
//         assert.deepEqual(wanted, expectedWanted);
//
//       });
//   });
//
//
//
//
//
//
// });

describe('Transmission', function () {

    it('static', function () {

        const tests = [
            ["application/json; charset=UTF-8", 'application/json', "UTF-8"],
            ["application/json", 'application/json', null]
        ];

        for (const test of tests) {
            assert.equal(TlookupTransmission.getContentType(test[0]), test[1]);
            assert.equal(TlookupTransmission.getCharset(test[0]), test[2]);
        }

    });
});
