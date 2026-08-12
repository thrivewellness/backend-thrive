import axios from "axios";

const sendAisensyCampaign = async ({
  whatsappPhone,
  name,
  dayNumber,
  testimonialConfig,
}) => {
  
      const payload = {
    apiKey: process.env.AISENSY_API_KEY,
    campaignName: "send_vid_img",
    destination: whatsappPhone,
    userName: "Thrive Integrated Lifestyle Private Limited",

    templateParams: [
      `${name} 👋`,
      testimonialConfig.title,
      testimonialConfig.result,
      testimonialConfig.description1,
      testimonialConfig.description2,
      testimonialConfig.link,
    ],

    source: "new-landing-page form",

    media: {
      url: testimonialConfig.mediaUrl,
      filename: testimonialConfig.mediaFilename,
    },

    buttons: [],
    carouselCards: [],
    location: {},
    attributes: {},
    paramsFallbackValue: {},
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


// Days 1-4
const testimonials = {
  1: {
    title: "💚 Meet our Thrive Hero, Archana Bhimasen",
    result: "*She Lost 14 Kgs at Age 48*💪",
    description1:
      "✨How she transformed her body after 40 with simple lifestyle changes.",
    description2:
      "✨The habits that helped her reduce weight and inflammation naturally.🌿",
    link: "https://www.youtube.com/watch?v=XX6Cc4vHPZQ",
    mediaUrl:
      "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9076501_archanaytvid.jpg",
    mediaFilename: "archanaytvid.jpg",
  },

  2: {
    title: "💚 Video for Today",
    result: "Scientific Ways To Lower Cholesterol Naturally",
    description1:
      "🥑How cholesterol balance relies on your liver and habits, not oil!",
    description2:
      "🥣How soluble fiber in oats traps excess cholesterol to flush it out.",
    link: "https://www.youtube.com/watch?v=dwbshV_rJYA",
    mediaUrl: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/2744013_cholesterol%20vid.jpg",
    mediaFilename: "cholesterol _vid.jpg",
  },
  
  3: {
    title: "💚 Meet our Thrive Hero, Ragini Mathur",
    result: "She Lost 9.5 Kgs at Age 60 + Managed Prediabetes💪",
    description1:
      "✨How she improved her health despite age and hormonal challenges.",
    description2:
      "✨The lifestyle changes that helped her control weight and metabolism.",
    link: "https://www.instagram.com/reels/DYzfhkABIqx/",
    mediaUrl: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/1200085_testimonial1.jpeg",
    mediaFilename: "testimonial_1.jpeg",
  },

  4: {
    title: "💚 Video for Today",
    result: "Orthopaedic Doctor Shared Tips To Prevent Knee Replacement 💪",
    description1:
      "🦵 How knee pain is a joint breakdown, not just aging catching up!",
    description2:
      "🏋️ How strong quadriceps absorb joint shock and protect cartilage.",
    link: "https://www.youtube.com/watch?v=WS-SMCJ9N9w",
    mediaUrl: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/7094137_preventknee.jpg",
    mediaFilename: "preventknee.jpg",
  },
};


// Days 8-10
const newTestimonials = {
  8: {
    title: "💚 Meet our Thrive Hero, Silky Chauhan",
    result: "*She Lost 10 Kgs at Age 45 + Reduced Inflammation & Body Pain.*💪",
    description1:
      "✨How she reduced weight, inflammation, and daily body pain.",
    description2:
      "✨How small changes that created a big transformation in her health.🌿",
    link: "https://www.instagram.com/reels/DU0f2iekaGM/",
    mediaUrl:
      "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/6788923_testimoals2.jpeg",
    mediaFilename: "testimoals_2.jpeg",
  },

  9: {
    title: "💚 Meet our Thrive Hero, kantha Rathi",
    result: "She Reversed Years of Knee Pain and Got Her Thyroid Under Control💪",
    description1:
      "✨How she lost 11 kgs without giving up her daily routine or extreme dieting",
    description2:
      "✨How she regained the strength to climb stairs and move freely without pain.",
    link: "https://www.instagram.com/reels/DZFiNlYhfFE/",
    mediaUrl: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9520352_kanthitestimonail.jpg",
    mediaFilename: "kanthi_testimonail.jpg",
  },

  10: {
    title: "💚 Meet our Thrive Hero, Shanta Venkatraman",
    result: "She Improved Her Strength & Sugar Levels at the Age of 80. 💪",
    description1:
      "✨How consistent strength training improved her strength and independence.",
    description2:
      "✨How regular exercise helped support healthier sugar levels over time.🌿",
    link: "https://www.instagram.com/reels/DZfZO_iR7KJ/",
    mediaUrl: "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/696b61f2951b730d7655fef4/9399044_testimonials.png",
    mediaFilename: "testimonials.png",
  },
};

// Main functions
export const sendInstTestimonails = async ({
  whatsappPhone,
  name,
  dayNumber,
}) => {
  const testimonialConfig = testimonials[dayNumber];

  if (!testimonialConfig) {
    throw new Error(
      `Invalid dayNumber ${dayNumber}. sendInstTestimonails supports days 1-4.`
    );
  }

  return sendAisensyCampaign({
    whatsappPhone,
    name,
    dayNumber,
    testimonialConfig,
  });
};


export const sendInstTestimonailsnew = async ({
  whatsappPhone,
  name,
  dayNumber,
}) => {
  const testimonialConfig = newTestimonials[dayNumber];

  if (!testimonialConfig) {
    throw new Error(
      `Invalid dayNumber ${dayNumber}. sendInstTestimonailsnew supports days 8-10.`
    );
  }

  return sendAisensyCampaign({
    whatsappPhone,
    name,
    dayNumber,
    testimonialConfig,
  });
};