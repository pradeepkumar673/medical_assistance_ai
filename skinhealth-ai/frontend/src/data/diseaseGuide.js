/**
 * Detailed medical information for each HAM10000 skin condition.
 * For educational use only; not a substitute for professional diagnosis.
 */

export const DISEASE_GUIDE = {
  'Actinic Keratoses': {
    shortName: 'AK',
    tagline: 'Sun-induced precancerous skin growths',
    whatIs: `Actinic keratoses (AKs) are rough, scaly patches that develop on skin that has been repeatedly exposed to the sun over many years. They are considered precancerous because a small percentage (about 5–10%) can progress to squamous cell carcinoma (SCC) if left untreated. They are caused by cumulative ultraviolet (UV) damage to the skin and are most common in fair-skinned people over 40.`,
    symptoms: [
      'Rough, dry, or scaly patches, often slightly raised',
      'Pink, red, or brown in color',
      'Flat or slightly raised; may feel like sandpaper',
      'Sometimes itch or burn',
      'Most often on face, lips, ears, back of hands, forearms, scalp, or neck',
      'May bleed or develop a horn-like projection in rare cases',
    ],
    whatItCouldLeadTo: [
      'Squamous cell carcinoma (SCC) in a minority of cases if untreated',
      'Persistent discomfort or cosmetic concern',
      'Recurrence in the same or new areas with continued sun exposure',
    ],
    precautions: [
      'Limit sun exposure, especially between 10 a.m. and 4 p.m.',
      'Use broad-spectrum sunscreen (SPF 30+) daily and reapply every 2 hours outdoors',
      'Wear protective clothing, hats, and sunglasses',
      'Avoid tanning beds and UV lamps',
      'Perform regular self-skin checks and see a dermatologist yearly',
      'Treat AKs as recommended (cryotherapy, topical creams, photodynamic therapy) to reduce cancer risk',
    ],
    whatToAvoid: [
      'Picking, scratching, or trying to remove lesions at home',
      'Prolonged unprotected sun exposure',
      'Tanning beds',
      'Ignoring new or changing spots',
    ],
    firstAid: 'Avoid further sun exposure to the area. Apply sunscreen and keep the area moisturized. Schedule a dermatologist visit for proper diagnosis and treatment (e.g., cryotherapy or prescription creams). Do not try to remove the lesion yourself.',
    riskLevel: 'Moderate',
    urgency: 'Schedule a dermatologist visit within a few weeks.',
  },

  'Basal Cell Carcinoma': {
    shortName: 'BCC',
    tagline: 'Most common form of skin cancer',
    whatIs: `Basal cell carcinoma (BCC) is the most common type of skin cancer. It arises from the basal cells in the deepest layer of the epidermis and is strongly linked to cumulative UV exposure. BCC usually grows slowly and rarely spreads to other parts of the body, but it can invade nearby tissue and cause disfigurement if not treated. It often appears as a pearly bump, a sore that does not heal, or a pink growth.`,
    symptoms: [
      'Pearly or waxy bump, often with visible blood vessels',
      'Flat, flesh-colored or brown scar-like lesion',
      'Sore that bleeds, heals, and returns',
      'Pink growth with a raised border and central indentation',
      'Common on sun-exposed areas: face, ears, neck, scalp, shoulders',
    ],
    whatItCouldLeadTo: [
      'Local destruction of skin and underlying structures if neglected',
      'Rarely, spread to lymph nodes or distant organs (very uncommon)',
      'Recurrence in the same area or new BCCs elsewhere',
    ],
    precautions: [
      'Sun protection: sunscreen, clothing, shade',
      'Annual skin exams by a dermatologist',
      'Report any new or changing growths promptly',
      'Complete removal or treatment as advised (surgery, Mohs, radiation, or topical therapy)',
    ],
    whatToAvoid: [
      'Delaying diagnosis or treatment',
      'Unprotected sun exposure and tanning beds',
      'Picking or cutting the lesion',
    ],
    firstAid: 'Keep the area clean and covered. Do not scratch or attempt to remove it. See a dermatologist as soon as possible for a biopsy and treatment plan.',
    riskLevel: 'High (cancer)',
    urgency: 'See a dermatologist within 1–2 weeks.',
  },

  'Benign Keratosis': {
    shortName: 'BKL',
    tagline: 'Non-cancerous skin growths',
    whatIs: `Benign keratosis (e.g., seborrheic keratosis, solar lentigo) refers to non-cancerous skin growths that can look waxy, scaly, or like “stuck-on” patches. They are very common with aging and sun exposure and do not turn into cancer. They are harmless but can be removed for cosmetic reasons or if they get irritated.`,
    symptoms: [
      'Waxy, stuck-on appearance; brown, black, or tan',
      'Round or oval; may look like a dab of wax',
      'Usually on face, chest, shoulders, or back',
      'Can itch or become irritated when rubbed',
      'Multiple lesions often develop over time',
    ],
    whatItCouldLeadTo: [
      'No cancer risk; purely benign',
      'Occasional irritation or inflammation if rubbed or snagged',
      'Cosmetic concern for some people',
    ],
    precautions: [
      'Sun protection to slow development of new lesions',
      'Avoid scratching or picking; see a doctor if one changes unexpectedly (to rule out other conditions)',
    ],
    whatToAvoid: [
      'Scratching or picking (can cause bleeding or infection)',
      'Using harsh scrubs or chemicals on the lesions',
    ],
    firstAid: 'No urgent action needed. If it bleeds or gets infected, keep it clean and covered and see a doctor. Removal is optional and can be done by a dermatologist for comfort or appearance.',
    riskLevel: 'Low',
    urgency: 'Routine check; no urgency unless it changes or bleeds.',
  },

  'Dermatofibroma': {
    shortName: 'DF',
    tagline: 'Harmless firm bump, often on legs',
    whatIs: `Dermatofibromas are small, firm, benign bumps that often appear on the legs (and sometimes arms or elsewhere) after minor trauma like an insect bite or splinter. They consist of fibrous tissue and are harmless. They may dimple when pinched and rarely need treatment.`,
    symptoms: [
      'Small, firm bump; pink, red, or brown',
      'Dimples inward when pinched',
      'Often on legs, sometimes arms or trunk',
      'Usually painless; can be slightly tender',
      'May darken over time',
    ],
    whatItCouldLeadTo: [
      'No cancer risk',
      'Rarely, slight tenderness or cosmetic concern',
    ],
    precautions: [
      'No specific prevention; avoid unnecessary trauma to the skin',
      'If uncertain, a dermatologist can confirm the diagnosis',
    ],
    whatToAvoid: [
      'Picking, cutting, or trying to remove it at home',
      'Repeated trauma or shaving over it (can cause irritation)',
    ],
    firstAid: 'No treatment required. If it bleeds, gets infected, or changes, see a doctor. Removal is optional and can be done surgically if desired.',
    riskLevel: 'Low',
    urgency: 'Routine; no urgency.',
  },

  'Melanoma': {
    shortName: 'MEL',
    tagline: 'Serious skin cancer that can spread',
    whatIs: `Melanoma is a type of skin cancer that develops from melanocytes (pigment-producing cells). It is less common than BCC and SCC but more dangerous because it can spread to lymph nodes and other organs if not caught early. Early detection greatly improves outcomes. It can appear as a new dark spot or a change in an existing mole (ABCDE: Asymmetry, Border irregularity, Color variation, Diameter >6 mm, Evolving).`,
    symptoms: [
      'New mole or existing mole that changes in size, shape, or color',
      'Asymmetric shape; irregular or jagged border',
      'Multiple colors (brown, black, red, white, blue)',
      'Diameter larger than a pencil eraser (about 6 mm)',
      'Itching, bleeding, or not healing',
      'Can occur anywhere, including areas with little sun exposure',
    ],
    whatItCouldLeadTo: [
      'Spread to lymph nodes and other organs if not treated early',
      'Serious illness or death in advanced cases',
      'Recurrence or new primary melanomas; need long-term follow-up',
    ],
    precautions: [
      'Strict sun protection and avoiding tanning beds',
      'Regular self-skin checks and annual dermatologist exams',
      'Know the ABCDEs of melanoma and report changes immediately',
      'Early biopsy and treatment of suspicious lesions',
    ],
    whatToAvoid: [
      'Delaying evaluation of a changing or suspicious mole',
      'Sunburn and prolonged unprotected UV exposure',
      'Tanning beds',
    ],
    firstAid: 'Do not delay. Contact a dermatologist or doctor immediately for a full skin check and possible biopsy. Avoid scratching or traumatizing the area.',
    riskLevel: 'Very high',
    urgency: 'See a dermatologist as soon as possible (within days).',
  },

  'Melanocytic Nevi': {
    shortName: 'NV',
    tagline: 'Common moles; usually harmless',
    whatIs: `Melanocytic nevi (moles) are common growths made of melanocytes. Most are benign and stable. Some people have many moles; they can be present at birth or develop over time, especially with sun exposure. It is important to monitor them for changes (ABCDE) because a small proportion can develop into melanoma.`,
    symptoms: [
      'Round or oval; uniform color (tan, brown, or black)',
      'Flat or raised; smooth or slightly bumpy',
      'Usually stable over time',
      'Can appear anywhere on the body',
      'Some moles have hair; that is normal',
    ],
    whatItCouldLeadTo: [
      'Most remain benign',
      'A small number can evolve into melanoma—hence the need for monitoring',
      'Cosmetic or occasional irritation',
    ],
    precautions: [
      'Sun protection to limit new moles and UV damage',
      'Regular self-checks and professional skin exams',
      'Document or photograph moles to track changes',
    ],
    whatToAvoid: [
      'Ignoring a mole that changes in size, shape, color, or symptoms',
      'Picking or shaving over moles (can cause bleeding or infection)',
    ],
    firstAid: 'No urgent action if stable. If a mole changes (ABCDE), bleeds, or itches, see a dermatologist for evaluation.',
    riskLevel: 'Low (unless changing)',
    urgency: 'Routine monitoring; act quickly if the mole changes.',
  },

  'Vascular Lesions': {
    shortName: 'VASC',
    tagline: 'Blood vessel-related skin marks',
    whatIs: `Vascular lesions include hemangiomas, angiomas, and other benign growths or patches caused by blood vessels. They can be red or purple, flat or raised, and are usually harmless. Some are present at birth; others develop with age (e.g., cherry angiomas). They do not become skin cancer.`,
    symptoms: [
      'Red or purple spots or bumps',
      'Flat (e.g., port-wine stain) or raised (e.g., cherry angioma)',
      'May blanch when pressed',
      'Can appear on face, trunk, or limbs',
      'Usually painless; some may bleed if injured',
    ],
    whatItCouldLeadTo: [
      'No cancer risk',
      'Rare bleeding if traumatized',
      'Cosmetic concern for some',
    ],
    precautions: [
      'Protect from injury if prone to bleeding',
      'Sun protection for exposed areas',
    ],
    whatToAvoid: [
      'Picking or cutting the lesion',
      'Aggressive scrubbing or trauma',
    ],
    firstAid: 'If it bleeds, apply gentle pressure with a clean cloth. If it does not stop or looks infected, see a doctor. Otherwise, no urgent action needed.',
    riskLevel: 'Low',
    urgency: 'Routine; seek care if it bleeds repeatedly or changes.',
  },
};
