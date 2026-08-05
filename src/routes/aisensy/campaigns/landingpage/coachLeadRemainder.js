import axios from "axios";

export const coachLeadRemainder = async ({
    id,
    whatsappPhone,

    // Common
    name,
    phnumber,
    ageGroup,
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

    ref
}) => {

    console.log("coachLeadRemainder called with:", {
        id,
        whatsappPhone,
        name
    });

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "caoch_lead_notify_new",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            name,                   // {{1}}
            phnumber,               // {{2}}
            ageGroup,               // {{3}}
            created_at,             // {{4}}

            goal,                   // {{5}}

            targetWeightLoss,       // {{6}}
            weightLossObstacle,     // {{7}}
            whyLoseWeight,          // {{8}}

            medicalConditions,      // {{9}}
            medicationStatus,       // {{10}}

            menopauseStage,         // {{11}}
            menopauseSymptoms,      // {{12}}

            symptoms,               // {{13}}
            duration,               // {{14}}
            readiness,              // {{15}}

            openToInvest,           // {{16}}
            invest,                 // {{17}}

            ref,                    // {{18}}

            `https://admin.thrivewellness.in/leads/update?id=${id}` // {{19}}
        ],

        source: "new-landing-page form",
        media: {},
        buttons: [],
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