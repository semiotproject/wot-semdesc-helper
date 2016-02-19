import $ from 'jquery';
import { URLS } from './config';

export function createModel(ttl) {
    return $.ajax({
        type: "POST",
        url: URLS.model,
        data: ttl.replace(/\n/g, " "),
        contentType: "text/turtle"
    });
}