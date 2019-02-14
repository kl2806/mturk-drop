var record_count = 0
var question_cnt = 0
var current_question_count = 0
passages = []
answers = []
passage_ids = []
var annotations = []
var total_num_passages = -1
var total_num_questions = 10
var question_start_index = 800

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
        question_el.value = annotation.question_corrected
        question_el.id = "input-question-corrected-" + key
        question_el.name = "input-question-corrected-" + key
        question_el.type = "text"
        question_el.style.display = 'none'
        root.appendChild(question_el)

        var query_id = document.createElement("input")
        query_id.value = annotation.query_id
        query_id.id = "input-query-id-" + key
        query_id.name = "input-query-id-" + key
        query_id.type = "text"
        query_id.style.display = 'none'
        root.appendChild(query_id)

        for (var incorrect_answer_iter = 0; incorrect_answer_iter < annotation.incorrect_options.length; incorrect_answer_iter++) {
            var el = document.createElement("input")
            el.value = annotation.incorrect_options[incorrect_answer_iter]
            el.id = "incorrect-option-" + key + "-" + incorrect_answer_iter
            el.name = "incorrect-option-" + key + "-" + incorrect_answer_iter
            el.style.display = 'none'
            root.appendChild(el)
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

//  populate the global variables with the fetched annotations
function parse_annotations_question_count(response) {
    if (response.status !== 200) {
        error_passages()
        return;
    }

    response.json().then(function (annotations) {
        var all_passage_ids = Object.keys(annotations);
        var current_question_count = 0
        var start_index = question_start_index
        var i = 0
        while (annotations[all_passage_ids[i]]["qa_pairs"].length - start_index < 0) {
            start_index -= annotations[all_passage_ids[i]]["qa_pairs"].length
            i += 1;
        }
        if (start_index != 0) {
            start_index = start_index - 1
        }
        while (i < all_passage_ids.length) {
            if (current_question_count != total_num_questions) {
                passages.push(annotations[all_passage_ids[i]]["passage"])
                passage_ids.push(all_passage_ids[i])
                var num_answers = Math.min(annotations[all_passage_ids[i]]["qa_pairs"].length - start_index, total_num_questions - current_question_count)
                answers.push(annotations[all_passage_ids[i]]["qa_pairs"].slice(start_index, num_answers + start_index))
                current_question_count += answers[answers.length - 1].length
                start_index = 0
                console.log("added id " + all_passage_ids[i])
            } else {
                break
            }
            i += 1;  
        }

        total_num_passages = passages.length
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
    //var data_url = "https://s3.us-east-2.amazonaws.com/sparc-dataset/drop_dataset_valid.json"
    var data_url = "https://s3.us-east-2.amazonaws.com/sparc-dataset/dev_left_3.json"
    fetch(data_url)
        .then(parse_annotations_question_count)
        .catch(function (error) {
            if (n === 1) return reject(error_passages);
            fetch_passages_with_retries(n - 1)
                .then(parse_annotations_question_count)
                .catch(error_passages);
        })

}

// remove annotation highlights on mouse out
function reset_higlight_sample1() {
    var parent = document.getElementsByClassName("passage-sample-1")[0]
    var q1_span = parent.getElementsByClassName("ans_span1_high")
    var q2_span = parent.getElementsByClassName("ans_span2_high")
    var q3_span = parent.getElementsByClassName("ans_span3_high")
    var q4_span = parent.getElementsByClassName("ans_span4_high")
    var q5_span = parent.getElementsByClassName("ans_span5_high")
    var q6_span = parent.getElementsByClassName("ans_span6_high")
    var q7_span = parent.getElementsByClassName("ans_span7_high")
    var q8_span = parent.getElementsByClassName("ans_span8_high")
    

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
}

function reset_higlight_sample2() {
    var parent = document.getElementsByClassName("passage-sample-2")[0]
    var q1_span = parent.getElementsByClassName("ans_span1_nfl_high")
    var q2_span = parent.getElementsByClassName("ans_span2_nfl_high")
    var q3_span = parent.getElementsByClassName("ans_span3_nfl_high")
    var q4_span = parent.getElementsByClassName("ans_span4_nfl_high")
    var q5_span = parent.getElementsByClassName("ans_span5_nfl_high")
    var q6_span = parent.getElementsByClassName("ans_span6_nfl_high")
    var q7_span = parent.getElementsByClassName("ans_span7_nfl_high")
    var q8_span = parent.getElementsByClassName("ans_span8_nfl_high")
    var q9_span = parent.getElementsByClassName("ans_span9_nfl_high")
    var q10_span = parent.getElementsByClassName("ans_span10_nfl_high")
    var q11_span = parent.getElementsByClassName("ans_span11_nfl_high")
    var q12_span = parent.getElementsByClassName("ans_span12_nfl_high")
    var q13_span = parent.getElementsByClassName("ans_span13_nfl_high")

    if (q1_span != 'null') {
        reset_class(q1_span, "ans_span1_nfl")
    }
    if (q2_span != 'null') {
        reset_class(q2_span, "ans_span2_nfl")
    }
    if (q3_span != 'null') {
        reset_class(q3_span, "ans_span3_nfl")
    }
    if (q4_span != 'null') {
        reset_class(q4_span, "ans_span4_nfl")
    }
    if (q5_span != 'null') {
        reset_class(q5_span, "ans_span5_nfl")
    }
    if (q6_span != 'null') {
        reset_class(q6_span, "ans_span6_nfl")
    }
    if (q7_span != 'null') {
        reset_class(q7_span, "ans_span7_nfl")
    }
    if (q8_span != 'null') {
        reset_class(q8_span, "ans_span8_nfl")
    }
    if (q9_span != 'null') {
        reset_class(q9_span, "ans_span9_nfl")
    }
    if (q10_span != 'null') {
        reset_class(q10_span, "ans_span10_nfl")
    }
    if (q11_span != 'null') {
        reset_class(q11_span, "ans_span11_nfl")
    }
    if (q12_span != 'null') {
        reset_class(q12_span, "ans_span12_nfl")
    }
    if (q13_span != 'null') {
        reset_class(q13_span, "ans_span13_nfl")
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
    var parent = document.getElementsByClassName("passage-sample-1")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
}

// event on hover over on annotated question
function highlight_q2() {
    var parent = document.getElementsByClassName("passage-sample-1")[0];
    var q_span = parent.getElementsByClassName("ans_span3");
    reset_class(q_span, "ans_span3_high")
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
}

// event on hover over on annotated question
function highlight_q3() {
    var parent = document.getElementsByClassName("passage-sample-1")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
    
}

// event on hover over on annotated question
function highlight_q4() {
    var parent = document.getElementsByClassName("passage-sample-1")[0];
    var q_span = parent.getElementsByClassName("ans_span7");
    reset_class(q_span, "ans_span7_high")
}

// event on hover over on annotated question
function highlight_q5() {
    var parent = document.getElementsByClassName("passage-sample-1")[0];
    var q_span = parent.getElementsByClassName("ans_span8");
    reset_class(q_span, "ans_span8_high")
    var q_span = parent.getElementsByClassName("ans_span9");
    reset_class(q_span, "ans_span9_high")
}

// event on hover over on annotated question
function highlight_q6() {
    var parent = document.getElementsByClassName("passage-sample-1")[0];
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
}



// event on hover over on annotated question
function highlight_q1_nfl() {
    var parent = document.getElementsByClassName("passage-sample-2")[0];
    var q_span = parent.getElementsByClassName("ans_span1_nfl");
    reset_class(q_span, "ans_span1_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span2_nfl");
    reset_class(q_span, "ans_span2_nfl_high")
}

// event on hover over on annotated question
function highlight_q2_nfl() {
    var parent = document.getElementsByClassName("passage-sample-2")[0];
    var q_span = parent.getElementsByClassName("ans_span3_nfl");
    reset_class(q_span, "ans_span3_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span4_nfl");
    reset_class(q_span, "ans_span4_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span5_nfl");
    reset_class(q_span, "ans_span5_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span6_nfl");
    reset_class(q_span, "ans_span6_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span7_nfl");
    reset_class(q_span, "ans_span7_nfl_high")
}

// event on hover over on annotated question
function highlight_q3_nfl() {
    var parent = document.getElementsByClassName("passage-sample-2")[0];
    var q_span = parent.getElementsByClassName("ans_span8_nfl");
    reset_class(q_span, "ans_span8_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span9_nfl");
    reset_class(q_span, "ans_span9_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span10_nfl");
    reset_class(q_span, "ans_span10_nfl_high")
}

// event on hover over on annotated question
function highlight_q4_nfl() {
    var parent = document.getElementsByClassName("passage-sample-2")[0];
    var q_span = parent.getElementsByClassName("ans_span12_nfl");
    reset_class(q_span, "ans_span12_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span11_nfl");
    reset_class(q_span, "ans_span11_nfl_high")
}

function highlight_q5_nfl() {
    var parent = document.getElementsByClassName("passage-sample-2")[0];
    var q_span = parent.getElementsByClassName("ans_span1_nfl");
    reset_class(q_span, "ans_span1_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span2_nfl");
    reset_class(q_span, "ans_span2_nfl_high")
    var q_span = parent.getElementsByClassName("ans_span13_nfl");
    reset_class(q_span, "ans_span13_nfl_high")}

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

    validate_submission()
    return {
        "correct_flag": correct_flag,
        "length_flag": length_flag
    }
}

// Collapse and Expand instructions
function collapse() {
    var annotated_el = document.getElementById("instructions")
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
        new_cell.innerHTML = '<input type="text" placeholder="copy text from question or passage here" id="span-' + span_count + '" name="span-' + span_count + '">';
        
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
    flag_submit = flag_submit && (current_question_count >= total_num_questions)
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

    } else if (document.getElementById("impossible_answer_check").checked) {
        var incorrect_elements = document.getElementsByClassName('incorrect_answer_option');
        var flag_options = false
        for (var i = 0; incorrect_elements[i]; i++) {
            if (incorrect_elements[i].checked) {
                flag_options = flag_options || true
            }
        }
        flag_submit = flag_submit && flag_options
        flag_next = flag_next && flag_options
    } else {
        flag_submit = false
        flag_next = false
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

// switch between next and previous passages
function populate_passage(config) {
    if ((record_count>0) && (question_cnt >= answers[record_count-1].length)) {
        add_question()
        question_cnt = 0
        disable_button("next")
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
        question: "", question_corrected: "", answer: {}, passage_id: -1, incorrect_options: [],
        highlights: {"start_index": [], "end_index": [], "raw_text" :[]}
    }
    annotation.question = document.getElementById("input-question").value
    annotation.question_corrected = document.getElementById("input-question-copy").value
    annotation.query_id = answers[record_count-1][question_cnt-1].query_id
    annotation.answer = get_answer()
    annotation.passage_id = passage_ids[record_count - 1]
    var incorrect_options = document.getElementsByClassName('incorrect_answer_option');
    for (var i = 0; incorrect_options[i]; i++) {
        if (incorrect_options[i].checked) {
            annotation.incorrect_options.push(incorrect_options[i].value);
        }
    }
   
    annotations[(record_count - 1) + "-" + (question_cnt-1)] = annotation
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
    
    //reset_highlighted_span()
    reset_frame()
}

function show_incorrect_options() {
    if (document.getElementById("impossible_answer_check").checked) {
        document.getElementById("incorrect_option").style.display = ""
        var answer_el = document.getElementsByClassName("answer_radio")
        for (var iter = 0; iter < answer_el.length; iter++) {
            if (answer_el[iter].checked) {
                answer_el[iter].checked = false
                if (answer_el[iter].id == "date") {
                    deselect_date()
                } else if (answer_el[iter].id == "digit") {
                    deselect_digit()
                } else if (answer_el[iter].id == "span") {
                    deselect_span()
                }
            }
        }
    } else {
        document.getElementById("incorrect_option").style.display = "none"
    }
}

// reset when next passage or next question are clicked
function reset_frame() {
    
    deselect_date()
    deselect_span()
    deselect_digit()

    // reset category checkbox
    document.getElementById("impossible_answer_check").checked = false
    var incorrect_options = document.getElementsByClassName("incorrect_answer_option")
    for (var iter = 0; iter < incorrect_options.length; iter++) {
        incorrect_options[iter].checked = false
    }
    document.getElementById("incorrect_option").style.display = "none"

    //reset question
    document.getElementById("input-question-copy").readOnly = true
    document.getElementById("input-question-copy").style.backgroundColor = "lightgray"

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
            if (span_elements[i].parentNode.parentNode.cells.length == 3) {
                span_elements[i].parentNode.parentNode.deleteCell(1)
            }
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
