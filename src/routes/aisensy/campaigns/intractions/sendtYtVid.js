import axios from "axios";

const videoContentByDay = {
    1: {
        title: "Knee Pain Relief Exercises While Sitting | Ghutno Ka Dard Thik Karein",
        pointOne: "🦵 How seated isometric pushes strengthen knee joints without putting strain on the knees.",
        pointTwo: "🩸 How active heel strides and ankle pumps boost circulation and relieve stiffness from sitting.",
        videoUrl: "https://www.youtube.com/watch?v=B24YoHyHY8s",
        media: {
            url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/1139172_kneepain.jpg",
            filename: "knee_pain.jpg"
        }
    },
    2: {
        title: "10 Mins Routine to Get Glowing & Sharp Face",
        pointOne: "✨ How targeted face yoga massage activates 40+ facial muscles to boost blood flow and natural glow.",
        pointTwo: "💆 How jawline and cheekbone activation drains lymphatic fluid to reduce puffiness and double chin.",
        videoUrl: "https://www.youtube.com/watch?v=gcnu1b5sQ9E",
        media: {
            url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/1289604_glowingskin.jpg",
            filename: "glowing_skin.jpg"
        }
    },
    3: {
        title: "10 Anti Aging Exercises for Parents | Reverse Your Age",
        pointOne: "⏳ How combining upper and lower body movements slows biological aging and preserves muscle density.",
        pointTwo: "🧘 How dynamic balance and joint opening routines improve overall body mobility and daily energy.",
        videoUrl: "https://www.youtube.com/watch?v=-Fa4JuK9X9k",
        media: {
            url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9920226_antiageing.jpg",
            filename: "anti_ageing.jpg"
        }
    },
    4: {
        title: "Do This For Strong Core & Flat Stomach – Core Aur Stomach Ke Liye",
        pointOne: "🔥 How deep core activation through glute bridges and crunches targets visceral belly fat safely.",
        pointTwo: "🛡️ How building core stability protects your lower back from injury while shaping a flatter stomach.",
        videoUrl: "https://www.youtube.com/watch?v=hNsi2zCCxp8",
        media: {
            url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/1347752_corestreangthvid.jpg",
            filename: "core_streangth_vid.jpg"
        }
    },
    5: {
        title: "Why You Can't Lose Belly Fat (The Real Reason) & How To Lose It",
        pointOne: "🚨How high cortisol from stress signals your body to store belly fat.",
        pointTwo: "🏃How combine strength training with cardio to engage core muscles",
        videoUrl: "https://www.youtube.com/watch?v=QXdvWhi1GE8",
        media: {
            url: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9990913_12.jpg.jpeg",
            filename: "12.jpg.jpeg"
        }
    }
};

const getVideoContent = (dayNumber) => {
    const day = Number(dayNumber);
    return videoContentByDay[day] || videoContentByDay[1];
};

export const sendYtVid = async ({
    whatsappPhone,
    name,
    dayNumber,
    todayDate,
    session_startdate,
    daysaleft
}) => {

    const startDateText = session_startdate || "your upcoming Monday";
    const daysLeftText = Number.isFinite(daysaleft)
        ? `${daysaleft} day${daysaleft === 1 ? "" : "s"}`
        : "a few days";
    const videoContent = getVideoContent(dayNumber);

    const payload = {
        apiKey: process.env.AISENSY_API_KEY,
        campaignName: "send_vid_img",
        destination: whatsappPhone,
        userName: "Thrive Integrated Lifestyle Private Limited",

        templateParams: [
            `${name} 👋`,
            `Your thrive yoga starts in ${daysLeftText} (${startDateText}). Watch this informative video that helps you better understanding of healthy lifestyle`,
            videoContent.title,
            videoContent.pointOne,
            videoContent.pointTwo,
            videoContent.videoUrl
        ],
        source: "new-landing-page form",
        media: videoContent.media,
        buttons: [],
        carouselCards: [],
        location: {},
        attributes: {},

        paramsFallbackValue: {
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
}
