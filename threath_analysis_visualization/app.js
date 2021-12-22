// Forces redraw on troublesome DOM elements
// (for cross-browser compatability support)
$.fn.redraw = function() {
    $(this).each(function() {
        var redraw = this.offsetHeight;
    });
};

// Selection, highlight state variables
var selected_entities = [],
    selected_topic = -1,
    selected_doc_id = -1,
    show_all_docs = false;

// Row/column element selection groups
var col_groups = null;

// Formatting specifications
var label_configs = null;
var m_width = 5,
    m_height = 4,
    cell_width = 40,
    cell_height = 20;

// Entity, distribution data objects (json)
var entity_map = null,
    topic_distr = null,
    word_distr = null,
    corpus = null;

// Application configuration data
var app_config = null;

// Event handler definitions
var event_handlers = {

    /* Term associativity grid handlers */

    'heatmap': {
        'mouseover': function (col_id) {
            // Ignore if mousing over active selection
            if (col_id === selected_topic) return;

            // Paint border highlights with active mouse hovering colors
            var i = 0;
            col_groups[col_id].forEach(cell => {
                if (i === 0) {
                    // Top cell of column
                    $(cell).css({
                        'border-top-width': '3px',
                        'border-top-style': 'solid',
                        'border-top-color': app_config['heatmap']['rgb-hover'],
                        'border-left-width': '2px',
                        'border-left-style': 'solid',
                        'border-left-color': app_config['heatmap']['rgb-hover'],
                        'border-right-width': '2px',
                        'border-right-style': 'solid',
                        'border-right-color': app_config['heatmap']['rgb-hover'],
                    });
                }
                else if (i === selected_entities.length) {
                    // Bottom cell of column
                    $(cell).css({
                        'border-bottom-width': '3px',
                        'border-bottom-style': 'solid',
                        'border-bottom-color': app_config['heatmap']['rgb-hover'],
                        'border-left-width': '2px',
                        'border-left-style': 'solid',
                        'border-left-color': app_config['heatmap']['rgb-hover'],
                        'border-right-width': '2px',
                        'border-right-style': 'solid',
                        'border-right-color': app_config['heatmap']['rgb-hover'],
                    });
                }
                else {
                    // A middle cell of column
                    $(cell).css({
                        'border-left-width': '2px',
                        'border-left-style': 'solid',
                        'border-left-color': app_config['heatmap']['rgb-hover'],
                        'border-right-width': '2px',
                        'border-right-style': 'solid',
                        'border-right-color': app_config['heatmap']['rgb-hover'],
                    });
                }
                ++i;
            });
        },
        'mouseout': function (col_id) {
            // Ignore if mouse moving out of active selection region
            if (col_id === selected_topic) return;

            // Remove border highlights
            var i = 0;
            col_groups[col_id].forEach(cell => {
                if (i === 0) {
                    // Top cell of column
                    $(cell).css({
                        'border-top-width': '0px',
                        'border-left-width': '0px',
                        'border-right-width': '0px',
                    });
                }
                else if (i === selected_entities.length) {
                    // Bottom cell of column
                    $(cell).css({
                        'border-bottom-width': '0px',
                        'border-left-width': '0px',
                        'border-right-width': '0px',
                    });
                }
                else {
                    // A middle cell of column
                    $(cell).css({
                        'border-left-width': '0px',
                        'border-right-width': '0px',
                    });
                }
                ++i;
            });
        },
        'onclick': onclick_handler = function (col_id) {
            // If a previous selection was active then use moutout handler
            // to clear it
            if (selected_topic !== -1) {
                var old_id = selected_topic;
                selected_topic = -1;
                event_handlers['heatmap']['mouseout'](old_id);
                $('#heatmap').redraw();  // Browser compatability
            }

            // Paint border highlights with active selection colors
            var i = 0;
            col_groups[col_id].forEach(cell => {
                if (i === 0) {
                    // Top cell of column
                    $(cell).css({
                        'border-top-width': '3px',
                        'border-top-style': 'solid',
                        'border-top-color': app_config['heatmap']['rgb-select'],
                        'border-left-width': '2px',
                        'border-left-style': 'solid',
                        'border-left-color': app_config['heatmap']['rgb-select'],
                        'border-right-width': '2px',
                        'border-right-style': 'solid',
                        'border-right-color': app_config['heatmap']['rgb-select'],
                    });
                }
                else if (i === selected_entities.length) {
                    // Bottom cell of column
                    $(cell).css({
                        'border-bottom-width': '3px',
                        'border-bottom-style': 'solid',
                        'border-bottom-color': app_config['heatmap']['rgb-select'],
                        'border-left-width': '2px',
                        'border-left-style': 'solid',
                        'border-left-color': app_config['heatmap']['rgb-select'],
                        'border-right-width': '2px',
                        'border-right-style': 'solid',
                        'border-right-color': app_config['heatmap']['rgb-select'],
                    });
                }
                else {
                    // A middle cell of column
                    $(cell).css({
                        'border-left-width': '2px',
                        'border-left-style': 'solid',
                        'border-left-color': app_config['heatmap']['rgb-select'],
                        'border-right-width': '2px',
                        'border-right-style': 'solid',
                        'border-right-color': app_config['heatmap']['rgb-select'],
                    });
                }
                ++i;
            });

            // Set selected topic and call document view build methods
            selected_topic = col_id;
            var doc_list = build_filtered_doc_list(app_config['settings']['score_threshold']);
            build_docview($('#document-selector'), doc_list);
        }
    },

    /* Document selection view handlers */

    'doc-selection': {
        'mouseover': function(caller) {
            var children = $(caller).children();
            $(children[0]).css({
                'border-top-width': '2px',
                'border-top-style': 'solid',
                'border-top-color': app_config['document-panel']['rgb-hover'],
                'border-left-width': '2px',
                'border-left-style': 'solid',
                'border-left-color': app_config['document-panel']['rgb-hover'],
                'border-bottom-width': '2px',
                'border-bottom-style': 'solid',
                'border-bottom-color': app_config['document-panel']['rgb-hover']
            });
            $(children[1]).css({
                'border-top-width': '2px',
                'border-top-style': 'solid',
                'border-top-color': app_config['document-panel']['rgb-hover'],
                'border-right-width': '2px',
                'border-right-style': 'solid',
                'border-right-color': app_config['document-panel']['rgb-hover'],
                'border-bottom-width': '2px',
                'border-bottom-style': 'solid',
                'border-bottom-color': app_config['document-panel']['rgb-hover']
            });
        },
        'mouseout': function(caller) {
            var children = $(caller).children();
            $(children[0]).css({
                'border-top-width': '0px',
                'border-left-width': '0px',
                'border-bottom-width': '0px',
            });
            $(children[1]).css({
                'border-top-width': '0px',
                'border-right-width': '0px',
                'border-bottom-width': '0px',
            });
        },
        'onclick': function(caller) {
            selected_doc_id = caller.doc_id;
            $('#doc-viewer-overlay').css({'display': 'block'});
            $('#doc-viewer-panel').text(get_document_text(caller.doc_id));
        },
        'doc-view-toggle': function(c) {
            show_all_docs = !show_all_docs;
            var doc_list = build_filtered_doc_list(app_config['settings']['score_threshold']);
            build_docview($('#document-selector'), doc_list);
        }
    },

    /* Modal document viewer event handlers */

    'doc-viewer': {
        'modal-close': function() {
            $('#doc-viewer-overlay').css({'display': 'none'});
        }
    }
}

/**
 * Generates a list of integers in the range [begin, end). The begin value is included
 * in the list, the end value is excluded.
 * 
 * @param {*} begin Begin integer value in range (included)
 * @param {*} end End integer value in range (excluded)
 * @returns List of integer
 */
 function range(begin, end) {
    return [...Array(end - begin).keys()].map(i => i + begin);
}

/**
 * Loads application data.
 */
 function load_data() {     
    // Load application configuration settings
    app_config = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'app_config.json',
            'dataType': 'json',
            'success': function(data) {
                json = data;
            }
        })
        return json;
    })();

    // Load word, topic distribution data
    var json = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'data/word_topic_distr.json',
            'dataType': 'json',
            'success': function(data) {
                json = data;
            }
        });
        return json;
    })();
    entity_map = create_type_map(json['vocabulary']);
    word_distr = json['word_distr'];
    topic_distr = json['topic_distr'];

    // Get label id's and label color mappings
    json = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'data/label_config.json',
            'dataType': 'json',
            'success': function(data) {
                json = data;
            }
        })
        return json;
    })();
    label_configs = build_label_config_db(json);

    // Get tagged document corpus
    corpus = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'data/tagged_corpus.json',
            'dataType': 'json',
            'success': function(data) {
                json = data;
            }
        })
        return json;
    })();
}

/**
 * Creates a dictionary of label -> [entity list] entries for easy interface entity selection
 * updates.
 * @param {*} vocab_json JSON vocab object containing {'entity': name, 'label': type} pairs
 */
function create_type_map(vocab_json) {
    var type_map = {},
        i = 0;
    vocab_json.forEach(entity_label_pair => {
        var entity = entity_label_pair['entity'],
            label = entity_label_pair['label'];
        if (!type_map.hasOwnProperty(label)) {
            type_map[label] = [{'id': i, 'text': entity}];
        }
        else {
            type_map[label].push({'id': i, 'text': entity});
        }
        ++i;
    });
    return type_map;
}

/**
 * Builds the label formatting database.
 * @param {*} label_config_json 
 * @returns 
 */
function build_label_config_db(label_config_json) {
    var label_configs = {};
    label_config_json.forEach(config_obj => {
        label_configs[config_obj['text']] = {
            'id': config_obj['id'],
            'background-color': config_obj['backgroundColor'],
            'textcolor': config_obj['textColor']
        }
    });
    return label_configs;
}

function build_type_descr_map() {
    var map = {
        'date': 'Date',
        'organization': 'Organization',
        'event': 'Event',
        'person': 'Person of Interest',
        'location': 'Location/Address',
        'quantity': 'Quantity',
        'artifact': 'Artifact',
        'travel': 'Travel/Routes',
        'city': 'City',
        'activity': 'Activity',
        'role': 'Role/Occupation',
        'redflag': 'Red Flag/Suspicious',
        'country': 'Country',
        'geopolitical': 'Geopolitical Status',
        'status': 'Status/State',
        'state': '(US) State',
        'phone': 'Phone #',
        'business': 'Business/Corporation',
        'time': 'Time',
        'quote': 'Direct Quotation'
    };
    return map;
}

function index_of_entity(arr, ent_id) {
    var retval = -1;
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i]['id'] === ent_id) {
            retval = i;
            break;
        }
    }
    return retval;
}

function get_document_text(doc_id) {
    for (var i = 0; i < corpus.length; ++i) {
        if (doc_id === corpus[i]['id'])
            return corpus[i]['text'];
    }
    return 'NA';
}

/**
 * Fills a selection box with the supplied options.
 * @param {*} elem DOM element or jQuery object holding the selection box
 * @param {*} options List of options (entity {'text', 'id'} pairs)
 * @param {*} css_formatting CSS formatting applied to the options
 */
function fill_selection_box(elem, options, selected, label_ids) {
    $(elem).empty();
    if (options.length > 0) {
        var i = 0;
        options.forEach(option => {
            var ent_id = option['id'];
            if (index_of_entity(selected, ent_id) === -1) {
                $(elem).append('<option id="sel-' + ent_id + '" value="' + ent_id + '">' + option['text'] + '</option>');
                var config = label_configs[label_ids.length > 1 ? label_ids[i] : label_ids[0]],
                    css_formatting = {
                        'background-color': config['background-color'],
                        'color': config['textcolor']
                    }
                $('#sel-' + ent_id).css(css_formatting);
                ++i;
            }
        });
    }
}

/**
 * Converts hexidecimal RGB string to decimal array for interpolation,
 * and vice versa.
 * @param {*} color Color value. Hexidecimal RGB string or 3-element decimal array.
 * @returns Converted color representation.
 */
function convert_rgb(color) {
    if (typeof(color) === 'object') {
        // Convert rgb decimal array to hex string
        var hex_str = "#";
        color.forEach(channel => {
            var conv = channel.toString(16);
            if (conv.length < 2) conv = "0" + conv;
            hex_str = hex_str.concat(conv);
        })
        return hex_str;
    }
    else {
        // Convert hex string to rgb decimal array
        return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16)
        ];
    }
}

/**
 * Generates an RGB value by interpolation between a min and max RGB value.
 * @param {*} colors Min, max color values in hex string format.
 * @param {*} degree Degree of interpolation.
 * @returns 
 */
function interpolate_rgb(colors, degree) {
    // Get RGB arrays for low and high color range limits
    var low_color = convert_rgb(colors[0]),
        high_color = convert_rgb(colors[1]);
    
    // Interpolate
    var interpolated = [
        Math.round((high_color[0] - low_color[0])*degree + low_color[0]),
        Math.round((high_color[1] - low_color[1])*degree + low_color[1]),
        Math.round((high_color[2] - low_color[2])*degree + low_color[2])
    ];

    // Convert back to hex string and return
    return convert_rgb(interpolated);
}

/**
 * Generates an RGB value by inverse interpolation between a min and max RGB value.
 * @param {*} colors Min, max color values in hex string format.
 * @param {*} degree Degree of interpolation.
 * @returns 
 */
 function inverse_interpolate_rgb(colors, degree) {
    // Get RGB arrays for low and high color range limits
    var low_color = convert_rgb(colors[0]),
        high_color = convert_rgb(colors[1]);
    
    // Interpolate
    var interpolated = [
        Math.round((high_color[0] - low_color[0])*(1.0 - degree) + low_color[0]),
        Math.round((high_color[1] - low_color[1])*(1.0 - degree) + low_color[1]),
        Math.round((high_color[2] - low_color[2])*(1.0 - degree) + low_color[2])
    ];

    // Convert back to hex string and return
    return convert_rgb(interpolated);
}

/**
 * Finds the datapoint for the entity with the given ID in the distribution data.
 * @param {*} distr_over_topic 
 * @param {*} ent_id 
 * @returns 
 */
function get_entity_data(distr_over_topic, ent_id) {
    for (var i = 0; i < distr_over_topic.length; ++i) {
        if (distr_over_topic[i]['id'] === ent_id) {
            return distr_over_topic[i]['prob'];
        }
    }
    return null;
}

/**
 * Fills in a row of the heatmap using the supplied word distribution scores.
 * If the word distribution array is empty then the row is tagged "No selection"
 * and left un-colored.
 * @param {*} row_elem 
 * @param {*} entity_text 
 * @param {*} entity_id
 * @param {*} word_distr 
 */
function fill_matrix_row(row_elem, entity_text, entity_id, word_distr) {
    var cells = [];
    row_elem.append(
        '<div class="LabelCell" style="border-top-color: black; border-top-style: solid; border-top-width: 1px">'
        + (word_distr.length === 0 ? '&lt;No selection&gt;' : entity_text)
        + '</div>'
    );
    if (word_distr.length === 0) {
        for (var i = 0; i < topic_distr[0].length; ++i) {
            var cell = $('<div class="ValCell"></div>');
            row_elem.append(cell);
        }
    }
    else {
        var i = 0;
        word_distr.forEach(distr_over_topic => {
            var prob = get_entity_data(distr_over_topic, entity_id),
                bg_color = interpolate_rgb([app_config['heatmap']['rgb-cool'], app_config['heatmap']['rgb-hot']], prob),
                font_color = inverse_interpolate_rgb([app_config['heatmap']['rgb-cool'], app_config['heatmap']['rgb-hot']], prob),
                cell = $('<div class="ValCell">' + Math.round(prob*100000)/100000 + '</div>');
                //cell = $('<div class="ValCell"></div>');
            row_elem.append(cell);
            cell[0]['col_id'] = i;  // Attach column IDs to div objects
            cell.css({'background-color': bg_color, 'color': font_color, 'cursor': 'pointer'});
            cell.mouseover(function() { event_handlers['heatmap']['mouseover'](this.col_id); });
            cell.mouseout(function() { event_handlers['heatmap']['mouseout'](this.col_id); });
            cell.click(function() { event_handlers['heatmap']['onclick'](this.col_id); });
            cells.push(cell[0]);
            ++i;
        });
    }
    return cells;
}

function build_heatmap(selected) {
    var rows = [],          // Array of DOM elements comprising rows of heatmap matrix
        header_cells = [];  // Array holding DOM elements for the heatmap header row
    var dom_heatmap_header = $('<div class="Row"></div>');

    // Clear current table and build matrix headers
    $('#heatmap').empty();
    dom_heatmap_header.append('<div class="LabelCell"></div>');
    for (var i = 0; i < word_distr.length; ++i) {
        var cell = $('<div class="HeaderCell" id="head-' + i + '">' + i + '</div>');
        if (selected.length > 0) {
            cell[0]['col_id'] = i;  // Attach column IDs to div objects
            cell.css({'cursor': 'pointer'});
            cell.mouseover(function() { event_handlers['heatmap']['mouseover'](this.col_id); });
            cell.mouseout(function() { event_handlers['heatmap']['mouseout'](this.col_id); });
            cell.click(function() { event_handlers['heatmap']['onclick'](this.col_id); });
        }
        header_cells.push(cell[0]);
        dom_heatmap_header.append(cell);
    }
    rows.push(header_cells);
    $('#heatmap').append(dom_heatmap_header);

    // Build rows
    if (selected.length === 0) {
        var dom_heatmap_row = $('<div class="Row"></div>');
        fill_matrix_row(dom_heatmap_row, null, null, []);
        $('#heatmap').append(dom_heatmap_row);
    }
    else {
        selected.forEach(entity => {
            var dom_heatmap_row = $('<div class="Row"></div>');
            rows.push(
                fill_matrix_row(
                    dom_heatmap_row, entity['text'], entity['id'], word_distr
                )
            );
            $('#heatmap').append(dom_heatmap_row);
        });
    }
    // Return interactable heatmap cells in column-major matrix
    return d3.transpose(rows);
}

/**
 * Builds a filtered list of documents based on a given threshold.
 * Documents with scores that fall below the threshold will not be
 * included in the returned list.
 * 
 * @param {*} threshold Filter threshold
 * @returns Filtered list of documents meeting the minimum theshold
 */
function build_filtered_doc_list(threshold) {
    doc_list = [];
    corpus.forEach(doc_obj => {
        // Document ID's are sequential and coincide with topic
        // distribution indeces, but begin at offset 42
        var topic_idx = doc_obj['id'] - 42,
            doc_score = topic_distr[topic_idx][selected_topic];
        if (doc_score >= threshold || show_all_docs) {
            doc_list.push({'id': doc_obj['id'], 'datestamp': doc_obj['datestamp'], 'score': doc_score});
        }
    });
    return doc_list;
}

/**
 * Builds the document view using the supplied list of corpus document objects.
 * 
 * @param {*} elem_docview DOM element for the document view table or jQuery wrapper
 * @param {*} doc_list (Filtered) list of documents to build in view
 */
function build_docview(elem_docview, doc_list) {
    // Empty previous document view contents
    elem_docview.empty();

    if (doc_list.length === 0) {
        // Populate with empty document row if no documents in list
        var empty_row = $('<div class="Row"></div>');
        empty_row.append('<div class="doc-column-date">&lt;No selection&gt;</div>');
        empty_row.append('<div class="doc-column-score"></div>');
        elem_docview.append(empty_row);
    }
    else {
        // Populate with report date and score for each document in list
        doc_list.forEach(doc_obj => {
            // Build and configure row contents
            var bg_color = interpolate_rgb([app_config['document-panel']['rgb-cool'], app_config['document-panel']['rgb-hot']], doc_obj['score']),
                font_color = inverse_interpolate_rgb([app_config['document-panel']['rgb-cool'], app_config['document-panel']['rgb-hot']], doc_obj['score']),
                doc_row = $('<div class="Row"></div>'),
                date_cell = $('<div class="doc-column-date">' + doc_obj['datestamp'] + '</div>'),
                score_cell = $('<div class="doc-column-score">' + Math.round(100000 * doc_obj['score'])/100000 + '</div>');
            
            date_cell.css({
                'background-color': bg_color
            })
            score_cell.css({
                'background-color': bg_color
            })
            doc_row.append(date_cell);
            doc_row.append(score_cell);
            doc_row.css({
                'color': font_color,
                'cursor': 'pointer'
            });
            doc_row[0].doc_id = doc_obj['id'];

            // Configure event handlers
            doc_row.mouseover(function() { event_handlers['doc-selection']['mouseover'](this); });
            doc_row.mouseout(function() { event_handlers['doc-selection']['mouseout'](this); });
            doc_row.click(function() { event_handlers['doc-selection']['onclick'](this); });

            // Append new row to document view
            elem_docview.append(doc_row);
        });
    }
}

$(function() {
    // Load and prepare entity map, distribution data for use
    load_data();

    /* Configure interface control groups */

    // Configure entity type selector control group and selection change handler
    var label_map = build_type_descr_map(),
        enttype_selector = $('#enttype-selector');
    $('#sel-current').css({
        'background-color': '#ffffff',
        'color': '#000000'
    });
    Object.keys(entity_map).forEach(label => {
        var option_elem = $('<option id="sel-' + label +
                            '" value="' + label + '"' +
                            (label === 'redflag' ? 'selected' : '') +
                            '>' + label_map[label] + '</option>');
        enttype_selector.append(option_elem);
        $('#sel-' + label).css({
            'background-color': label_configs[label]['background-color'],
            'color': label_configs[label]['textcolor']
        });
    });
    enttype_selector.change(function() {
        var selected_type = $(this).val();
        var selector_config = null;
        if (selected_type == "current") {
            selector_config = {
                'background-color': '#ffffff',
                'color': '#000000'
            };
        }
        else {
            selector_config = {
                'background-color': label_configs[selected_type]['background-color'],
                'color': label_configs[selected_type]['textcolor']
            };
        }
        $(this).css(selector_config);
        fill_selection_box(
            $('#entity-selector'),
            selected_type == 'current' ? selected_entities : entity_map[selected_type],
            selected_entities,
            [$('#enttype-selector').val()]
        );
    })
    
    var ent_selector = $('#entity-selector'),
        default_enttype = $('#enttype-selector').val();
    css_formatting = {
        'background-color': label_configs[default_enttype]['background-color'],
        'color': label_configs[default_enttype]['textcolor']
    }
    fill_selection_box(ent_selector, entity_map[default_enttype], [], [$('#enttype-selector').val()]);
    $('#enttype-selector').css(css_formatting);

    $('#btn-right').click(function() {
        var selected = $('#entity-selector option:selected'),
            selected_ids = $('#entity-selector').val();
        var i = 0;
        selected_ids.forEach(elem => {
            selected_entities.push(
                {'id': parseInt(elem), 'text': selected[i]['label'],
                 'label_id': label_configs[$('#enttype-selector').val()]['id'],
                 'label': $('#enttype-selector').val()
                }
            );
            ++i;
        });
        $('#entity-selected').append(selected);
    });
    $('#btn-left').click(function() {
        // On left-button click remove a selected entity from the selected entity panel
        var selected_ids = $('#entity-selected').val();
        selected_ids.forEach(ent_id => {
            var i = 0;
            for (; i < selected_entities.length; ++i) {
                if (selected_entities[i]['id'] === parseInt(ent_id)) {
                    break;
                }
            }
            selected_entities.splice(i, 1);
        })

        // Get labels of selected entities, and repopulate selection box
        labels = []
        selected_entities.forEach(entity => {
            labels.push(entity['label']);
        });
        fill_selection_box($('#entity-selected'), selected_entities, [], labels);

        // Redraw entity selection panel in case the entity should be put back
        fill_selection_box($('#entity-selector'), entity_map[$('#enttype-selector').val()], selected_entities, [$('#enttype-selector').val()]);
    })

    $('#btn-update').click(function() {
        // On left-button click update heatmap
        selected_topic = -1; // Reset any previous selection
        build_docview($('#document-selector'), []);
        col_groups = build_heatmap(selected_entities);
    });

    // Configure document viewer toggle
    $('#cb-alldocs-toggle').click(function() {event_handlers['doc-selection']['doc-view-toggle'](); });
    // Configure modal dialog close button
    $('#btn-modal-close').click(function() { event_handlers['doc-viewer']['modal-close'](); });

    // $('.controlgroup').control_group(
    //     {'direction': 'vertical'}
    // );
    col_groups = build_heatmap([]);

    // Set control panel background colors
    $('FIELDSET').each(function() {
        $(this).css({'background-color': app_config['control-panel']['rgb-background']});
    })

    // Build document viewer panel
    build_docview($('#document-selector'), []);
});
