import CONFIG from './config';

const PREFIXES = {
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    ssn: 'http://purl.oclc.org/NET/ssnx/ssn#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    ssncom: 'http://purl.org/NET/ssnext/communication#',
    saref: 'http://ontology.tno.nl/saref#',
    mcht: 'http://purl.org/NET/ssnext/machinetools#',
    qudt: 'http://qudt.org/schema/qudt#',
    "qudt-quantity": 'http://qudt.org/vocab/quantity#',
    "qudt-unit": "http://qudt.org/vocab/unit#",
    mmi: "http://mmisw.org/ont/mmi/device#",
    om: 'http://purl.org/ifgi/om#',
    prov: 'http://www.w3.org/ns/prov#',
    foaf: 'http://xmlns.com/foaf/0.1/',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    dul: "http://www.loa-cnr.it/ontologies/DUL.owl#",
    emtr: "http://purl.org/NET/ssnext/electricmeters#",
    "climate-feature": "https://purl.org//NET/ssnext/climate-feature#",
    fipa: "https://purl.org/fipa/ontology#",
    dcterms: "http://purl.org/dc/terms/",
    proto: "http://w3id.org/semiot/ontologies/proto#",
    geo: "http://www.w3.org/2003/01/geo/wgs84_pos#",
    semdesc: CONFIG.SEMDESC_PREFIX
};

export const JSONPrefixes = PREFIXES;

export const SPARQLPrefixes = (() => {
    let str = [];
    for (let key in PREFIXES) {
        str.push(`PREFIX ${key}: <${PREFIXES[key]}>`);
    }
    return str.join('\n') + '\n';
})();

export const TurtlePrefixes = (() => {
    let str = [];
    for (let key in PREFIXES) {
        str.push(`@prefix ${key}: <${PREFIXES[key]}>.`);
    }
    return str.join('\n') + '\n';
})();
