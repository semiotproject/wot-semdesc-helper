"use strict";

import _ from 'lodash';
import JSONPrefixes from './prefixes';

const CONTEXT = _.assign(JSONPrefixes, {
    //
});
/*
  "@context": {
    "dul": "http://www.loa-cnr.it/ontologies/DUL.owl#",
    "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "geosparql": "http://www.opengis.net/ont/geosparql#",
    "hmtr": "http://purl.org/NET/ssnext/heatmeters#",
    "limap": "http://data.uni-muenster.de/php/vocab/limap",
    "limapext": "http://purl.org/NET/limapext#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
    "ssncom": "http://purl.org/NET/ssnext/communication#",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "@graph": [
    {
      "@id": uri,
      "@type": "ssn:System",
      "rdfs:label": uri,
      'ssn:hasSubsystem':: json. [
        {
          "@id": "coap://10.1.1.1:6500:6500/meter/temperature"
        }
      ]
    },
    {
      "@id": "coap://10.1.1.1:6500:6500/meter/temperature",
      "@type": "ssn:Sensor",
      "ssn:observes": {
        "@id": "hmtr:Temperature"
      }
    }
  ]
 */
const TEMPLATE = {
    '@context': CONTEXT,
    '@graph': []
};

export function JSONLDtoClass(jsonld) {
    let triples = jsonld['@graph'];

    function findById(id) {
        let trip =  _.find(triples, (t) => {
            return t['@id'] === id;
        });
        if (!trip) {
            return id;
        }
        trip = _.assign({}, trip);

        trip['uri'] = trip['@id'];
        trip['@id'] = undefined;

        return trip;
    }

    function normaliseTriple(t) {
        console.log('normalizing ', t);
        if (typeof t === 'object') {
            if (Object.keys(t).length === 1) {
                t = normaliseTriple(findById(t['@id']));
            } else {
                for (let key in t) {
                    t[key] = normaliseTriple(t[key]);
                }
            }
        } else if (t instanceof Array) {
            t.forEach((tt, index) => {
                t[index] = normaliseTriple(t[index]);
            });
        }
        /*
        if (typeof t === "object") {
            console.log(`${JSON.stringify(t)} is object`);
            for (let key in t) {
                if (typeof t[key] === "object" && t[key]['@id']) {
                    t[key] = normaliseTriple(findById(t[key]['@id']));
                } else if (t[key] instanceof Array) {
                    t[key].forEach((tt, index) => {
                        debugger;
                        t[key][index] = normaliseTriple(t[key][index]);
                    });
                }
            }
        } else if (t instanceOf Array)
        */
        console.log('t now is ', t);
        return t;
    }

    let c = normaliseTriple(_.find(triples, (t) => {
        return t['@type'] === 'prov:Entity';
    }));

    c.uri = c['@id'];
    c['@id'] = undefined;

    return c;
}

export function classToJSONLD(json) {
    // create immutable copy
    json = _.assign({}, json);
    let template = _.assign({}, TEMPLATE);
    let graph = template['@graph'];

    graph.push({
        '@id': json.uri,
        '@type': "ssn:System",
        'rdfs:label': json.label,
        'ssn:hasSubsystem': json.sensors.map((s, index) => {
            return {
                '@id': json.uri + '/sensor/' + s.id
            };
        })
    });


    template['@graph'] = graph.concat(json.sensors.map((s, index) => {
        return {
            '@id': json.uri + '/sensor/' + s.id,
            '@type': "ssn:Sensor",
            'ssn:observes': {
                '@id': s.type
            }
        };
    }));

    return template;
}