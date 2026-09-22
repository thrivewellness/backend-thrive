import axios from "axios";

export const coachLeadRemainder = async ({
    id,
    whatsappPhone,

    // Common
    name,
    phnumber,
    ageGroup,
    height,
    weight,
    created_at,
    goal,

    // Weight Loss
    targetWeightLoss,
    weightLossObstacle,
    whyLoseWeight,

    // Medical Condition
    medicalConditions,
    medicationStatus,

    // Menopause
    menopauseStage,
    menopauseSymptoms,

    // Common
    symptoms,
    duration,
    readiness,
    openToInvest,
    invest,
    callTime,

    ref
}) => {

    console.log("coachLeadRemainder called with:", {
        id,
        whatsappPhone,
        name,
        height,
        weight,
        callTime

    });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "caoch_lead_notify_new_xhixo",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            name,                   // {{1}}
            phnumber,               // {{2}}
            ageGroup,       // {{3}}
            height,       //{{4}}
            weight,       // {{5}}
            created_at,             // {{6}}

            goal,                   // {{7}}

            targetWeightLoss,       // {{8}}
            weightLossObstacle,     // {{9}}
            whyLoseWeight,          // {{10}}

            medicalConditions,      // {{11}}
            medicationStatus,       // {{12}}

            menopauseStage,         // {{13}}
            menopauseSymptoms,      // {{14}}

            symptoms,               // {{15}}
            duration,               // {{16}}
            readiness,              // {{17}}

            openToInvest,           // {{18}}
            invest,                 // {{19}}

            callTime,             // {{20}} 

            ref,                    // {{21}}

            `https://admin.thrivewellness.in/leads/update?id=${id}` // {{22}}
        ],

        source: "new-landing-page form",
        media: {},
        buttons: [
            {
                "type": "button",
                "sub_type": "URL",
                "index": 0,
                "parameters": [
                    {
                        "type": "text",
                        "text": `leads/update?id=${id}`
                    }
                ]
            }
        ],
        carouselCards: [],
        location: {},
        attributes: {},

        paramsFallbackValue: {
            FirstName: "user"
        }
    };

    const response = await axios.post(
        "https://backend.aisensy.com/campaign/t1/api/v2",
        payload,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};