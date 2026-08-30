const universalStarter = `You are assisting a qualified clinician with entirely fictional or properly de-identified data.

Do not diagnose, prescribe, recommend a dose change, or treat the output as a medical record. Separate supplied facts from interpretations and missing information. Put urgent review flags first. Preserve dates, units, source labels and uncertainty. End with a "Clinician must verify" section.

Apply the workflow named in the first line of the sample input. Return a concise, presentation-ready draft.`;

const skills = [
  {
    id: "cgm-safety-copilot",
    number: "01",
    icon: "◒",
    title: "CGM Safety Copilot",
    category: "Diabetes",
    promise: "Turns a CGM export into a guarded pattern brief—without changing treatment.",
    tags: ["CGM", "AGP", "patterns", "hypoglycaemia"],
    use: [
      "Retrospective CGM or AGP preparation",
      "Time-of-day pattern review",
      "Questions for a diabetes consultation",
    ],
    inputs: [
      "De-identified CGM export or summary",
      "Observation period, units and target range",
      "Meal, activity and medicine timing when available",
    ],
    output: [
      "30-second clinical summary",
      "Metrics and data-quality check",
      "Observed vs inferred audit trail",
      "Consultation questions",
    ],
    safety: [
      "No insulin, pump or medicine change",
      "No diagnosis from an isolated sensor value",
      "Repeated or prolonged lows require direct clinical review",
    ],
    input: `workflow: cgm-safety-copilot
case: SYN-CGM-014 • target 70–180 mg/dL
00:00 128 | 03:00 66 (low alert; symptoms not recorded)
08:00 breakfast → 10:00 238
14:00 lunch → 16:00 158
18:00 walk 35 min → 20:00 dinner → 22:00 148
Second day repeats post-breakfast rise; one overnight low.
Create a 30-second clinician brief. Do not recommend dose changes.`,
    action: "Analyse synthetic CGM",
    resultTitle: "Pattern brief ready",
    summary:
      "Repeated post-breakfast rise is the clearest supplied pattern. One overnight low needs confirmation and context before interpretation.",
    metrics: [
      ["Data quality", "2-day illustrative extract", "neutral"],
      ["Most visible pattern", "08:00–10:00 rise", "amber"],
      ["Safety signal", "03:00 reading: 66 mg/dL", "rose"],
    ],
    facts: [
      "Observed: post-breakfast values exceeded the supplied target on both days.",
      "Observed: one overnight sensor value was below 70 mg/dL.",
      "Missing: symptoms, capillary confirmation, insulin timing and full 14-day coverage.",
    ],
    questions: [
      "Was the overnight low confirmed or symptomatic?",
      "What were breakfast portions and medicine timings?",
    ],
    boundary: "Pattern recognition only · no diagnosis · no dose recommendation",
  },
  {
    id: "endocrine-case-timeline",
    number: "02",
    icon: "⌁",
    title: "Endocrine Case Timeline",
    category: "Endocrinology",
    promise: "Aligns symptoms, medicines, investigations and response across a fragmented record.",
    tags: ["thyroid", "timeline", "case conference", "trends"],
    use: [
      "Complex endocrine referral preparation",
      "Case conference chronology",
      "Longitudinal chart review",
    ],
    inputs: [
      "De-identified dated events",
      "Laboratory units and reference ranges",
      "Medicine starts, stops and changes as recorded",
    ],
    output: [
      "Dated event table",
      "Trend summary",
      "Contradictions and missing intervals",
      "Questions raised by chronology",
    ],
    safety: [
      "Temporal association is not causation",
      "Original units and date precision are preserved",
      "No diagnosis inferred from an incomplete timeline",
    ],
    input: `workflow: endocrine-case-timeline
2025-11: palpitations and heat intolerance began
2026-01-12: TSH 0.02 mIU/L; FT4 2.1 ng/dL
2026-02-02: TRAb positive; numeric value absent
2026-02-14: carbimazole 10 mg twice daily recorded
2026-03-20: FT4 1.4; TSH 0.03
2026-05-18: FT4 0.7; TSH 4.9
Create a timeline and questions. Do not infer causation.`,
    action: "Reconstruct timeline",
    resultTitle: "Six events aligned",
    summary:
      "Biochemistry moved from elevated FT4 with suppressed TSH to low FT4 with raised TSH after treatment was recorded; this is association, not proof of cause.",
    metrics: [
      ["Events", "6 dated entries", "neutral"],
      ["Unit consistency", "Preserved", "teal"],
      ["Key gap", "TRAb value absent", "amber"],
    ],
    facts: [
      "Symptoms preceded the first supplied thyroid tests.",
      "Positive TRAb and an antithyroid medicine were recorded in February.",
      "Fatigue timing and any later dose adjustment are incomplete.",
    ],
    questions: [
      "Was the May result reviewed with exact dose and adherence?",
      "Is the numeric TRAb report available?",
    ],
    boundary: "Chronology support · temporal association is not causation",
  },
  {
    id: "dynamic-test-context-checker",
    number: "03",
    icon: "◷",
    title: "Dynamic Test Context Checker",
    category: "Endocrinology",
    promise: "Checks sampling time, protocol, medicines and assay context before interpretation.",
    tags: ["ACTH", "suppression", "stimulation", "protocol"],
    use: [
      "Stimulation or suppression test review",
      "Protocol-deviation detection",
      "Interpretability check before a case discussion",
    ],
    inputs: [
      "Claimed test and clinical question",
      "Dose and actual sample timestamps",
      "Assay units, local criteria and preparation context",
    ],
    output: [
      "Protocol-to-actual comparison",
      "Potential confounders",
      "Interpretability classification",
      "Exact missing facts",
    ],
    safety: [
      "No endocrine diagnosis",
      "No medicine stop/start recommendation",
      "No mixing assay-specific thresholds",
    ],
    input: `workflow: dynamic-test-context-checker
250 microgram ACTH test; ACTH given 09:27.
Samples labelled baseline 09:18, 30 min 10:02, 60 min 10:34.
Cortisol: 5.8, 13.9, 15.1 µg/dL.
Vomiting for 2 days; prednisolone ended 8 days earlier.
Assay-specific cutoff not supplied. Check interpretability.`,
    action: "Check test context",
    resultTitle: "Interpretability caution",
    summary:
      "The post-dose samples were approximately 35 and 67 minutes after ACTH. Acute illness, recent steroid exposure and the missing assay cutoff limit interpretation.",
    metrics: [
      ["Baseline", "9 min before ACTH", "teal"],
      ["‘30 min’ sample", "35 min after ACTH", "amber"],
      ["Assay cutoff", "Not supplied", "rose"],
    ],
    facts: [
      "Observed: collection times differ from their labels.",
      "Potential confounder: recent prednisolone exposure.",
      "Missing: assay method and local decision threshold.",
    ],
    questions: [
      "Which assay-specific threshold applies?",
      "Was glucocorticoid exposure considered when ordering?",
    ],
    boundary: "Protocol check only · no adrenal diagnosis",
  },
  {
    id: "medical-myth-evidence-checker",
    number: "04",
    icon: "≟",
    title: "Medical Myth Evidence Checker",
    category: "Evidence",
    promise: "Turns a health claim into a respectful, source-aware correction.",
    tags: ["myth", "evidence", "jaggery", "patient reply"],
    use: [
      "Diabetes, thyroid, diet or supplement claims",
      "Patient-friendly myth-busting",
      "WhatsApp education drafts",
    ],
    inputs: [
      "Exact claim and intended audience",
      "Decision the claim may influence",
      "Current sources or web access",
    ],
    output: [
      "Evidence classification",
      "What is true vs misleading",
      "Potential harm",
      "Plain-language response with sources",
    ],
    safety: [
      "No fabricated citation or statistic",
      "No shame or cultural dismissal",
      "No instruction to stop prescribed treatment",
    ],
    input: `workflow: medical-myth-evidence-checker
Claim: “Jaggery is natural, so it does not raise blood glucose
like white sugar.”
Audience: adult with type 2 diabetes in India.
Create a 30-second answer, a WhatsApp reply and an evidence table.
Do not recommend changing medication.`,
    action: "Check the claim",
    resultTitle: "Claim classified: misleading",
    summary:
      "“Natural” describes how a product is made, not its glucose effect. Jaggery remains an added sugar and can raise blood glucose; portion and total carbohydrate still matter.",
    metrics: [
      ["Verdict", "Misleading", "amber"],
      ["What is true", "Less refined", "neutral"],
      ["Clinical relevance", "Still contributes sugar", "rose"],
    ],
    facts: [
      "Respectful reply avoids describing the belief as foolish.",
      "The exact rise varies with portion, meal composition and the individual.",
      "Current source links must be verified before distribution.",
    ],
    questions: [
      "Would a teaspoon comparison help?",
      "What portion is actually used each day?",
    ],
    boundary: "Evidence communication · verify live citations before use",
  },
  {
    id: "multilingual-patient-explainer",
    number: "05",
    icon: "अ",
    title: "Multilingual Patient Explainer",
    category: "Communication",
    promise: "Drafts plain-language education in the patient’s preferred language and channel.",
    tags: ["Hindi", "patient education", "WhatsApp", "teach-back"],
    use: [
      "Condition explanations after consultation",
      "WhatsApp or print education",
      "Teach-back prompts",
    ],
    inputs: [
      "Condition and clinician-supplied points",
      "Language, literacy level and region",
      "Channel and maximum length",
    ],
    output: [
      "Target-language draft",
      "English back-translation",
      "Warning signs from supplied instructions",
      "Teach-back questions",
    ],
    safety: [
      "No invented individual plan",
      "No dosage translation unless supplied verbatim",
      "Clinician or qualified-language review before sending",
    ],
    input: `workflow: multilingual-patient-explainer
Condition: Prediabetes
Language: simple Hindi in Devanagari
Channel: WhatsApp after consultation; maximum 180 words
Include what it is, what can help, repeat test in 3 months,
warning symptoms and three teach-back questions.`,
    action: "Draft Hindi explainer",
    resultTitle: "Hindi patient note ready",
    summary:
      "प्रीडायबिटीज़ का मतलब है कि खून में शुगर सामान्य से अधिक है, लेकिन अभी डायबिटीज़ की सीमा में नहीं है। छोटे और टिकाऊ बदलाव मदद कर सकते हैं।",
    metrics: [
      ["Reading level", "Plain language", "teal"],
      ["Length", "146 words", "neutral"],
      ["Review", "Back-translation included", "amber"],
    ],
    facts: [
      "आज से मीठे पेय कम करें और भोजन के बाद चलें।",
      "डॉक्टर की सलाह के अनुसार 3 महीने में जाँच दोहराएँ।",
      "Teach-back asks the patient to explain prediabetes in their own words.",
    ],
    questions: [
      "Are these Hindi terms locally familiar?",
      "Has every warning instruction been verified?",
    ],
    boundary: "Draft translation · clinician/language review before sending",
  },
  {
    id: "indian-diet-plan-generator",
    number: "06",
    icon: "◉",
    title: "Indian Diet Plan Generator",
    category: "Nutrition",
    promise: "Maps a clinician-supplied calorie value to familiar Indian meal options and swaps.",
    tags: ["diet", "calories", "Indian foods", "diabetes"],
    use: [
      "Structured counselling draft",
      "Household-measure meal ideas",
      "Regional food substitutions",
    ],
    inputs: [
      "Clinician-supplied calorie target",
      "Region, dietary pattern and preferences",
      "Allergies, budget, cooking access and restrictions",
    ],
    output: [
      "Meal-by-meal calorie framework",
      "Household portions",
      "Two swaps per meal",
      "Assumptions and specialist flags",
    ],
    safety: [
      "Does not calculate a therapeutic target",
      "Not for renal, pregnancy, paediatric or eating-disorder plans without specialist oversight",
      "Calories and portions are estimates",
    ],
    input: `workflow: indian-diet-plan-generator
Clinician-supplied target: 1600 kcal/day
Karnataka; lacto-vegetarian; no peanuts.
Likes idli, ragi, curd rice and filter coffee.
Create one day with household portions, approximate calories,
two swaps per meal and a shopping note.`,
    action: "Build illustrative plan",
    resultTitle: "1600 kcal framework drafted",
    summary:
      "A five-meal Karnataka-style framework uses familiar foods, visible portion estimates and swaps while keeping the target explicitly clinician-supplied.",
    metrics: [
      ["Breakfast", "~350 kcal", "teal"],
      ["Lunch", "~500 kcal", "neutral"],
      ["Dinner", "~420 kcal", "neutral"],
    ],
    facts: [
      "Breakfast: 2 small idlis, sambar and unsweetened filter coffee.",
      "Lunch: 2 small ragi rotis, palya, dal and curd.",
      "Renal and pregnancy context was not supplied.",
    ],
    questions: [
      "Are portions feasible at home?",
      "Does a dietitian need to adapt protein or sodium?",
    ],
    boundary: "Illustrative planning · not a therapeutic nutrition prescription",
  },
  {
    id: "medicine-constituent-navigator",
    number: "07",
    icon: "Rx",
    title: "Medicine Constituent Navigator",
    category: "Medication safety",
    promise: "Reveals duplicate active ingredients hidden behind brand names.",
    tags: ["medicine", "constituent", "duplicate", "pharmacy"],
    use: [
      "Indian brand-name reconciliation",
      "Combination-product overlap",
      "Pharmacy search preparation",
    ],
    inputs: [
      "Exact label, ingredient, strength and formulation",
      "Patient-reported medicine list",
      "Approved catalogue or live pharmacy source when available",
    ],
    output: [
      "Ingredient map",
      "Duplicate or overlap flags",
      "Uncertain matches",
      "Prescriber and pharmacist questions",
    ],
    safety: [
      "No substitution, start or stop instruction",
      "No inference of bioequivalence or live stock",
      "Ambiguous labels require pharmacist verification",
    ],
    input: `workflow: medicine-constituent-navigator
Glucofine-M 500: metformin 500 mg immediate release
DiaBalance Duo 50/500: vildagliptin 50 mg + metformin 500 mg IR
Thyrocalm 50: levothyroxine 50 micrograms
Find duplicate ingredient exposure and prepare prescriber questions.
All brand and pharmacy names are fictional.`,
    action: "Compare constituents",
    resultTitle: "Duplicate ingredient found",
    summary:
      "Metformin 500 mg appears in two listed products. This is a reconciliation flag—not an instruction to stop either medicine.",
    metrics: [
      ["Products parsed", "3", "neutral"],
      ["Active ingredients", "3 unique", "teal"],
      ["Overlap", "Metformin × 2", "rose"],
    ],
    facts: [
      "Glucofine-M 500 contains metformin 500 mg IR.",
      "DiaBalance Duo contains vildagliptin plus metformin 500 mg IR.",
      "Live pharmacy stock is unknown without an approved source.",
    ],
    questions: [
      "Were both metformin-containing products intended?",
      "Can total daily exposure and formulation be verified?",
    ],
    boundary: "Reconciliation flag · no substitution or stop instruction",
  },
  {
    id: "diabetes-visit-brief",
    number: "08",
    icon: "▤",
    title: "One-Minute Diabetes Visit Brief",
    category: "Clinic workflow",
    promise: "Surfaces trends, safety flags and care gaps before the clinician walks in.",
    tags: ["pre-visit", "care gaps", "HbA1c", "screening"],
    use: [
      "Outpatient diabetes preparation",
      "Trend and care-gap review",
      "Focused visit agenda",
    ],
    inputs: [
      "De-identified chart extract and date range",
      "HbA1c, glucose, kidney, BP and lipid trends",
      "Medicines, complications and screening history",
    ],
    output: [
      "60-second brief",
      "Ranked safety flags",
      "Documented care gaps",
      "Three-item visit agenda",
    ],
    safety: [
      "No complication diagnosis",
      "No medicine or dose recommendation",
      "A missing item may be outside the supplied record",
    ],
    input: `workflow: diabetes-visit-brief
HbA1c: 8.7% → 8.1% → 7.6%.
eGFR: 78 → 75 → 72.
Two possible lows after skipped lunch; values not recorded.
Urine albumin last documented Oct 2024; retinal screen Jan 2025;
foot exam not found in supplied 12-month record.
Create a 60-second brief. No treatment changes.`,
    action: "Create visit brief",
    resultTitle: "Visit brief ready",
    summary:
      "HbA1c improved across three visits, while possible hypoglycaemia and overdue or missing complication documentation deserve today’s attention.",
    metrics: [
      ["HbA1c trend", "8.7 → 7.6%", "teal"],
      ["Safety", "2 possible lows", "rose"],
      ["Care gaps", "3 to verify", "amber"],
    ],
    facts: [
      "eGFR declined from 78 to 72 in the supplied interval.",
      "Verify urine albumin, retinal status and foot examination.",
      "Agenda: clarify lows, review trends and agree screening next steps.",
    ],
    questions: [
      "Were symptoms measured or assisted?",
      "Are screenings absent or outside this extract?",
    ],
    boundary: "Pre-visit support · care gaps require chart verification",
  },
  {
    id: "guideline-visit-checklist",
    number: "09",
    icon: "✓",
    title: "Guideline-to-Visit Checklist",
    category: "Evidence",
    promise: "Maps a supplied recommendation to documented patient facts and missing context.",
    tags: ["guideline", "checklist", "grounding", "consultation"],
    use: [
      "Source-grounded visit preparation",
      "Recommendation-to-case mapping",
      "Patient-plan questions",
    ],
    inputs: [
      "Exact source excerpt and date",
      "Population, exceptions and strength wording",
      "De-identified case facts",
    ],
    output: [
      "Recommendation map",
      "Present, absent, conflicting or missing evidence",
      "Consultation checklist",
      "Patient-plan placeholders",
    ],
    safety: [
      "No invented recommendation or citation",
      "A guideline is not an individual mandate",
      "Local formulary and patient preferences may alter application",
    ],
    input: `workflow: guideline-visit-checklist
Source: Fictional Demo Diabetes Standard, 2026.
Excerpt: record eGFR and urine albumin annually; ask about
hypoglycaemia at medicine review; include foot and retinal status.
Case: eGFR 72; urine albumin last Oct 2024; two possible lows;
foot exam not found; retinal screen Jan 2025.
Build a grounded visit checklist.`,
    action: "Ground the checklist",
    resultTitle: "Four recommendations mapped",
    summary:
      "The checklist stays anchored to the supplied excerpt: one current item, three needing clarification or updated documentation, and no invented recommendation.",
    metrics: [
      ["Recommendations", "4 mapped", "neutral"],
      ["Current evidence", "eGFR present", "teal"],
      ["Needs verification", "3 items", "amber"],
    ],
    facts: [
      "Present: recent eGFR is recorded.",
      "Review urine albumin timing, lows, foot and retinal status.",
      "The fictional excerpt demonstrates grounding, not guidance.",
    ],
    questions: [
      "Does the full source include exceptions?",
      "Which missing items can be verified today?",
    ],
    boundary: "Supplied-source grounding · not an individual mandate",
  },
  {
    id: "hypoglycaemia-event-reconstructor",
    number: "10",
    icon: "↺",
    title: "Hypoglycaemia Event Reconstructor",
    category: "Safety review",
    promise: "Builds a minute-by-minute event without assigning blame or causality.",
    tags: ["hypoglycaemia", "incident", "timeline", "prevention"],
    use: [
      "Safety or incident review",
      "Event chronology",
      "Prevention questions",
    ],
    inputs: [
      "Glucose, medicine, meal and activity times",
      "Symptoms, treatment and recovery",
      "Source type for every glucose value",
    ],
    output: [
      "Minute-by-minute sequence",
      "Observed, reported, inferred and missing evidence",
      "Plausible contributors",
      "Clinician and patient questions",
    ],
    safety: [
      "No root-cause assertion or blame",
      "No regimen change",
      "An ongoing event requires the established emergency plan, not analysis",
    ],
    input: `workflow: hypoglycaemia-event-reconstructor
19:35 pre-dinner rapid insulin recorded; dose omitted.
19:50 dinner delayed; tea only. 20:15 walk 25 min.
20:42 CGM 68 ↓. 20:47 sweating/tremor.
20:49 capillary 61. 20:51 15 g carbohydrate.
21:08 capillary 86, improving. 21:20 dinner.
Reconstruct plausible contributors without asserting causality.`,
    action: "Reconstruct event",
    resultTitle: "Event sequence reconstructed",
    summary:
      "A delayed meal and activity occurred after recorded rapid-acting insulin and before confirmed low glucose. They are plausible contributors, not proven causes.",
    metrics: [
      ["Confirmed low", "61 mg/dL capillary", "rose"],
      ["Recovery check", "86 mg/dL at 17 min", "teal"],
      ["Causality", "Not assigned", "neutral"],
    ],
    facts: [
      "Sequence: medicine, delayed meal, walk, symptoms, confirmed low.",
      "Response and improvement were recorded.",
      "Missing: exact dose, prior glucose and earlier activity.",
    ],
    questions: [
      "Was the meal delay anticipated?",
      "What prevention plan follows clinician review?",
    ],
    boundary: "Incident reconstruction · no regimen change or blame",
  },
];

const categories = ["All", ...new Set(skills.map((skill) => skill.category))];
let activeDemoId = skills[0].id;
let activeFilter = "All";
let searchQuery = "";
let demoTimer;

const demoNav = document.querySelector("#demo-nav");
const demoIcon = document.querySelector("#demo-icon");
const demoKicker = document.querySelector("#demo-kicker");
const demoName = document.querySelector("#demo-name");
const demoPromise = document.querySelector("#demo-promise");
const demoInput = document.querySelector("#demo-input");
const runDemo = document.querySelector("#run-demo");
const runLabel = document.querySelector("#run-label");
const demoOutput = document.querySelector("#demo-output");
const skillGrid = document.querySelector("#skill-grid");
const filters = document.querySelector("#filters");
const resultCount = document.querySelector("#result-count");
const noResults = document.querySelector("#no-results");
const dialog = document.querySelector("#skill-dialog");
const dialogContent = document.querySelector("#dialog-content");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function activeSkill() {
  return skills.find((skill) => skill.id === activeDemoId) || skills[0];
}

function emptyOutput() {
  demoOutput.innerHTML = `
    <div class="empty-output">
      <span class="ready-mark">N</span>
      <h4>Ready to run a synthetic case</h4>
      <p>The result will show observations, uncertainty, next questions and a visible human checkpoint.</p>
      <span class="guardrail">Guardrail active · no diagnosis · no prescribing</span>
    </div>`;
}

function renderDemoNav() {
  demoNav.innerHTML = skills
    .map(
      (skill) => `
        <button
          type="button"
          data-demo-id="${skill.id}"
          class="${skill.id === activeDemoId ? "active" : ""}"
          aria-pressed="${skill.id === activeDemoId}"
        >
          <span class="nav-icon">${skill.icon}</span>
          <span>
            <small>${skill.number} · ${skill.category}</small>
            <strong>${skill.title}</strong>
          </span>
          <span class="nav-arrow">›</span>
        </button>`,
    )
    .join("");
}

function selectDemo(id, scroll = false) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) return;
  activeDemoId = id;
  window.clearTimeout(demoTimer);
  runDemo.classList.remove("running");
  runDemo.disabled = false;
  demoIcon.textContent = skill.icon;
  demoKicker.textContent = `Skill ${skill.number} · ${skill.category}`;
  demoName.textContent = skill.title;
  demoPromise.textContent = skill.promise;
  demoInput.textContent = skill.input;
  runLabel.textContent = skill.action;
  emptyOutput();
  renderDemoNav();
  if (scroll) document.querySelector("#demo").scrollIntoView({ behavior: "smooth" });
}

function runActiveDemo() {
  const skill = activeSkill();
  runDemo.disabled = true;
  runDemo.classList.add("running");
  runLabel.textContent = "Applying guarded workflow";
  runDemo.querySelector("i").textContent = "···";
  demoTimer = window.setTimeout(() => {
    demoOutput.innerHTML = `
      <div class="result">
        <div class="result-head">
          <span class="result-check">✓</span>
          <div>
            <small>Result · synthetic case</small>
            <h4>${skill.resultTitle}</h4>
          </div>
          <b>Clinician review</b>
        </div>
        <p class="result-summary">${skill.summary}</p>
        <div class="result-metrics">
          ${skill.metrics
            .map(
              ([label, value, tone]) =>
                `<div class="${tone}"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}
        </div>
        <div class="result-columns">
          <div>
            <h5>Audit trail</h5>
            ${skill.facts
              .map((fact) => `<p><i>•</i><span>${fact}</span></p>`)
              .join("")}
          </div>
          <div>
            <h5>Ask next</h5>
            ${skill.questions
              .map(
                (question, index) =>
                  `<p><i>${index + 1}</i><span>${question}</span></p>`,
              )
              .join("")}
          </div>
        </div>
        <div class="human-checkpoint">
          <span>Human checkpoint</span>
          <strong>${skill.boundary}</strong>
        </div>
      </div>`;
    runDemo.disabled = false;
    runDemo.classList.remove("running");
    runLabel.textContent = skill.action;
    runDemo.querySelector("i").textContent = "→";
  }, 850);
}

function renderFilters() {
  filters.innerHTML = categories
    .map(
      (category) => `
        <button
          type="button"
          data-filter="${category}"
          class="${category === activeFilter ? "active" : ""}"
          aria-pressed="${category === activeFilter}"
        >${category}</button>`,
    )
    .join("");
}

function filteredSkills() {
  const query = searchQuery.trim().toLowerCase();
  return skills.filter((skill) => {
    const inCategory = activeFilter === "All" || skill.category === activeFilter;
    const haystack = [
      skill.title,
      skill.category,
      skill.promise,
      ...skill.tags,
      ...skill.use,
      ...skill.output,
    ]
      .join(" ")
      .toLowerCase();
    return inCategory && (!query || haystack.includes(query));
  });
}

function renderCatalogue() {
  const visible = filteredSkills();
  resultCount.textContent = `${visible.length} ${visible.length === 1 ? "skill" : "skills"}`;
  noResults.hidden = visible.length !== 0;
  skillGrid.hidden = visible.length === 0;
  skillGrid.innerHTML = visible
    .map(
      (skill) => `
        <article class="skill-card" data-card-id="${skill.id}">
          <div class="card-top">
            <span class="card-icon">${skill.icon}</span>
            <span class="card-number">SKILL ${skill.number}</span>
          </div>
          <p class="category">${skill.category}</p>
          <h3>${skill.title}</h3>
          <p>${skill.promise}</p>
          <div class="tag-row">${skill.tags
            .slice(0, 4)
            .map((tag) => `<span>${tag}</span>`)
            .join("")}</div>
          <div class="card-actions">
            <button type="button" data-doc-id="${skill.id}">Documentation</button>
            <button type="button" data-try-id="${skill.id}">Try demo</button>
            <a href="./downloads/${skill.id}.zip" download aria-label="Download ${skill.title}">ZIP ↓</a>
          </div>
        </article>`,
    )
    .join("");
}

function openDocumentation(id) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) return;
  dialogContent.innerHTML = `
    <header class="dialog-hero">
      <small>Skill ${skill.number} · ${skill.category}</small>
      <h2>${skill.title}</h2>
      <p>${skill.promise}</p>
    </header>
    <div class="dialog-body">
      <div class="dialog-grid">
        <section class="doc-block">
          <h3>Useful for</h3>
          <ul>${skill.use.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>
        <section class="doc-block">
          <h3>Inputs needed</h3>
          <ul>${skill.inputs.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>
        <section class="doc-block">
          <h3>Returns</h3>
          <ul>${skill.output.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>
        <section class="doc-block">
          <h3>Safety boundaries</h3>
          <ul>${skill.safety.map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>
      </div>
      <section class="sample-block">
        <h3>Ready-to-run synthetic sample</h3>
        <pre>${escapeHtml(skill.input)}</pre>
      </section>
      <div class="dialog-actions">
        <button type="button" data-copy-sample="${skill.id}">Copy guarded prompt + sample</button>
        <button type="button" data-dialog-demo="${skill.id}">Run in live demo</button>
        <a href="./downloads/${skill.id}.zip" download>Download Skill ZIP</a>
      </div>
    </div>`;
  dialog.showModal();
  history.replaceState(null, "", `#skill=${skill.id}`);
}

async function copyText(value, button) {
  await navigator.clipboard.writeText(value);
  const previous = button.textContent;
  button.textContent = "Copied ✓";
  window.setTimeout(() => {
    button.textContent = previous;
  }, 1500);
}

demoNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-demo-id]");
  if (button) selectDemo(button.dataset.demoId);
});

runDemo.addEventListener("click", runActiveDemo);

document.querySelector("#copy-demo").addEventListener("click", (event) => {
  copyText(`${universalStarter}\n\n${activeSkill().input}`, event.currentTarget);
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderCatalogue();
});

document.querySelector("#skill-search").addEventListener("input", (event) => {
  searchQuery = event.target.value;
  renderCatalogue();
});

skillGrid.addEventListener("click", (event) => {
  const docButton = event.target.closest("[data-doc-id]");
  const tryButton = event.target.closest("[data-try-id]");
  if (docButton) openDocumentation(docButton.dataset.docId);
  if (tryButton) selectDemo(tryButton.dataset.tryId, true);
});

dialogContent.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy-sample]");
  const demoButton = event.target.closest("[data-dialog-demo]");
  if (copyButton) {
    const skill = skills.find((item) => item.id === copyButton.dataset.copySample);
    copyText(`${universalStarter}\n\n${skill.input}`, copyButton);
  }
  if (demoButton) {
    dialog.close();
    selectDemo(demoButton.dataset.dialogDemo, true);
  }
});

dialog.addEventListener("close", () => {
  if (location.hash.startsWith("#skill=")) history.replaceState(null, "", "#catalogue");
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector("#copy-universal").addEventListener("click", (event) => {
  copyText(universalStarter, event.currentTarget);
});

renderDemoNav();
selectDemo(skills[0].id);
renderFilters();
renderCatalogue();

if (location.hash.startsWith("#skill=")) {
  openDocumentation(location.hash.replace("#skill=", ""));
}
