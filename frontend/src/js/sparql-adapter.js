"use strict";

import $ from 'jquery';
import _ from 'lodash';
import CONFIG from './config';
import SPARQLPrefixes from './prefixes';

function getQueryResult(query, accept) {
    return $.ajax({
        url: CONFIG.URLS.endpoint,
        data: {
            query: SPARQLPrefixes + query
        },
        headers: {
            Accept: accept
        },
        error() {
            console.error('failed to execute query: ', query);
        }
    });
}

function getSparqlJsonResult(query) {
    return getQueryResult(query, "application/sparql-results+json");
}

function getJsonLdResult(query) {
    return getQueryResult(query, "application/ld+json");
}

export function loadClassList() {
    /*
    return getSparqlJsonResult(`
        SELECT ?class WHERE {
           ?class ?a ?b .
        }
    `);
    */
    const promise = $.Deferred();

    promise.resolve(_.range(6).map((i) => {
        return {
            uri: 'http://example.com/' + i,
            label: 'Device #' + i,
            author: {
                username: 'soylent-grin'
            }
        };
    }));

    return promise;
}
export function loadClassDetail(classURI) {
    return getSparqlJsonResult(`
        CONSTRUCT { ?a ?b ?c . } WHERE {
           GRAPH ${classURI} { ?a ?b ?c } .
        }
    `);
}

export function loadMeasurementProperties() {
    return getSparqlJsonResult(`
        TODO
    `);
}
export function loadUnitsOfMeasurement() {
    return getSparqlJsonResult(`
        TODO
    `);
}
export function loadSensorTypes() {
    return getSparqlJsonResult(`
        TODO
    `);
}