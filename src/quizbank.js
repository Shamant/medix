const quizBank = [
    {
      issue: 'Inflammation',
      questions: [
        { id: 1, text: 'Do you experience frequent joint pain or stiffness?', options: ['Yes', 'No'] },
        { id: 2, text: 'Do you often feel fatigued even after a full night\'s sleep?', options: ['Yes', 'No'] },
        { id: 3, text: 'Have you been diagnosed with any inflammatory conditions (e.g. arthritis, lupus, chronic fatigue syndrome)?', options: ['Yes', 'No'] },
        { id: 4, text: 'Do you have any skin conditions such as eczema or psoriasis?', options: ['Yes', 'No'] },
        { id: 5, text: 'Do you regularly consume anti-inflammatory foods such as omega-3 rich fish, nuts, and leafy greens?', options: ['Yes', 'No'] },
        { id: 6, text: 'Do you take any medications or supplements for inflammation?', options: ['Yes', 'No'] },
        { id: 7, text: 'Do you experience frequent headaches or migraines?', options: ['Yes', 'No'] },
        { id: 8, text: 'Do you often have symptoms of allergies or asthma?', options: ['Yes', 'No'] },
        { id: 9, text: 'Do you have a family history of inflammatory diseases?', options: ['Yes', 'No'] },
        { id: 10, text: 'Do you notice swelling in your hands, feet, or face?', options: ['Yes', 'No'] },
      ],
    },
    {
      issue: 'Insulin Resistance',
      questions: [
        { id: 1, text: 'Have you been diagnosed with prediabetes or type 2 diabetes?', options: ['Yes', 'No'] },
        { id: 2, text: 'Do you often crave sugary foods or drinks?', options: ['Yes', 'No'] },
        { id: 3, text: 'Do you experience a mid-afternoon energy slump?', options: ['Yes', 'No'] },
        { id: 4, text: 'Do you have difficulty losing weight, especially around your abdomen?', options: ['Yes', 'No'] },
        { id: 5, text: 'Do you often feel thirsty or have dry mouth?', options: ['Yes', 'No'] },
        { id: 6, text: 'Do you experience frequent urination, especially at night?', options: ['Yes', 'No'] },
        { id: 7, text: 'Do you have a family history of diabetes or metabolic syndrome?', options: ['Yes', 'No'] },
        { id: 8, text: 'Do you monitor your blood glucose levels regularly?', options: ['Yes', 'No'] },
        { id: 9, text: 'Have you noticed darkened skin patches, especially around the neck or armpits?', options: ['Yes', 'No'] },
        { id: 10, text: 'Do you engage in regular physical activity (at least 150 minutes per week)?', options: ['Yes', 'No'] },
      ],
    },
    {
      issue: 'Hormones',
      questions: [
        { id: 1, text: 'Have you experienced any changes in your menstrual cycle (for females) or libido (for males)?', options: ['Yes', 'No'] },
        { id: 2, text: 'Do you suffer from frequent mood swings or irritability?', options: ['Yes', 'No'] },
        { id: 3, text: 'Have you been diagnosed with any thyroid disorders?', options: ['Yes', 'No'] },
        { id: 4, text: 'Do you often feel cold when others do not or do you have cold hands and feet?', options: ['Yes', 'No'] },
        { id: 5, text: 'Do you experience unexplained weight gain or difficulty losing weight?', options: ['Yes', 'No'] },
        { id: 6, text: 'Do you suffer from sleep disturbances such as insomnia or waking up frequently?', options: ['Yes', 'No'] },
        { id: 7, text: 'Do you have excessive hair loss or hair growth in unusual areas?', options: ['Yes', 'No'] },
        { id: 8, text: 'Do you experience frequent hot flashes or night sweats?', options: ['Yes', 'No'] },
        { id: 9, text: 'Have you noticed any changes in your skin texture or the appearance of acne?', options: ['Yes', 'No'] },
        { id: 10, text: 'Do you take any hormone replacement therapies or supplements?', options: ['Yes', 'No'] },
      ],
    },
    {
      issue: 'Toxins',
      questions: [
        { id: 1, text: 'Do you frequently use products containing artificial ingredients such as processed foods, cleaning supplies, or personal care items?', options: ['Yes', 'No'] },
        { id: 2, text: 'Are you regularly exposed to environmental toxins such as pollution, pesticides, or heavy metals?', options: ['Yes', 'No'] },
        { id: 3, text: 'Do you use tobacco or have you been exposed to second-hand smoke?', options: ['Yes', 'No'] },
        { id: 4, text: 'Do you consume alcohol regularly?', options: ['Yes', 'No'] },
        { id: 5, text: 'Do you use any recreational drugs or substances?', options: ['Yes', 'No'] },
        { id: 6, text: 'Do you drink water from a filtered source?', options: ['Yes', 'No'] },
        { id: 7, text: 'Have you had any recent exposure to mold, lead, or asbestos?', options: ['Yes', 'No'] },
        { id: 8, text: 'Do you take any medications that might stress your liver or kidneys?', options: ['Yes', 'No'] },
        { id: 9, text: 'Do you follow a detoxification routine or take supplements aimed at detoxifying your body?', options: ['Yes', 'No'] },
        { id: 10, text: 'Do you have a family history of cancer or other toxin-related diseases?', options: ['Yes', 'No'] },
      ],
    },
    {
      issue: 'Gut Health',
      questions: [
        { id: 1, text: 'Do you experience frequent digestive discomfort such as bloating, gas, or constipation?', options: ['Yes', 'No'] },
        { id: 2, text: 'Have you been diagnosed with any gastrointestinal conditions such as IBS, Crohn\'s, or celiac disease?', options: ['Yes', 'No'] },
        { id: 3, text: 'Do you regularly consume fermented foods or take probiotics?', options: ['Yes', 'No'] },
        { id: 4, text: 'Do you have any food allergies or intolerances?', options: ['Yes', 'No'] },
        { id: 5, text: 'Do you take any medications that may affect your gut health such as antibiotics or NSAIDs?', options: ['Yes', 'No'] },
        { id: 6, text: 'Do you often experience heartburn or acid reflux?', options: ['Yes', 'No'] },
        { id: 7, text: 'Do you follow a diet high in fiber (fruits, vegetables, whole grains)?', options: ['Yes', 'No'] },
        { id: 8, text: 'Have you had any recent changes in your bowel habits (e.g., frequency, consistency)?', options: ['Yes', 'No'] },
        { id: 9, text: 'Do you drink at least 8 glasses of water daily?', options: ['Yes', 'No'] },
        { id: 10, text: 'Do you often feel stressed or anxious, which affects your digestion?', options: ['Yes', 'No'] },
      ],
    },
  ];
  
  export default quizBank;
  