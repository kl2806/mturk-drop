var record_count = 0
var question_cnt = 0
var total_question_count = 0
var current_question_count = 0
passages = []
answers = []
passage_ids = []
var annotations = []
var total_num_passages = 1
var colors = ["yellow", "burlywood", "lightcyan", "cornsilk", "coral", "darksalmon", "gold", "hotpink",
            "lightcoral", "lemonchiffon", "pink", "orange", "Gainsboro", "indianred", "papayawhip", "peachpuff",
            "lightsalmon", "lightseagreen", "PALEGOLDENROD", "KHAKI", "PINK", "MOCCASIN"]
fetch_passages_with_retries(3)

// create json for final submission
function final_submit() {
    add_question()
    var root = document.getElementById("generated_answers")
    for (var j = 0; j < total_num_passages; j++) {
        var passage_id_el = document.createElement("input")
        passage_id_el.id = "passage-id-" + j
        passage_id_el.name = "passage-id-" + j
        passage_id_el.value = passage_ids[j]
        passage_id_el.style.display = 'none'
        passage_id_el.type = "text"
        root.appendChild(passage_id_el)
    }
    for (var key in annotations) {

        var annotation = annotations[key]

        var answer = annotation.answer

        var question_el = document.createElement("input")
        question_el.value = annotation.question
        question_el.id = "input-question-" + key
        question_el.name = "input-question-" + key
        question_el.type = "text"
        question_el.style.display = 'none'
        root.appendChild(question_el)

        var question_el = document.createElement("input")
        question_el.value = annotation.question
        question_el.id = "input-question-corrected-" + key
        question_el.name = "input-question-corrected-" + key
        question_el.type = "text"
        question_el.style.display = 'none'
        root.appendChild(question_el)

        for (var category_iter = 0; category_iter < annotation.category.length; category_iter++) {
            var category_el = document.createElement("input")
            category_el.value = annotation.category[category_iter]
            category_el.id = "category-" + key+ "-" + category_iter
            category_el.name = "category-" + key + "-" + category_iter
            category_el.style.display = 'none'
            root.appendChild(category_el)
        }

        for (var highlights_iter = 0; highlights_iter < annotation.highlights.start_index.length; highlights_iter++) {
            var highlight_el = document.createElement("input")
            highlight_el.value = annotation.highlights.start_index[highlights_iter] + "-" + annotation.highlights.end_index[highlights_iter]
            highlight_el.id = "highlight-" + key + "-" + highlights_iter
            highlight_el.name = "highlight-" + key + "-" + highlights_iter
            highlight_el.style.display = 'none'
            root.appendChild(highlight_el)
        }

        if (annotation.answer.checked == "span") {
            for (var i = 0; i < annotation.answer.spans.length; i++) {
                var span_el = document.createElement("input")
                span_el.id = "span-" + key + "-" + i
                span_el.name = "span-" + key + "-" + i
                span_el.type = "text"
                span_el.value = annotation.answer.spans[i]
                span_el.style.display = 'none'
                root.appendChild(span_el)
            }
        } else if (annotation.answer.checked == "date") {
            var year_el = document.createElement("input")
            year_el.type = "number"
            year_el.id = "year-" + key
            year_el.name = "year-" + key
            year_el.value = annotation.answer.date.year
            year_el.style.display = 'none'
            root.appendChild(year_el)

            var month_el = document.createElement("input")
            month_el.type = "text"
            month_el.id = "month-" + key
            month_el.name = "month-" + key
            month_el.value = annotation.answer.date.month
            month_el.style.display = 'none'
            root.appendChild(month_el)

            var day_el = document.createElement("input")
            day_el.type = "number"
            day_el.id = "day-" + key
            day_el.name = "day-" + key
            day_el.value = annotation.answer.date.day
            day_el.style.display = 'none'
            root.appendChild(day_el)

        } else if (annotation.answer.checked == "digit") {
            var value_el = document.createElement("input")
            value_el.type = "number"
            value_el.step = "any"
            value_el.id = "value-" + key
            value_el.name = "value-" + key
            value_el.value = annotation.answer.digit.value
            value_el.style.display = 'none'
            root.appendChild(value_el)

        }

    }
    document.getElementById("submission").style.display = ""
    document.getElementById("submitButton").style.display = ""
    document.getElementById("submitButton").disabled = false
    document.getElementById("comment").style.display = ""
    document.getElementsByClassName("main_container")[0].style.display = "none"
    return true;
}

// make question editable
function question_edit() {
    if (document.getElementById("edit_bool_yes").checked) {
        document.getElementById("input-question-copy").style.backgroundColor="white"
        document.getElementById("input-question-copy").style.display = ""
        document.getElementById("input-question-copy").readOnly = false
    } else if (document.getElementById("edit_bool_no").checked) {
        document.getElementById("input-question-copy").style.display = "none"
        document.getElementById("input-question-copy").readOnly = true
    }
}

// load dataset locally for debugging
function load_annotations() {
    loadJSON("http://localhost:8000/drop_dataset_10_28.json", function (response) {
        var annotations = JSON.parse(response);
        var passage_ids = Object.keys(annotations);
        for (var i = 0; i < 5; i++) {
            var j = Math.floor(Math.random() * (passage_ids.length + 1));
            var key = passage_ids[j]
            passage_text = annotations[key]["passage"]
            answer = annotations[key]["qa_pairs"]
            passages.push(passage_text)
            answers.push(answer)
        }
        populate_passage("next");
    });
}

// highlight spans in passahe or question
function attach_span_selection() {
    if (!window.x) {
        x = {};
    }

    x.Selector = {};
    x.Selector.getSelected = function () {
        var t = '';
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();           
        } else if (document.selection) {
            t = document.selection.createRange().text;
        }
        return t;
    }

    var passage_control = x.Selector.getSelected()
    var highlighted_text = passage_control.toString().trim();

    if (highlighted_text != "") {
        
        var color_idx = Math.floor(Math.random() * colors.length)
        add_highlight_span(passage_control.baseOffset + "-" + (passage_control.extentOffset-1))
        var visible_spans = get_spans(true, "highlightspan", "span_table")
        var current_span = visible_spans[visible_spans.length-1]
        current_span.value = highlighted_text;
        current_span.style.backgroundColor = colors[color_idx]           
        highlight_range(passage_control.getRangeAt(0), colors[color_idx], visible_spans.length - 1)
      
    }
}

// get the start and end index of the selected span
function highlight_range(range, color_name, id) {
    var newNode = document.createElement("span");
    newNode.id = "highlightedspan-" + id
    newNode.setAttribute(
        "style",
        "background-color: " + color_name +" ; display: inline;"
    );
    range.surroundContents(newNode);
}

//  populate the global variables with the fetched annotations
function parse_passages(response) {
    if (response.status !== 200) {
        error_passages()
        return;
    }

    response.json().then(function (annotations) {        
        var all_passage_ids = Object.keys(annotations);
        for (var i = 0; i < total_num_passages; i++) {
            var j = Math.floor(Math.random() * (all_passage_ids.length));
            var key = all_passage_ids[j]
            passage_text = annotations[key]["passage"]
            answer = annotations[key]["qa_pairs"]
            passages.push(passage_text)
            answers.push(answer)
            passage_ids.push(key)
            total_question_count += answer.length
        }
        populate_passage("next");
        return;
    });

}

// display error if fetch fails TODO: add static passages for annotations when fetch fails like collection HIT
function error_passages(response) {
    console.log('Looks like there was a problem. Status Code: ' +
        response.status);
   
}

// fetch annotations from s3
function fetch_passages_with_retries(n) {
    var data_url = "https://s3.us-east-2.amazonaws.com/sparc-dataset/drop_dataset_valid.json"
    fetch(data_url)
        .then(parse_passages)
        .catch(function (error) {
            if (n === 1) return reject(error_passages);
            fetch_passages_with_retries(n - 1)
                .then(parse_passages)
                .catch(error_passages);
        })

}

// load local json for local debugging only
function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


// remove annotation highlights on mouse out
function reset_higlight() {
    var parent = document.getElementsByClassName("passage-sample")[0]
    var q1_span = parent.getElementsByClassName("ans_span1_high")
    var q2_span = parent.getElementsByClassName("ans_span2_high")
    var q3_span = parent.getElementsByClassName("ans_span3_high")
    var q4_span = parent.getElementsByClassName("ans_span4_high")
    var q5_span = parent.getElementsByClassName("ans_span5_high")
    var q6_span = parent.getElementsByClassName("ans_span6_high")
    var q7_span = parent.getElementsByClassName("ans_span7_high")
    var q8_span = parent.getElementsByClassName("ans_span8_high")
    var q9_span = parent.getElementsByClassName("ans_span9_high")
    var q10_span = parent.getElementsByClassName("ans_span10_high")
    var q11_span = parent.getElementsByClassName("ans_span11_high")
    var q12_span = parent.getElementsByClassName("ans_span12_high")
    var q13_span = parent.getElementsByClassName("ans_span13_high")
    var q14_span = parent.getElementsByClassName("ans_span14_high")
    var q15_span = parent.getElementsByClassName("ans_span15_high")

    if (q1_span != 'null') {
        reset_class(q1_span, "ans_span1")
    }
    if (q2_span != 'null') {
        reset_class(q2_span, "ans_span2")
    }
    if (q3_span != 'null') {
        reset_class(q3_span, "ans_span3")
    }
    if (q4_span != 'null') {
        reset_class(q4_span, "ans_span4")
    }
    if (q5_span != 'null') {
        reset_class(q5_span, "ans_span5")
    }
    if (q6_span != 'null') {
        reset_class(q6_span, "ans_span6")
    }
    if (q7_span != 'null') {
        reset_class(q7_span, "ans_span7")
    }
    if (q8_span != 'null') {
        reset_class(q8_span, "ans_span8")
    }
    if (q9_span != 'null') {
        reset_class(q9_span, "ans_span9")
    }
    if (q10_span != 'null') {
        reset_class(q10_span, "ans_span10")
    }
    if (q11_span != 'null') {
        reset_class(q11_span, "ans_span11")
    }
    if (q12_span != 'null') {
        reset_class(q11_span, "ans_span11")
    }
    if (q13_span != 'null') {
        reset_class(q13_span, "ans_span13")
    }
    if (q14_span != 'null') {
        reset_class(q14_span, "ans_span14")
    }
    if (q15_span != 'null') {
        reset_class(q15_span, "ans_span15")
    }
}

// Util class for changing class name to apply css
function reset_class(q_span, class_name) {
    count = q_span.length - 1
    while (count >= 0) {
        q_span[count].className = class_name
        count = count - 1;
    }
}

// event on hover over on annotated question
function highlight_q1() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
    var q_span = parent.getElementsByClassName("ans_span3");
    reset_class(q_span, "ans_span3_high")
}

// event on hover over on annotated question
function highlight_q2() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
}

// event on hover over on annotated question
function highlight_q3() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
}

// event on hover over on annotated question
function highlight_q4() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
}

// event on hover over on annotated question
function highlight_q5() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
}

// event on hover over on annotated question
function highlight_q6() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
}

// event on hover over on annotated question
function highlight_q7() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
}

function highlight_q8() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
}

// event on hover over on annotated question
function highlight_q9() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
}

// event on hover over on annotated question
function highlight_q10() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span11");
    reset_class(q_span, "ans_span11_high")
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
}

// event on hover over on annotated question
function highlight_q1_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
}

// event on hover over on annotated question
function highlight_q2_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
    var q_span = parent.getElementsByClassName("ans_span3");
    reset_class(q_span, "ans_span3_high")
}

// event on hover over on annotated question
function highlight_q3_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
}

// event on hover over on annotated question
function highlight_q4_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
    var q_span = parent.getElementsByClassName("ans_span3");
    reset_class(q_span, "ans_span3_high")
}

// event on hover over on annotated question
function highlight_q5_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span7");
    reset_class(q_span, "ans_span7_high")
    var q_span = parent.getElementsByClassName("ans_span8");
    reset_class(q_span, "ans_span8_high")
}

// event on hover over on annotated question
function highlight_q6_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
    var q_span = parent.getElementsByClassName("ans_span9");
    reset_class(q_span, "ans_span9_high")
    var q_span = parent.getElementsByClassName("ans_span10");
    reset_class(q_span, "ans_span10_high")
    var q_span = parent.getElementsByClassName("ans_span11");
    reset_class(q_span, "ans_span11_high")
}

// event on hover over on annotated question
function highlight_q7_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span14");
    reset_class(q_span, "ans_span14_high")
    var q_span = parent.getElementsByClassName("ans_span15");
    reset_class(q_span, "ans_span15_high")
}

// event on hover over on annotated question
function highlight_q8_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
    var q_span = parent.getElementsByClassName("ans_span13");
    reset_class(q_span, "ans_span13_high")
    var q_span = parent.getElementsByClassName("ans_span7");
    reset_class(q_span, "ans_span7_high")
    var q_span = parent.getElementsByClassName("ans_span8");
    reset_class(q_span, "ans_span8_high")
    var q_span = parent.getElementsByClassName("ans_span15");
    reset_class(q_span, "ans_span15_high")
    var q_span = parent.getElementsByClassName("ans_span14");
    reset_class(q_span, "ans_span14_high")
}

//Get elements matching id regex
function get_elements_by_id_starts_with(container, selector_tag, prefix) {
    var items = [];
    var candidate_el = document.getElementById(container).getElementsByTagName(selector_tag);
    for (var i = 0; i < candidate_el.length; i++) {
        //omitting undefined null check for brevity
        if (candidate_el[i].id.lastIndexOf(prefix, 0) === 0) {
            items.push(candidate_el[i]);
        }
    }
    return items;
}

// Get all the current spans
function get_spans(visible, typename, table_name) {
    var span_elements = get_elements_by_id_starts_with(table_name, "input", typename+"-")
    var cand_spans = []
    for (var j = 0; j < span_elements.length; j++) {
        if (visible) {
            if (span_elements[j].parentNode.parentNode.style.display != "none") {
                cand_spans.push(span_elements[j])
            }
        } else {
            cand_spans.push(span_elements[j])
        }
    }
    return cand_spans
}

// Check if answer span overlaps with text in passage
function span_match_check() {
    var correct_flag = true
    var length_flag = true

    if (document.getElementById("span").checked) {
        var span_ind = document.getElementById("span_row").rowIndex
        var ans_table = document.getElementById("ans_table");

        var visible_spans = get_spans(true, "span", "ans_table")
        var count = 0
        while (count < visible_spans.length) {
            var span_id = "span-" + count
            if (document.getElementById(span_id)) {
                var span_value = document.getElementById(span_id).value
                var cur_span_row = document.getElementById(span_id).parentNode.parentNode
                span_value = span_value.replace(".", "\\.")
                var pattern = new RegExp(span_value);
                var passage_str = document.getElementById("input-question").value
                passage_str = passage_str + document.getElementById("passage-" + record_count).innerText
                if (pattern.test(passage_str) && span_value.trim().split(" ").length <= 5 && span_value != "") {
                    if (cur_span_row.cells.length == 2) {
                        var marker = cur_span_row.insertCell(1)
                        marker.innerHTML = '<p style="color: green;">&#10004;</p>'
                    } else {
                        var marker = cur_span_row.cells[1]
                        marker.innerHTML = '<p style="color: green;">&#10004;</p>'
                    }
                } else if (!pattern.test(passage_str)) {
                    if (cur_span_row.cells.length == 2) {
                        var marker = cur_span_row.insertCell(1)
                        marker.innerHTML = '<p style="color: red;">&#10008;</p>'
                    } else {
                        var marker = cur_span_row.cells[1]
                        marker.innerHTML = '<p style="color: red;">&#10008;</p>'
                    }
                    correct_flag = correct_flag && false
                } else if (span_value.trim().split(" ").length > 5) {
                    if (cur_span_row.cells.length == 2) {
                        var marker = cur_span_row.insertCell(1)
                        marker.innerHTML = '<p style="color: red;">&#10008;</p>'
                    } else {
                        var marker = cur_span_row.cells[1]
                        marker.innerHTML = '<p style="color: red;">&#10008;</p>'
                    }
                    length_flag = length_flag && false
                }
            }
            count = count + 1
        }
    }
    return {
        "correct_flag": correct_flag,
        "length_flag": length_flag
    }
}

// Collapse and Expand instructions
function collapse() {
    var annotated_el = document.getElementsByClassName("annotated")[0]
    if (annotated_el.style.display == "none") {
        annotated_el.style.display = ""
        document.getElementById("collapse_link").innerText = "(Click to collapse)"
    } else {
        annotated_el.style.display = "none"
        document.getElementById("collapse_link").innerText = "(Click to expand)"
    }
    return false;
}

// Delete an added span
function delete_span(el) {
    var curr_row = el.parentNode.parentNode
    var curr_span_id = el.parentNode.parentNode.firstChild.firstChild.id
    var start_span_id = parseInt(curr_span_id.replace("span-", ""))
    var visible_spans = get_spans(true, "span","ans_table")
      
    var last_span_id = visible_spans.length
    for (var i = start_span_id + 1; i < last_span_id; i++) {
        var curr_span = document.getElementById("span-" + i)
        curr_span.id = "span-" + (i - 1)
        curr_span.name = "span-" + (i - 1)
    }

    var clone = curr_row.cloneNode(true);

    var curr_value = clone.cells[0].firstChild
    curr_value.onkeyup = span_match_check
    curr_value.id = "span-" + (i - 1)
    curr_value.name = "span-" + (i - 1)
    curr_value.value = ""

    if (clone.cells.length == 3) {
        clone.deleteCell(1)
    }

    clone.style.display = "none"
    curr_row.remove()
    document.getElementById("ans_table").getElementsByTagName('tbody')[0].appendChild(clone)
    document.getElementById("span-0").dispatchEvent(new KeyboardEvent('keyup', { 'key': ' ' }))
    return false;
}

//initiate span highlighting
function select_highlights() {
    var highlight_state = document.getElementById("select_highlights").innerText.trim()
    if (highlight_state == "Click here to Start Highlighting") {
        document.getElementById("passage-" + record_count).onmouseup = attach_span_selection;
        document.getElementById("select_highlights").innerText = "Waiting to Finish Highlighting..."
    } else if (highlight_state == "Waiting to Finish Highlighting...") {
        document.getElementById("passage-" + record_count).onmouseup = null;
        document.getElementById("select_highlights").innerText = "Click here to Start Highlighting"
        validate_submission();
    }
    return false;
}

// make the question editable with pencil
function edit_pencil() {
    document.getElementById("input-question-copy").style.backgroundColor = "white"
    document.getElementById("input-question-copy").readOnly = false
    return false;
}

// Add a new answer span
function add_span(el) {
    deselect_digit()
    deselect_date()

    var ans_table = document.getElementById("ans_table");
    var span_index = el.parentNode.parentNode.rowIndex
    var span_row_start_index = document.getElementById("span_row").rowIndex
    var span_elements = get_elements_by_id_starts_with("ans_table", "input", "span-")
    var visible_spans = get_spans(true, "span", "ans_table")

    var span_count = visible_spans.length

    if (!document.getElementById("span-" + span_count)) {
        var span_count = span_index - span_row_start_index
        var new_row = ans_table.insertRow(span_index + 1)
        var new_cell = new_row.insertCell(0)
        new_cell.innerHTML = '<input type="text" onkeyup="validate_submission()" placeholder="copy text from question or passage here" id="span-' + span_count + '" name="span-' + span_count + '">';
        var new_ref = new_row.insertCell(1)
        new_ref.innerHTML = '<a href="add_span" onclick="return add_span(this);">&#10010;</a>'

        document.getElementById("span-" + span_count).onkeyup = span_match_check
        if (span_count >= 1) {
            var prev_row = ans_table.rows[new_row.rowIndex - 1]
            var row_sub_link = prev_row.cells[prev_row.cells.length - 1]
            row_sub_link.innerHTML = '<a href="delete_span" onclick="return delete_span(this);">&#9473;</a>'
        }
    } else {
        document.getElementById("span-" + span_count).parentNode.parentNode.style.display = ""
        document.getElementById("span-" + span_count).parentNode.nextSibling.innerHTML = '<a href="add_span" onclick="return add_span(this);">&#10010;</a>'
        if (span_count >= 1) {
            el.outerHTML = ' <a href="delete_span" onclick="return delete_span(this);">&#9473;</a>'
        }
    }

    return false;
}

// validate the annotation entries to trigger the next question or next passage button
function validate_submission() {
    var flag_submit = true
    var flag_next = true
    flag_submit = flag_submit && (current_question_count >= total_question_count)
    if (document.getElementById("digit").checked) {
        flag_submit = flag_submit && (document.getElementById("value").value != "")
        flag_next = flag_next && (document.getElementById("value").value != "")

    } else if (document.getElementById("span").checked) {
        flag_submit = flag_submit && (document.getElementById("span-0").value != "") 
        flag_next = flag_next && (document.getElementById("span-0").value != "") 

    } else if (document.getElementById("date").checked) {
        var flag_date = false
        flag_date = flag_date || (document.getElementById("year").value != "") 
        flag_date = flag_date || (document.getElementById("day").value != "") 
        flag_date = flag_date || (document.getElementById("month").value != "") 

        flag_next = flag_next && flag_date
        flag_submit = flag_submit && flag_date
        
    }

    var category_elements = document.getElementsByClassName('category');
    var flag_category = false
    for (var i = 0; category_elements[i]; i++) {
        if (category_elements[i].checked) {
            flag_category = flag_category || true
        }
    }

    flag_submit = flag_submit && flag_category
    flag_next = flag_next && flag_category

    var visible_spans = get_spans(true, "highlightspan", "span_table")
    if (visible_spans.length == 0) {
        flag_submit = flag_submit && false
        flag_next = flag_next && false
    } else {
        for (var i = 0; i < visible_spans.length; i++) {
            flag_submit = flag_submit && (visible_spans[i].value != "")
            flag_next = flag_next && (visible_spans[i].value != "")
        }
    }

    if (flag_submit) {
        enable_button("ready_submit")
        document.getElementById("ready_submit").onclick = final_submit;
    } else if (flag_next) {
        if (question_cnt < answers[record_count - 1].length) {
            enable_button("next")
            disable_button("next_passage")
        } else {
            enable_button("next_passage")
            disable_button("next")
        }
    } else {
        disable_button("ready_submit")
        disable_button("next")
        disable_button("next_passage")
    }
}

// Add a highlighting span element in the passage
function add_highlight_span(offset_id) {
    var ans_table = document.getElementById("span_table");
    var span_row_start_index = 1
    var span_elements = get_elements_by_id_starts_with("span_table", "input", "highlightspan-")
    var visible_spans = get_spans(true, "highlightspan", "span_table")

    var span_count = visible_spans.length

    if (!document.getElementById("highlightspan-" + span_count)) {
        var span_index = span_count
        var new_row = ans_table.insertRow(span_index)
        var new_cell = new_row.insertCell(0)
        new_cell.innerHTML = '<input type="text" readonly style="background-color:darkgrey" id="highlightspan-' + span_count + '" class="'+ offset_id + '" name="highlightspan-' + span_count + '">';
        var new_ref = new_row.insertCell(1)
        new_ref.innerHTML = '<a href="deselect_highlight" onclick="return deselect_highlight(this);">&#10008;</a>'
    }

}


// Delete an added span
function deselect_highlight(el) {
    var curr_row = el.parentNode.parentNode
    var start_span_id = curr_row.rowIndex
    var visible_spans = get_spans(true, "highlightspan", "span_table")
    
    //var last_span_id = parseInt(visible_spans[visible_spans.length - 1].id.replace("highlightspan-", ""))    
    var last_span_id = visible_spans.length
    for (var i = start_span_id + 1; i < last_span_id; i++) {
        var curr_span = document.getElementById("highlightspan-" + i)
        curr_span.id = "highlightspan-" + (i - 1)
        curr_span.name = "highlightspan-" + (i - 1)

        var curr_span_highlight = document.getElementById("highlightedspan-" + i)
        curr_span_highlight.id = "highlightedspan-" + (i - 1)
        curr_span_highlight.name = "highlightedspan-" + (i - 1)
    }

    var clone = curr_row.cloneNode(true);

    var curr_value = clone.cells[0].firstChild
    curr_value.id = "highlightspan-" + (i - 1)
    curr_value.name = "highlightspan-" + (i - 1)
    curr_value.value = ""
        
    clone.style.display = "none"
    curr_row.remove()

    var highlighted_text = document.getElementById("passage-" + record_count).innerHTML
    var span_regex = new RegExp("<span id=\"highlightedspan-" + start_span_id + "\".*?>.*?</span>", "i");
    var span_innertext = document.getElementById("highlightedspan-" + start_span_id).innerText
    highlighted_text = highlighted_text.replace(span_regex, span_innertext);
    
    document.getElementById("passage-" + record_count).innerHTML = highlighted_text
    return false;
}


// switch between next and previous passages
function populate_passage(config) {
    if ((record_count>0) && (question_cnt >= answers[record_count-1].length)) {
        question_cnt = 0
        disable_button("next")
    }

    if (question_cnt > 0) {
        add_question()
    }

    document.getElementById("ready_submit").onclick = null
    if (record_count <= passages.length) {
        //remove old passage
        var parent = document.getElementsByClassName("passage")[0];
        var passage_el = document.getElementById("passage-" + record_count);
        passage_el.remove();

        if (config == "next") {
            record_count = record_count + 1;
        } else {
            record_count = record_count - 1;
        }
        //add new passage
        var new_passage = document.createElement("div");        
        new_passage.innerText = passages[record_count - 1];
        new_passage.id = "passage-" + record_count;
        new_passage.style.fontSize = '15px'
        parent.appendChild(new_passage)

        // update question fields
        document.getElementById("input-question").value = answers[record_count - 1][0].question
        document.getElementById("input-question").onmouseup = attach_span_selection
        document.getElementById("input-question-copy").value = answers[record_count - 1][0].question
        question_cnt += 1
        current_question_count += 1
        reset_frame()

        // update the display counters
        document.getElementById("passage_counter").innerText = "Passages: " + record_count + "/" + total_num_passages  + "  Question:" + question_cnt + "/" + answers[record_count - 1].length
    }
}

// create answer object for final submission
function get_answer() {
    var answer = {
        "date": {
            "year": "",
            "month": "",
            "day": "",
        },
        "digit": {
            "value": "",
            "unit": ""
        },
        "spans": [],
        "checked": "",
        "ai_answer": ""
    }

    if (document.getElementById("date").checked) {
        var year = document.getElementById("year").value.trim()
        var month = document.getElementById("month").value.trim()
        var day = document.getElementById("day").value.trim()
        answer.date.year = year
        answer.date.month = month
        answer.date.day = day
        answer.checked = "date"

    } else if (document.getElementById("digit").checked) {
        var dig = document.getElementById("value").value.trim()
        var input_number = dig.trim()
       
        answer.digit.value = dig

        answer.checked = "digit"

    } else if (document.getElementById("span").checked) {

        var span_elements = get_spans(true, "span", "ans_table")
        for (var i = 0; i < span_elements.length; i++) {
            if (span_elements[i].value.trim() != "") {
                answer.spans.push(span_elements[i].value.trim())
            }
        }

        answer.checked = "span"
    }
    return answer
}

// create annotation object for final submission
function add_question() {
    var annotation = {
        question: "", question_corrected: "", answer: {}, passage_id: -1, category: [],
        highlights: { "start_index": [], "end_index": [] }
    }
    annotation.question = document.getElementById("input-question").value
    annotation.question_corrected = document.getElementById("input-question-copy").value
    annotation.answer = get_answer()
    annotation.passage_id = passage_ids[record_count - 1]
    var category_elements = document.getElementsByClassName('category');
    for (var i = 0; category_elements[i]; i++) {
        if (category_elements[i].checked) {
            annotation.category.push(category_elements[i].value);
        }
    }
    var visible_spans = get_spans(true, "highlightspan", "span_table")
    for (var i = 0; i < visible_spans.length; i++) {
        var text_range = visible_spans[i].className.split("-")
        annotation.highlights.start_index.push(text_range[0])
        annotation.highlights.end_index.push(text_range[1])
    }
    annotations[(record_count - 1) + "-" + question_cnt] = annotation
}

// callback for next question click
function next_question(el) {
    if (question_cnt >= answers[record_count - 1].length) {
        question_cnt = 0
        disable_button("next")
    }

    // add question to annotations
    if (question_cnt > 0) { 
        add_question()
    }

    // reset question field
    document.getElementById("input-question").value = answers[record_count - 1][question_cnt].question
    document.getElementById("input-question-copy").value = answers[record_count - 1][question_cnt].question
    question_cnt = question_cnt + 1
    current_question_count = current_question_count + 1

    // update display counters
    document.getElementById("passage_counter").innerText = "Passages: " + record_count + "/" + total_num_passages + "  Question:"  + question_cnt + "/" + answers[record_count - 1].length
    
    reset_highlighted_span()
    reset_frame()
}

// reset the passage text when a highlight is deleted
function reset_highlighted_span() {
    var visible_spans = get_spans(true, "highlightspan", "span_table")
    console.log(visible_spans)
    for (var i = 0; i < visible_spans.length; i++) {
        var id = visible_spans[i].id.replace("highlight", "highlighted")
        var highlighted_text = document.getElementById("passage-" + record_count).innerHTML
        var span_regex = new RegExp("<span id=\"" + id + "\".*?>.*?</span>", "i");
        var span_innertext = document.getElementById(id).innerText
        highlighted_text = highlighted_text.replace(span_regex, span_innertext);
        document.getElementById("passage-" + record_count).innerHTML = highlighted_text
    }
}


// reset when next passage or next question are clicked
function reset_frame() {
    
    deselect_date()
    deselect_span()
    deselect_digit()

    // reset highlighted spans
    var visible_spans = get_spans(true, "highlightspan", "span_table")
    for (var i = 0; i < visible_spans.length; i++) {
        visible_spans[i].parentNode.parentNode.remove()
    }

    // reset category checkbox
    var category_elements = document.getElementsByClassName('category');
    for (var i = 0; category_elements[i]; i++) {
        category_elements[i].checked = false
    }

    disable_button("next")
    disable_button("next_passage")
  
}

//disable a button
function disable_button(button_id) {
    document.getElementById(button_id).style.background = "darkgray";
    document.getElementById(button_id).disabled = true
}

// enable a button
function enable_button(button_id) {
    document.getElementById(button_id).style.background = "#2085bc";
    document.getElementById(button_id).disabled = false
}

// add element for digit type answer
function create_input_digit() {
    if (document.getElementById("digit").checked) {
        var caption_row = document.getElementById("digit_row_1")
        var data_row = document.getElementById("digit_row_2")
        caption_row.style.display = ''
        data_row.style.display = ''
    }
    deselect_date()
    deselect_span()
}

// deselecet date type answer
function deselect_date() {
    var caption_row = document.getElementById("date_row_1")
    var data_row = document.getElementById("date_row_2")
    document.getElementById("year").value = ""
    document.getElementById("month").value = ""
    document.getElementById("day").value = ""
    caption_row.style.display = 'none'
    data_row.style.display = 'none'
    document.getElementById("date").checked = false
}

// deselect digit type answer
function deselect_digit() {
    var caption_row = document.getElementById("digit_row_1")
    var data_row = document.getElementById("digit_row_2")
    document.getElementById("value").value = ""
    caption_row.style.display = 'none'
    data_row.style.display = 'none'
    document.getElementById("digit").checked = false
    
}

// deselect span type answer
function deselect_span() {
    var span_ind = document.getElementById("span_row").rowIndex
    var ans_table = document.getElementById("ans_table");
    var span_elements = get_elements_by_id_starts_with("ans_table", "input", "span-")

    if (span_elements.length > 0) {
        for (var i = 0; i < span_elements.length; i++) {
            
            span_elements[i].value = ""
            span_elements[i].parentNode.parentNode.style.display = "none"
        }
        document.getElementById("span").checked = false
    }
  
}

// add element for date type answer
function create_input_date() {
    var caption_row = document.getElementById("date_row_1")
    var data_row = document.getElementById("date_row_2")
    if (document.getElementById("date").checked) {
        caption_row.style.display = ''
        data_row.style.display = ''
    }
    deselect_digit()
    deselect_span()
}
