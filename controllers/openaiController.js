const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const generateAnswer = async (req, res) => {
    const { question } = req.body
  try {
    let prompt = `Here is a question about Rishit's resume: "${question}" Focus on the specific project/experience and provide a short summary. Here is the relevant excerpt from the resume:
    
    
    Rishit Das
    +1-530-220-5110 | rdas@ucdavis.edu | https://www.linkedin.com/in/rishitdas/ | https://github.com/ppinkfreudd

    EDUCATION
    University of California – Davis                                                                              Davis, CA
    B.S. Cognitive Science (Computational Emphasis) | Graduation: 06/26 | GPA: 3.6
    Relevant courses: Object-Oriented Programming in C++, Cognitive Psychology, Neuroscience, Calculus I-III, Statistics.
    Clubs: Google Developer Student Club, AI Student Club, and Badminton Club.

    PROFESSIONAL EXPERIENCE
    nrture                                                                                                 Melbourne, Australia
    Intern                                                                                                 June 2023 – Sept 2023
    Developed advanced Python scripts for data processing, enhancing efficiency of AI-driven solutions in travel tech.
         ● Led development of a Ruby SSO script to solve Google Looker API integration issues for user access to the platform.
         ● Designed AI chatbot using HTML/CSS, JS, & React, and tweaked BERT model to increase accuracy by 15%.
         ● Executed 200 Jira tickets post extensive user feedback as a part of the product team, supporting platform robustness.

    Integrated Attention Lab                                                             Center for Mind and Brain, UC Davis
    Research Assistant                                                                                        Sept 2023 – Present
    Conducting research using Python in a $370,000 NIMH Virtual Reality, memory, and attention research project.
         ● Improving experimental data processing efficiency by 40% for HP Omnicept VR Headset data pipeline using NumPy,
             Pandas, Seaborn, & Matplotlib, and simultaneously learning Unity and Vizard to contribute to experimental design.
         ● Developing algorithms that score SBSOD, Curiosity Scale, and BAARS measures, saving ~30 hours per week.
         ● Conducting VR experiments for 50 participants resulting in 300+ GB of unique attentional and memory data.

    Kogiito                                                                                                              Remote
    Founder                                                                                                   Nov 2019 – Present
    Led a startup to democratize brain science research to students worldwide and spearheaded frontend development.
         ● Launched 150+ student online research platform where students can form research groups based on similar interests.
         ● Oversaw 7 research groups to showcase work at 3 global cognitive science conferences, fostering interest in the field.
         ● Recruited 5 advisors from Harvard Medical School, University of Michigan, and Stanford to support the community.

    PROJECTS
    Rhythmoji: an avatar based on your Spotify listening                   University of California, Davis | Sep 2023 – Present
    Engineered a web app using Spotify data to generate personalized avatars through an innovative mapping technique that links
    Spotify genres to broad genres and clothing styles. Integrated APIs, implemented OAuth authentication, and engineered a
    robust Flask backend. GitHub | Tools: Flask, Spotipy API, Python, HTML/CSS/JavaScript, and OAuth 2.0.

    Machine Learning on Neural Correlates of Schizophrenia                                  Keshavan Lab | Aug 2021 – Sep 2022
    Analyzed neuroimaging data from 59 schizophrenia patients at McLean Hospital, MA, revealing an inverse relationship
    between the lateral ventricles and corpus callosum volumes. Developed a linear regression model with LASSO regularization,
    validated through k-fold cross-validation, and produced data visualizations. Presented at Harvard Undergraduate Research
    Opportunities in Science Fair (HUROS) 2021 with Dr. Elisabetta del Re. Presentation | Tools: Python, R, and Alteryx

    The Relationship Between Subliminal Stimuli and Emotion                                         Kogiito | Jun 2020 -Sep 2020
    Identified the relationship between subliminal stimuli and emotion by utilizing eye-tracking, NLTK, and reigning theories of
    emotion (Cannon-Bard, James-Lange, Schachter-Singer) to build more accurate predictions of emotions in real-life conditions.
    Presented at The Science of Consciousness Conference (TSC 2020), the largest consciousness science research conference.
    Presentation | Abstract | Tools: Python, Pandas, TextBlob, NLTK, and Eye-tracking

    ADDITIONAL
    RECOGNITION:
       - Amy Lee Memorial Essay Prize for “The Decomposition of the Narratological Framework in Pedro Páramo”, an
          annual accolade for outstanding COM 1-4 students, celebrating Amy Lee's legacy in Comparative Literature at UCD.
       - Finalist in EBSA Spring Quarter ‘23 Case Competition with River City Bank.

    JOBS: Mail Clerk at UCD’s Orchard Park Apartments (10 hours/week), Tutor for Redwood SEED Scholars (5 hours/week).
    LANGUAGES: English, Hindi, and Odiya. INTERESTS: Hiking, Cool blogs, Coffee, Effective Altruism, and Tame Impala
    ` 
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'user', 
          content: prompt // Content variable is now properly used here
        }
      ],
    });
    res.status(200).json({
        response: response.choices[0].message.content
      });
    
  } catch (error) {
    console.error("Error generating response from OpenAI:", error);
    res.status(500).json({
        message: "Error generating response from OpenAI",
        error: error.message,
      });
  }

};


module.exports = { generateAnswer };