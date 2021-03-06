﻿var record_count = 0;
var total_question_cnt = 0;
var question_num = 0
var passages = []
var domain = "history"
fetch_passages_with_retries(3)
var current_question_id = ""
var edit_mode = false
var annotations = {}
var min_questions = 2
var num_passages = 5
var global_timeout = null
var passage_ids = []


document.onkeydown = function (event) {
    // on enter press override to create question
    if (event.target.tagName != 'TEXTAREA' && event.keyCode == 13) {
            create_question()
            return false;
        
    }
}

function get_contents_history() {
    var survey_data = `In the secret pact, the Treaty of Granada of 11 November 1500, Louis XII of France and Ferdinand II of Aragon agreed to divide the Mezzogiorno between themselves after removing Frederick IV of Naples from the Neapolitan throne. Their plans were realized on 25 June 1501 when Pope Alexander VI invested each of them. On 25 July 1501, Frederick IV of Naples, hoping to avoid another military conflict between the two national monarchies on Italian soil, abdicated as ruler of Naples and Campania in favour of the French King. Francesco Guicciardini points out in the Discorso di Logrogno  that the partition of the Mezzogiorno between the houses of Aragon and Orléans neglected to take into account the economic system of a region dominated by sheep-rearing and its concomitant transhumance. The Treaty of Lyon was signed on 31 January 1504 between Louis XII of France and Ferdinand II of Aragon. Based on the terms of the treaty, France ceded Naples to Spain. Moreover, France and Spain defined their respective control of Italian territories. France controlled northern Italy from Milan and Spain controlled Sicily and southern Italy. The Treaty of Blois of 22 September 1504 concerned the proposed marriage between Charles of the House of Habsburg, the future Charles V, and Claude of France, daughter of Louis XII and Anne of Brittany. If the King Louis XII were to die without producing a male heir, Charles of the House of Habsburg would receive as dowry the Duchy of Milan, Genoa and its dependencies, the Duchy of Brittany, the counties of Asti and Blois, the Duchy of Burgundy, the Viceroyalty of Auxonne, Auxerrois, Mâconnais and Bar-sur-Seine.
    On December 1 the 3rd Army Group guerrillas cut the Lung-hai Railway near Luowang, Neihuanggi, and east and west of Lankao. They also cut the highways at Tung-hsu , Huaiyang and Luyi. Meanwhile, the 81st Division's main force attacked Kaifeng while some of its elements attacked Lanfeng. Lowang Railway station was taken on December 15 and the Division entered Kaifeng the next day, clearing the Japanese troops and burning warehouses and a Japanese headquarters there. Meanwhile, to the southeast 2nd Cavalry Corps moved east of Boxian, encircled and attacked Shangqiu from the east and overran an airfield and burned aviation fuel there. Another force intercepted and defeated relief forces moving west from Dangshan on the Lung-hai Railway. North of the Yellow River the 36th Army Group attacked. Its new 5th Corps on December 6 attacked elements of the Japanese 1st Independent Mixed Brigade north and south of Anyang and succeeded in destroying bridges along the roads at Chi, Chun, Tang-yin and Pao-lien Temple Station. On December 13 the 47th Corps cleared Taihang Mountain and cut the Tao-tsin Railroad, taking the rail stations at Po-shan and Chang-kou. The 9th Corps attacked elements of the Japanese 35th Division between Bo'ai and Jixian, cutting communications between them and attacking the defenders on the outskirts of Jixian and a strongpoint at Mucheng. Parts of the 47th Division and demolition teams broke into Jixian for half the day, attempting to clear it of enemy troops.
    The reino or native kingdom of Manufahi  lay on the southern coast of Timor, within the military district of Alas, based on the rationalised re-districting of 1860. It had an estimated population of 42,000 living in 6,500 houses in 1903. It owed a finta  to the Portuguese treasury of 96,000 Mexican dollars, although this was difficult to collect. It was governed by a king or liurai  who was confirmed in his position by the Portuguese governor. Manufahi's agriculturalists produced horses, sheep, cereals, fruit, coffee and tobacco. Its craftsmen were the finest silver and goldsmiths in Portuguese Timor, manufacturing bracelets and anklets. There were also skilled pyrographers working bamboo pipes. More ominously, Manufahi produced leather cartridge belts and musket shot, materials that could be put to use in a revolt. The countrywide conflict of 1911-12 was the culmination of a series of revolts led by Manufahi. The first, which took place during the reign of Dom Duarte, Boaventura's father, lasted from 1894 to 1901 and the second from 1907 to 1908. The west and north of Manufahi was the reino of Suru, centred on the mountain of Tatamailau. It had only been subdued by the Portuguese and subjugated to the reino of Atsabe in 1900. In 1907, the liurai of Suru, Naicau, petitioned the Portuguese for independence from Atsabe and it was granted. Naicau would prove loyal to the Portuguese and a thorn in Manufahi's side.
    Anaukpetlun would not spend his scarce resources on subjugating Siam. His strategy was to pick off Siam's peripheral regions rather than launch a full-scale invasion. On 30 November 1613, he sent a small army of 4,000  to drive out the Siamese from upper Tenasserim coast. On 26 December 1613, the army defeated the Siamese at Tavoy. The Burmese followed down to Tenasserim port itself. But the Burmese were driven back with heavy losses by the wealthy port's Portuguese broadsides in March 1614. The Siamese tried to retake Tavoy but failed. Anaukpetlun then switched theatres to Lan Na, which like Martaban before was only a nominal vassal of Siam. His armies of 17,000 invaded Lan Na on 30 April 1614 from Martaban in the south and Mone in the north. Lan Na's ruler, Thado Kyaw, desperately sought help. Help came from Lan Xang, not his overlord Siam. Despite the logistical troubles and the rainy season conditions, the Burmese armies finally achieved encirclement of Lan Na and Lan Xang forces in the Chiang Mai and Lanphun pocket in August 1614. After nearly five months, on 22 December 1614, the city surrendered. Siam would not make any attempts to recover Lan Na until 1663.
    The Dano-Swedish War from 1501 to 1512 was a military conflict between Denmark and Sweden within the Kalmar Union. The war began with a Swedish revolt against King John and the siege of Queen Christina in her castle in Danish-held Stockholm. Fighting intensified in 1509 and 1510 when the German city of Lübeck and the Hanseatic League helped Sweden to conquer Danish-held Kalmar and Borgholm. The recently established Danish Navy fought joint Hanseatic-Swedish naval forces at Nakskov and Bornholm in 1510 and 1511. In April 1512, a peace agreement was signed in Malmö.`
    //passage_ids = [domain + "_" + 754, domain + "_" + 47, domain + "_" + 475, domain + "_" + 1004, domain + "_" + 13]
   // passage_ids = [domain + "_" + 655, domain + "_" + 44, domain + "_" + 416, domain + "_" + 873, domain + "_" + 365]
    passage_ids = [domain + "_" + 577, domain + "_" + 41, domain + "_" + 363, domain + "_" + 767, domain + "_" + 318]
    return survey_data.split('\n')
}

function get_contents_nfl() {
    var survey_data = `Due to a conflict involving the Orioles' schedule, the Ravens opened the regular season on the road against the Broncos in what would be the first time a defending Super Bowl champion team has done so since the Buccaneers in 2003 when they opened their regular season against the Eagles.  This would be a rematch of last year's AFC Divisional game. The Ravens drew first blood when Joe Flacco found Vonta Leach on a 2-yard touchdown pass to take the lead 7-0 in the first quarter for the only score of the period.  The Broncos would tie the game in the 2nd quarter with Peyton Manning finding Julius Thomas on a 24-yard pass to take the game to 7-7.  The Ravens moved back into the lead when Ray Rice ran for a 1-yard touchdown to make the score 14-7.  Peyton would find Julius again on a 23-yard pass to make the score 14-14 for another tie before the Ravens kicker Justin Tucker nailed a 25-yard field goal to make the score 17-14 at halftime.  In the 3rd quarter, the Broncos went right back to work as Peyton found Andre Caldwell on a 28-yard touchdown pass to take a 21-17 lead followed up with finding Wes Welker on 2 consecutive passes from 5 yards and 2 yards out for an increase in the lead first to 28-17 and then to 35-17.  Later on in the quarter, Peyton would find Demaryius Thomas on a 26-yard pass to increase the lead to 42-17.  The Ravens tried to rally a comeback in the last quarter, with Flacco finding Marlon Brown on a 13-yard pass to shorten the Broncos' lead 42-24 followed up by Tucker's 30-yard field goal to make the score 42-27.  However, the Broncos wrapped things up in the game when Peyton found D. Thomas again on a 78-yard pass to make the final score 49-27.  The Ravens began their season 0-1 for the first time under John Harbaugh as head coach and Joe Flacco as their starter.  They also lost their first regular season opening game since 2007 as well as becoming the 2nd straight defending Super Bowl champion team to lose their season opener. 
    Coming of their road win over the Rams, the Cardinals went home for an NFC West rematch with the Seattle Seahawks.  In the first quarter, the Cards drew first blood with QB Matt Leinart completing a 56-yard TD pass to WR Bryant Johnson, while RB Edgerrin James (who ran for 115 yards on the day) got a 7-yard TD run.  The Seahawks would respond with QB Matt Hasselbeck's 23-yard TD pass to WR D.J. Hackett.  In the second quarter, the Big Red increased its lead with kicker Neil Rackers getting a 32-yard field goal, yet Seattle responded with Hasselbeck's 5-yard TD pass to WR Nate Burleson.  In the third quarter, Arizona temporarily lost the lead as Hasselbeck completed a 2-yard TD pass to WR Darrell Jackson for the only score of the period.  Fortunately, in the fourth quarter, Arizona reclaimed the lead and won with Leinart's 5-yard TD pass to WR Larry Fitzgerald and Rackers' 40-yard field goal.  With the upset win, the Cardinals improved to 4-9. 
    The Ravens lost their second straight game in a contest with the Carolina Panthers. The Panthers got on the board first with a 21-yard field goal by kicker John Kasay. Ravens quarterback Steve McNair was knocked out in the first quarter with a concussion, and backup Kyle Boller took over, connecting on a touchdown pass with Mark Clayton, on a pass intended for Derrick Mason that was tipped to Clayton. The Panthers responded when Drew Carter caught a 42-yard touchdown pass from Jake Delhomme, and Kasay kicked another field goal, this time from 31 yards. The Panthers went into halftime with a 13-7 lead. The third quarter was scoreless, and midway through the fourth quarter, Panthers kicker Kasay kicked his third field goal of the day from 21 yards out. Ravens wide receiver Clayton caught his second touchdown pass from Boller, again on a tipped pass, bringing the score to 16-14 Carolina. Panthers quarterback Delhomme continued his career day, this time throwing a 72-yard touchdown pass to wide receiver Steve Smith. Delhomme threw for a career-high 365 yards. Ravens tight end Todd Heap caught a 7-yard pass from Boller in the final minutes, but it wasn't enough as the Panthers extended their current winning streak to four games. The loss dropped the Ravens to 4-2, and 1-1 against NFC Opponents. 
    Coming off their road win over the Browns, the Texans went home, donned their "Battle Red" uniforms, and played in their very first Monday Night Football game in franchise history, as they played a Week 13 AFC South rematch with the Jacksonville Jaguars. In the first quarter, Houston drew first blood as QB Sage Rosenfels completed a 31-yard TD pass to WR Andre Johnson, while kicker Kris Brown got a 38-yard field goal.  After a scoreless second quarter, the Texans increased their lead early in the third quarter as Brown got a 50-yard field goal.  The Jaguars would respond with kicker Josh Scobee getting a 29-yard field goal, yet Houston answered with Brown nailing a 20-yard field goal.  In the fourth quarter, Houston began to pull away as rookie RB Steve Slaton got a 7-yard TD run.  Jacksonville would answer with RB Fred Taylor getting a 4-yard TD run, yet the Texans immediately replied as Slaton got a 40-yard TD run.  The Jaguars would close out the game with QB David Garrard completing an 18-yard TD pass to WR Reggie Williams. This was the first time that Houston hosted a football game on Monday night in 14 years.  The last Monday night game that was held in Houston was on November 21, 1994, in the Houston Astrodome when the Houston Oilers were defeated by the New York Giants 13-10. 
    The Steelers stayed home for a SNF duel against longtime division rival Bengals.  The first quarter was all Steelers as they scored touchdowns in 3 different ways:  Le'Veon Bell ran for a 1-yard, Antonio Brown caught a 12-yard pass, and then returned a punt 67 yards putting up scores of 7-0, 14-0, and 21-0.  This remains the most points in their franchise history they have scored in the first quarter while it remains the largest number of points the Bengals have allowed in the first quarter alone.  This streak of points stood at 24 straight as Shaun Suisham kicked a 25-yard field goal.  The Bengals finally got on the board as Gio Benard ran for a 1-yard touchdown making the score 24-7.  Suisham then nailed a 45-yard field goal to move his team ahead 27-7 at halftime.  After this, the Steelers went back to work in the 3rd quarter coming away with another field goal from 26 yards out for a 30-7 lead.  The 4th quarter however, was all Bengals as Andy Dalton and Tyler Eifert connected on a 1-yard touchdown pass making the score 30-14 not long before Dalton found Marvin Jones on a 13-yard pass making the score 30-20, but the 2-point conversion failed as the Steelers would eventually win the game with that score as the final sending them to 6-8.  Coupled with losses of the Ravens, Chargers, and Dolphins, the Steelers also remained in the playoff hunt.`
   // passage_ids = [domain + "_" + 2526, domain + "_" + 11, domain + "_" + 34, domain + "_" + 1077, domain + "_" +2658]
   // passage_ids = [domain + "_" + 2444, domain + "_" + 11, domain + "_" + 34, domain + "_" + 1043, domain + "_" + 2572]
    passage_ids = [domain + "_" + 2451, domain + "_" + 11, domain + "_" + 34, domain + "_" + 1074, domain + "_" + 2575]
    return survey_data.split('\n')
}

function shuffle() {
    for (var i = passages.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = passages[i].trim();
        passages[i] = passages[j].trim();
        passages[j] = temp;
        temp = passage_ids[i];
        passage_ids[i] = passage_ids[j];
        passage_ids[j] = temp;
    }
}

// Check for Bag-of-Words overlap
function bow_overlap(a, b, threshold) {
    var stopwords = new Set(["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]);
    var a_withoutpunct = a.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g, "");
    var a_final = a_withoutpunct.replace(/\s{2,}/g, " ");
    a_final = a_final.trim()
    var b_withoutpunct = b.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g, "");
    var b_final = b_withoutpunct.replace(/\s{2,}/g, " ");
    b_final = b_final.trim()
    set1 = new Set(a_final.split(" "))
    var set1_difference = new Set([...set1].filter(x => !stopwords.has(x)));
    set2 = new Set(b_final.split(" "))
    var set2_difference = new Set([...set2].filter(x => !stopwords.has(x)));
    var intersection = new Set([...set1_difference].filter(x => set2_difference.has(x)));

    var overlap = Array.from(intersection)
    var result = overlap.length / Math.max(set1_difference.size, set2_difference.size)
    return (result == threshold)
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

//Get elements matching class rege
function get_elements_by_class_starts_with(container, selector_tag, prefix) {
    var items = [];
    var candidate_el = document.getElementsByClassName(container)[0].getElementsByTagName(selector_tag);
    for (var i = 0; i < candidate_el.length; i++) {
        if (candidate_el[i] && candidate_el[i].id.lastIndexOf(prefix, 0) === 0) {
            items.push(candidate_el[i]);
        }
    }
    return items;
}

// Attach AI-answer fetch to the quest text keyup event
function initialize_answer() {
    document.getElementById('ai-answer').value = 'AI is thinking ...';
   
    if (global_timeout != null) {
        clearTimeout(global_timeout);
    }

    global_timeout = setTimeout(function () {
        global_timeout = null
        how_many_check();
        invoke_bidaf_with_retries(3);
    }, 800);

    run_validations_date_digit();
}

function deselect_date() {
    var caption_row = document.getElementById("date_row_1")
    var data_row = document.getElementById("date_row_2")
    document.getElementById("year").value = ""
    document.getElementById("month").value = ""
    document.getElementById("day").value = ""
    caption_row.style.display = 'none'
    data_row.style.display = 'none'
    document.getElementById("date").checked = false
    document.getElementById("error_panel").innerText = ""
}

// deselect digit type answer
function deselect_digit() {
    var caption_row = document.getElementById("digit_row_1")
    var data_row = document.getElementById("digit_row_2")
    document.getElementById("value").value = ""
    document.getElementById("unit").value = ""
    caption_row.style.display = 'none'
    data_row.style.display = 'none'
    document.getElementById("digit").checked = false
    document.getElementById("error_panel").innerText = ""
}

// deselect span type answer
function deselect_span() {
    var span_ind = document.getElementById("span_row").rowIndex
    var ans_table = document.getElementById("ans_table");
    var span_elements = get_elements_by_id_starts_with("ans_table", "input", "span-")

    if (span_elements.length > 0) {
        for (var i = 0; i < span_elements.length; i++) {
            // remove spans
            //span_elements[i].parentNode.parentNode.remove()
            var mark_node = span_elements[i].parentNode.nextSibling
            if (mark_node && (mark_node.innerText.charCodeAt().toString().includes("10004")
                    || mark_node.innerText.charCodeAt().toString().includes("10008"))) {
                mark_node.remove()
            }
            span_elements[i].value = ""
            span_elements[i].parentNode.parentNode.style.display = "none"
        }
        document.getElementById("span").checked = false
    }
    document.getElementById("error_panel").innerText = ""
}

//disable submission button
function disable_button(button_id) {
    document.getElementById(button_id).style.background = "darkgray";
    document.getElementById(button_id).disabled = true
}

// Edit an already added QA pair
function modify_previous_question() {
    edit_mode = true
    deselect_date()
    deselect_digit()
    deselect_span()
    document.getElementById("next_question").innerText = "RE-SUBMIT QUESTION"
    document.getElementById("next_question").disabled = false
    document.getElementById("next_question").style.background = "#2085bc";

    current_question_id = this.id

    var tabs = document.getElementsByClassName("rectangles")
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id != this.id) {
            document.getElementById(tabs[i].id).style.pointerEvents = 'none';
        }
    }

    var annotation = annotations[current_question_id]

    if (annotation.answer.checked == "date") {
        document.getElementById("date").checked = true
        document.getElementById("date_row_1").style.display = ""
        document.getElementById("date_row_2").style.display = ""
        document.getElementById("year").value = annotation.answer.date.year
        document.getElementById("month").value = annotation.answer.date.month
        document.getElementById("day").value = annotation.answer.date.day
    } else if (annotation.answer.checked == "digit") {
        document.getElementById("digit").checked = true
        document.getElementById("digit_row_1").style.display = ""
        document.getElementById("digit_row_2").style.display = ""
        document.getElementById("value").value = annotation.answer.digit.value
        document.getElementById("unit").value = annotation.answer.digit.unit
    } else if (annotation.answer.checked == "span") {
        document.getElementById("span").checked = true
        var span_elements = get_elements_by_id_starts_with("ans_table", "input", "span-")
        for (var i = 0; i < annotation.answer.spans.length; i++) {
            span_elements[i].parentNode.parentNode.style.display = ""
            span_elements[i].value = annotation.answer.spans[i]
            if (i != annotation.answer.spans.length - 1) {
                span_elements[i].parentNode.nextSibling.innerHTML = '<a href="delete_span" onclick="return delete_span(this);">&#9473;</a>'
            } else {
                span_elements[i].parentNode.nextSibling.innerHTML = '<a href="add_span" onclick="return add_span(this);">&#10010;</a>';
            }
        }
        //var last_row = span_elements[i - 1].parentNode.parentNode
        //last_row.cells[last_row.cells.length - 1].innerHTML = '<a href="add_span" onclick="return add_span(this);">&#10010;</a>';
    }

    document.getElementById("input-question").value = annotation.question

    document.getElementById('ai-answer').value = 'AI is thinking ...'
    initialize_answer()
    document.getElementById("input-question").dispatchEvent(new KeyboardEvent('keyup', { 'key': ' ' }))
}

// Create text for the bottom rectangle tab
function create_text_for_tab() {
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
    var empty_qa = false
    var correct_flag = true
    var length_flag = true
    var duplicate_check = false
    var ai_overlap = true
    var how_many_const = true
    var question_el = document.getElementById("input-question")
    if (question_el.value.trim() == "") {
        empty_qa = empty_qa || true
    }

    var qa_text = "Q: " + question_el.value.trim() + "\nA: "
    if (document.getElementById("date").checked) {
        var year = document.getElementById("year").value.trim()
        var month = document.getElementById("month").value.trim()
        var day = document.getElementById("day").value.trim()
        answer.date.year = year
        answer.date.month = month
        answer.date.day = day
        answer.checked = "date"

        var input_date = day + " " + month + " " + year
        input_date = input_date.trim()
        if (input_date == "") {
            empty_qa = empty_qa || true
        }
        qa_text = qa_text + input_date

        ai_overlap = bow_overlap(document.getElementById('ai-answer').value, input_date, 1.0)

        duplicate_check = duplicate_qa_check(qa_text)

    } else if (document.getElementById("digit").checked) {
        var dig = document.getElementById("value").value.trim()
        var unit = document.getElementById("unit").value.trim()
        var input_number = dig + " " + unit
        var input_number = input_number.trim()
        if (dig == "") {
            empty_qa = empty_qa || true
        }
        qa_text = qa_text + input_number

        answer.digit.value = dig
        answer.digit.unit = unit

        answer.checked = "digit"

        ai_overlap = bow_overlap(document.getElementById('ai-answer').value, input_number, 1.0)
        
        duplicate_check = duplicate_qa_check(qa_text)

        how_many_const = how_many_constraint()

    } else if (document.getElementById("span").checked) {
        var flags = span_match_check()
        var correct_flag = flags.correct_flag
        var length_flag = flags.length_flag
        var i_cnt = 0
        var input_spans = ""
       
        var span_elements = get_spans(true)
        for (var i = 0; i < span_elements.length; i++) {
            if (span_elements[i].value.trim() != "") {
                input_spans = input_spans + "[" + span_elements[i].value.trim() + "] "
                answer.spans.push(span_elements[i].value.trim())
            }
        }

        answer.checked = "span"

        if (input_spans.trim() == "")
            empty_qa = empty_qa || true

        ai_overlap = bow_overlap(document.getElementById('ai-answer').value, input_spans, 1.0)

        qa_text = qa_text + input_spans
        duplicate_check = duplicate_qa_check(qa_text)

    } else {
        empty_qa = empty_qa || true
    }

    answer.ai_answer = document.getElementById('ai-answer').value

    return {
        "qa_text": qa_text,
        "ai_overlap": ai_overlap,
        "empty_qa": empty_qa,
        "correct_text": correct_flag,
        "correct_length": length_flag,
        "duplicate_check": duplicate_check,
        "how_many_const": how_many_const,
        "annotation": answer
    }
}

//Submit the question 
function create_question() {
    var annotation = { question: "", answer: "" , passage: -1}

    annotation.question = document.getElementById("input-question").value
    annotation.passage = passage_ids[record_count - 1]

    //create the text for the bottom rectangle container containing QA pair 
    var result = create_text_for_tab(edit_mode)
    var qa_text = result.qa_text
    var ai_overlap = result.ai_overlap
    var empty_qa = result.empty_qa
    var correct_flag = result.correct_text
    var length_flag = result.correct_length
    var duplicate_check = result.duplicate_check
    var answer = result.annotation
    var how_many_const = result.how_many_const

    annotation.answer = answer
    annotations[current_question_id] = annotation

    var tab_container = document.getElementsByClassName("horizontal-scroll-wrapper")[0]

    // If all the checks satify 
    if (correct_flag && !ai_overlap && !empty_qa && !duplicate_check && how_many_const && length_flag) {

        // Create the bottom tab container if its a new questionand question is new add it
        if (!edit_mode) {
            var new_tab = document.createElement("div");
            new_tab.className = 'rectangles'
            new_tab.id = (record_count - 1) + '-' + question_num
            new_tab.onclick = modify_previous_question
            new_tab.innerText = qa_text
            tab_container.appendChild(new_tab);
            question_num = question_num + 1
            total_question_cnt = total_question_cnt + 1
            document.getElementsByClassName("passage_num")[0].innerText = "Passage: " + (record_count) + "/" + passages.length + " Questions: " + (total_question_cnt)
            current_question_id = (record_count - 1) + "-" + question_num
            // else just modify the text
        } else {
            var curr_tab = document.getElementById(current_question_id);
            curr_tab.innerText = qa_text
            document.getElementById("input-question").value = ""
        }
        reset()
        check_question_count()
    } 

}

function reset() {
    document.getElementById("input-question").value = ""
    document.getElementById("ai-answer").value = ""
    document.getElementById("error_panel").innerText = ""
    deselect_date()
    deselect_digit()
    deselect_span()

    disable_button("next_question")
    if (edit_mode) {
        document.getElementById("next_question").innerText = "ADD QUESTION"

        reset_passage_buttons()
        edit_mode = false
    }
    var tabs = document.getElementsByClassName("rectangles")
    for (var i = 0; i < tabs.length; i++) {
        //tabs[i].onclick = modify_previous_question
        document.getElementById(tabs[i].id).style.pointerEvents = 'auto';
    }
}

// Run span checks on hover 
function run_validations_span() {
    var result = create_text_for_tab()
    var qa_text = result.qa_text
    var ai_overlap = result.ai_overlap
    var empty_qa = result.empty_qa
    var correct_flag = result.correct_text
    var length_flag = result.correct_length
    var duplicate_check = result.duplicate_check

    if (correct_flag && !ai_overlap && !empty_qa && !duplicate_check && length_flag) {
        document.getElementById("next_question").style.background = "#2085bc";
        document.getElementById("next_question").disabled = false
        document.getElementById("next_question").title = ""
        document.getElementById("error_panel").innerText = ""
    }
    else if (!correct_flag) {
        disable_button("next_question")
        if (document.getElementById("span").checked) {
            document.getElementById("next_question").title = "Please check the spans. The text should match the spans in passage exactly!"
            document.getElementById("error_panel").innerText = "Please check the spans. The text should match the spans in passage exactly!"
        }
    } else if (!length_flag) {
        disable_button("next_question")
        if (document.getElementById("span").checked) {
            document.getElementById("next_question").title = "Please check the length of each span. Try creating a more specific question."
            document.getElementById("error_panel").innerText = "Please check the length of each span. Try creating a more specific question."
        }    
    } else if (empty_qa) {
        disable_button("next_question")
        document.getElementById("next_question").title = "Empty question or answer or span"
    } else if (ai_overlap) {
        disable_button("next_question")
        document.getElementById("next_question").title = "AI answer matches true answer. Please try a different question."
        document.getElementById("error_panel").innerText = "AI answer matches true answer. Please try a different question."
    } else if (duplicate_check) {
        disable_button("next_question")
        document.getElementById("next_question").title = "Same question-answer pair has already been added.  Please try a different question."
        document.getElementById("error_panel").innerText = "Same question-answer pair has already been added.  Please try a different question."
    } else {
        disable_button("next_question")
        document.getElementById("next_question").title = "Something wrong with the answer please try a differenet question."
        document.getElementById("error_panel").innerText = "Something wrong with the answer please try a differenet question."
    }
}

// Run date and digit checks on hover 
function run_validations_date_digit() {
    var result = create_text_for_tab()
    var qa_text = result.qa_text
    var empty_qa = result.empty_qa
    var correct_flag = result.correct_text
    var duplicate_check = result.duplicate_check
    var ai_overlap = result.ai_overlap
    var how_many_const = result.how_many_const

    if (!empty_qa && !duplicate_check && !ai_overlap && how_many_const) {
        document.getElementById("next_question").disabled = false
        document.getElementById("next_question").style.background = "#2085bc";
        document.getElementById("next_question").title = ""
        document.getElementById("error_panel").innerText = ""
    } else if (empty_qa) {
        disable_button("next_question")
        document.getElementById("next_question").title = "Empty question or answer or span"        
    } else if (ai_overlap) {
        disable_button("next_question")
        document.getElementById("next_question").title = "AI answer matches true answer. Please try a different question."
        document.getElementById("error_panel").innerText = "AI answer matches true answer. Please try a different question."
    } else if (duplicate_check) {
        disable_button("next_question")
        document.getElementById("next_question").title = "Same question-answer pair has already been added.  Please try a different question."
        document.getElementById("error_panel").innerText = "Same question-answer pair has already been added.  Please try a different question."
    } else if (!how_many_const) {
        disable_button("next_question")
        document.getElementById("next_question").title = "Please re-phrase the question as a how-many question for Number type answer"
        document.getElementById("error_panel").innerHTML = "Please re-phrase the question as a how-many question for Number type answer"
    } else {
        disable_button("next_question")
        document.getElementById("next_question").title = "Something wrong with the answer please try a different question."
        document.getElementById("error_panel").innerText = "Something wrong with the answer please try a different question."
    }
}

function duplicate_qa_check(cand_text) {
    cand_text = cand_text.toLowerCase().replace("[", "").replace("]", "")
    cand_text = cand_text.replace("  ", " ").trim()
    var qa_list = document.getElementsByClassName("rectangles")
    for (var i = 0; i < qa_list.length; i++) {
        var curr_text = qa_list[i].innerText.toLowerCase().replace("[", "").replace("]", "")
        curr_text = curr_text.replace("  ", " ").trim()
        if (cand_text == curr_text && qa_list[i].id != current_question_id) {
            return true
        }
    }
    return false
}

// Check for 'how many' string in question
function how_many_check() {
    var unit_el = document.getElementById("unit")
    var question_el = document.getElementById("input-question")
    if (question_el.value.toLowerCase().includes("how many") == true) {
        unit_el.disabled = true
    } else {
        unit_el.value = ""
        unit_el.disabled = false
    }
}

// Force re-phrasing as 'how many' question
function how_many_constraint() {
    var question_el = document.getElementById("input-question")
    return question_el.value.toLowerCase().includes("how many")
}

// Check if answer span overlaps with text in passage
function span_match_check() {
    var correct_flag = new Boolean(true);
    var length_flag = new Boolean(true)

    if (document.getElementById("span").checked) {
        var span_ind = document.getElementById("span_row").rowIndex
        var ans_table = document.getElementById("ans_table");

        var visible_spans = get_spans(true)
        var count = 0        
        while (count < visible_spans.length) {
            var span_id = "span-" + count
            if (document.getElementById(span_id)) {
                var span_value = document.getElementById(span_id).value
                var cur_span_row = document.getElementById(span_id).parentNode.parentNode
                span_value = span_value.replace(".", "\\.")
                var pattern = new RegExp(span_value);
                var passage_str = document.getElementById("input-question").value
                passage_str = passage_str + document.getElementsByClassName("passage-" + record_count)[0].innerText
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
    var q_span = parent.getElementsByClassName("ans_span10");
    reset_class(q_span, "ans_span10_high")
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
}

// event on hover over on annotated question
function highlight_q1_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
}

// event on hover over on annotated question
function highlight_q2_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span2");
    reset_class(q_span, "ans_span2_high")
    var q_span = parent.getElementsByClassName("ans_span3");
    reset_class(q_span, "ans_span3_high")
    var q_span = parent.getElementsByClassName("ans_span4");
    reset_class(q_span, "ans_span4_high")
}

// event on hover over on annotated question
function highlight_q3_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
}

// event on hover over on annotated question
function highlight_q4_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
}

// event on hover over on annotated question
function highlight_q5_nfl() {
    var parent = document.getElementsByClassName("passage-sample")[0];
    var q_span = parent.getElementsByClassName("ans_span6");
    reset_class(q_span, "ans_span6_high")
    var q_span = parent.getElementsByClassName("ans_span5");
    reset_class(q_span, "ans_span5_high")
    var q_span = parent.getElementsByClassName("ans_span1");
    reset_class(q_span, "ans_span1_high")
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

function create_tabs(prefix) {
    var rectangle_containers = []
    for (var key in annotations) {
        if (key.lastIndexOf(prefix, 0) == 0) {
            rectangle_containers.push(annotations[key])
        }
    }


}

// switch between next and previous passages
function populate_passage(config) {
    document.getElementById("ready_submit").onclick = null
    if (record_count <= passages.length) {
        var parent = document.getElementsByClassName("passage")[0];
        var passage_el = document.getElementsByClassName("passage-" + record_count)[0];
        passage_el.remove();
        reset_tabs()

        if (config == "next") {
            record_count = record_count + 1;

        } else {
            record_count = record_count - 1;
        }
        var rect_el = get_elements_by_class_starts_with("horizontal-scroll-wrapper", "div", (record_count - 1) + "-")
        question_num = rect_el.length

        document.getElementsByClassName("passage_num")[0].innerText = "Passage: " + (record_count) + "/" + passages.length + " Questions: " + (total_question_cnt)
        var new_passage = document.createElement("div");
        new_passage.innerText = passages[record_count - 1];
        new_passage.className = "passage-" + record_count;
        new_passage.style.fontSize = '15px'

        parent.appendChild(new_passage)

        var i = 0
        while (true) {
            var tab_qa = document.getElementById((record_count - 1) + "-" + i)
            if (!tab_qa) break;
            else {
                tab_qa.style.display = ""
                i = i + 1
            }
        }
    }
    reset_passage_buttons()
    current_question_id = (record_count - 1) + "-" + question_num
    document.getElementById("input-question").onkeyup = initialize_answer
    reset()
    check_question_count()

}

function reset_passage_buttons() {
    if (record_count <= 1) {
        disable_button("prev_passage")
    } else if (record_count == passages.length) {
        disable_button("next_passage")
    } else {
        document.getElementById("next_passage").disabled = false
        document.getElementById("prev_passage").disabled = false
        document.getElementById("prev_passage").style.background = "#2085bc"
        document.getElementById("next_passage").style.background = "#2085bc"
    }
}

// Reset element when previous passages control is selected
function reset_tabs() {
    var rectange_el = get_elements_by_class_starts_with("horizontal-scroll-wrapper", "div", (record_count - 1) + "-")
    for (var i = 0; i < rectange_el.length; i++) {
        rectange_el[i].style.display = "none"
    }
}


function resolve_response(response) {
    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
            response.status);
        document.getElementById('ai-answer').value = ""
        return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
        var ai_answer_container = document.getElementsByClassName("ai_answer")[0]
        var ai_input = document.getElementById('ai-answer')
        ai_input.value = data["best_span_str"]
        return;
    });
}

function error_response() {
    //document.getElementById("ai-answer").value = "Error while fetching AI answer" 
    document.getElementById("ai-answer").value = "AI is thinking ..."
}

function invoke_bidaf_with_retries(n) {
    document.getElementById('ai-answer').value = "AI is thinking ..."
    var r = {
        passage: document.getElementsByClassName('passage-' + record_count)[0].innerText,
        question: document.getElementById('input-question').value
    };
    return new Promise(function (resolve, reject) {
        prod_url = "https://sparc-bidaf-server.allenai.org/predict/machine-comprehension"
        dev_url = "https://sparc-bidaf-server.dev.allenai.org/predict"
        fetch(prod_url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(r)
        }).then(resolve_response)
          .catch(function (error) {
              if (n === 1) return reject(error_response);
              invoke_bidaf_with_retries(n - 1)
                  .then(resolve_response)
                  .catch(error_response);
          })
    });
}

function error_passages() {
    if (domain == "nfl") {
        passages = get_contents_nfl()
    } else {
        passages = get_contents_history()
    }
    populate_passage('next')
}

function fetch_passages_with_retries(n) {
    var data_url = ""
    if (domain == "nfl") {
        data_url = "https://s3.us-east-2.amazonaws.com/sparc-dataset/remaining_nfl_passages_2.json"
    } else {
        data_url = "https://s3.us-east-2.amazonaws.com/sparc-dataset/remaining_history_passages_2.json"
    }
    fetch(data_url)
        .then(parse_passages)
        .catch(function (error) {
            if (n === 1) return reject(error_passages);
            fetch_passages_with_retries(n - 1)
                .then(parse_passages)
                .catch(error_passages);
        })
    
}

// Get all the current spans
function get_spans(visible) {
    var span_elements = get_elements_by_id_starts_with("ans_table", "input", "span-")
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

// Delete an added span
function delete_span(el) {
    var curr_row = el.parentNode.parentNode
    var curr_span_id = el.parentNode.parentNode.firstChild.firstChild.id
    var start_span_id = parseInt(curr_span_id.replace("span-", ""))
    var visible_spans = get_spans(true)
    //var last_span_id = parseInt(visible_spans[visible_spans.length - 1].id.replace("span-", ""))    
    var last_span_id = get_spans(false).length
    for (var i = start_span_id + 1; i < last_span_id; i++) {
        var curr_span = document.getElementById("span-" + i)
        curr_span.id = "span-" + (i - 1)
        curr_span.name = "span-" + (i - 1)
    }

    var clone = curr_row.cloneNode(true);

    var curr_value = clone.cells[0].firstChild
    curr_value.onkeyup = run_validations_span
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

// Add a new answer span
function add_span(el) {
    deselect_digit()
    deselect_date()

    var ans_table = document.getElementById("ans_table");
    var span_index = el.parentNode.parentNode.rowIndex
    var span_row_start_index = document.getElementById("span_row").rowIndex
    var span_elements = get_elements_by_id_starts_with("ans_table", "input", "span-")
    var visible_spans = get_spans(true)

    var span_count = visible_spans.length

    if (!document.getElementById("span-" + span_count)) {
        var span_count = span_index - span_row_start_index
        var new_row = ans_table.insertRow(span_index + 1)
        var new_cell = new_row.insertCell(0)
        new_cell.innerHTML = '<input type="text" placeholder="copy text from passage here" id="span-' + span_count + '" name="span-' + span_count + '">';
        var new_ref = new_row.insertCell(1)
        new_ref.innerHTML = '<a href="add_span" onclick="return add_span(this);">&#10010;</a>'
        document.getElementById("span-" + span_count).onkeyup = run_validations_span
        if (span_count >= 1) {
            var prev_row = ans_table.rows[new_row.rowIndex - 1]
            var row_sub_link = prev_row.cells[prev_row.cells.length - 1]
            row_sub_link.innerHTML = ' <a href="delete_span" onclick="return delete_span(this);">&#9473;</a>'
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

function check_question_count() {
    if (total_question_cnt < min_questions) {
        document.getElementById("ready_submit").title = "Must write " + (min_questions - total_question_cnt) + " more questions to submit"

    } else {
        document.getElementById("ready_submit").title = ""
        document.getElementById("ready_submit").disabled = false
        document.getElementById("ready_submit").onclick = final_submit
        document.getElementById("ready_submit").style.background = "#2085bc";
        document.getElementById("ready_submit").value = "Ready to Submit"
    }
}

function final_submit() {
    var root = document.getElementById("generated_answers")
    for (var j = 0; j < num_passages; j++) {
        var passage_id_el = document.createElement("input")
        passage_id_el.id = "passage-id-" + j
        passage_id_el.name = "passage-id-" + j
        passage_id_el.value = passage_ids[j]
        passage_id_el.style.display = 'none'
        passage_id_el.type = "text"
        root.appendChild(passage_id_el)
    }
    for (var key in annotations) {
        var answer = annotations[key].answer
        var question_el = document.createElement("input")
        question_el.value = annotations[key].question
        question_el.id = "input-question-" + key
        question_el.name = "input-question-" + key
        question_el.type = "text"
        question_el.style.display = 'none'
        root.appendChild(question_el)

        var ai_answer = document.createElement("input")
        ai_answer.id = "ai-answer-" + key
        ai_answer.name = "ai-answer-" + key
        ai_answer.type = "text"
        ai_answer.style.display = 'none'
        ai_answer.value = annotations[key].answer.ai_answer
        root.appendChild(ai_answer)

        if (annotations[key].answer.checked == "span") {
            for (var i = 0; i < annotations[key].answer.spans.length; i++) {
                var span_el = document.createElement("input")
                span_el.id = "span-" + key + "-" + i
                span_el.name = "span-" + key + "-" + i
                span_el.type = "text"
                span_el.value = annotations[key].answer.spans[i]
                span_el.style.display = 'none'
                root.appendChild(span_el)
            }
        } else if (annotations[key].answer.checked == "date") {
            var year_el = document.createElement("input")
            year_el.type = "number"
            year_el.id = "year-" + key
            year_el.name = "year-" + key
            year_el.value = annotations[key].answer.date.year
            year_el.style.display = 'none'
            root.appendChild(year_el)

            var month_el = document.createElement("input")
            month_el.type = "text"
            month_el.id = "month-" + key
            month_el.name = "month-" + key
            month_el.value = annotations[key].answer.date.month
            month_el.style.display = 'none'
            root.appendChild(month_el)

            var day_el = document.createElement("input")
            day_el.type = "number"
            day_el.id = "day-" + key
            day_el.name = "day-" + key
            day_el.value = annotations[key].answer.date.day
            day_el.style.display = 'none'
            root.appendChild(day_el)

        } else if (annotations[key].answer.checked == "digit") {
            var value_el = document.createElement("input")
            value_el.type = "number"
            value_el.step = "any"
            value_el.id = "value-" + key
            value_el.name = "value-" + key
            value_el.value = annotations[key].answer.digit.value
            value_el.style.display = 'none'
            root.appendChild(value_el)

            var unit_el = document.createElement("input")
            unit_el.type = "number"
            unit_el.id = "unit-" + key
            unit_el.name = "unit-" + key
            unit_el.value = annotations[key].answer.digit.unit
            unit_el.style.display = 'none'
            root.appendChild(unit_el)
        }
    }

    var submission_container = document.getElementById("submission_container")
    var submit_button = document.createElement("input")
    submit_button.type = "submit"
    submit_button.className = "btn"
    submit_button.id = 'submitButton'
    submit_button.value = 'Submit HIT'
    submit_button.style.marginLeft = '5%'
    submit_button.enabled = true

    submission_container.appendChild(submit_button)

    document.getElementById("submission").style.display = ""
    //document.getElementById("submitButton").style.display = ""
    //document.getElementById("submitButton").disabled = false
    document.getElementById("comment").style.display = ""
    document.getElementsByClassName("main-container")[0].style.display = "none"  
}

function parse_passages(response) {
    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
            response.status);
        error_passages()
        return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
        var all_passages = data["passages"]
        for (var i = 0; i < num_passages; i++) {
            var idx = Math.floor((Math.random() * all_passages.length) + 1);
            passages.push(all_passages[idx])
            passage_ids[i] = domain + "_" + idx
        }
        populate_passage('next')
    });

}
