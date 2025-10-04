// Mock data for Aparna's Diwali Delights
export const menuCategories = [
  {
    id: 'chivda',
    name: 'Chivda Collection',
    description: 'Crispy and flavorful traditional snacks perfect for Diwali celebrations',
    icon: '🥜',
    items: [
      {
        id: 'poha-chivda',
        name: 'Poha Chivda',
        description: 'Traditional flattened rice mixture with spices and peanuts',
        price: 600,
        unit: 'per kg',
        images: [
          'https://images.unsplash.com/photo-1633975573517-653b02dcae4f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzbmFjayUyMG1peHxlbnwwfHx8fDE3NTk1ODA4MTJ8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1575526854473-e85fdba07b7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBzbmFjayUyMG1peHxlbnwwfHx8fDE3NTk1ODA4MTJ8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1589786742305-f24d19eedbe5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzbmFja3N8ZW58MHx8fHwxNzU5NTgwOTA2fDA&ixlib=rb-4.1.0&q=85'
        ]
      },
      {
        id: 'corn-chivda-plain',
        name: 'Corn Chivda - Plain',
        description: 'Crunchy corn flakes seasoned with aromatic spices',
        price: 650,
        unit: 'per kg',
        images: [
          'https://images.unsplash.com/photo-1575526854473-e85fdba07b7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBzbmFjayUyMG1peHxlbnwwfHx8fDE3NTk1ODA4MTJ8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1589556165541-4254aa9cfb39?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBzbmFjayUyMG1peHxlbnwwfHx8fDE3NTk1ODA4MTJ8MA&ixlib=rb-4.1.0&q=85',
          'https://images.pexels.com/photos/5835026/pexels-photo-5835026.jpeg'
        ]
      },
      {
        id: 'corn-chivda-dry-fruits',
        name: 'Corn Chivda - With Dry Fruits',
        description: 'Premium corn chivda enriched with almonds, cashews and raisins',
        price: 750,
        unit: 'per kg',
        images: [
          'https://images.unsplash.com/photo-1633975573517-653b02dcae4f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzbmFjayUyMG1peHxlbnwwfHx8fDE3NTk1ODA4MTJ8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1589786742305-f24d19eedbe5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzbmFja3N8ZW58MHx8fHwxNzU5NTgwOTA2fDA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1613764816537-a43baeb559c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBzbmFja3N8ZW58MHx8fHwxNzU5NTgwOTA2fDA&ixlib=rb-4.1.0&q=85'
        ]
      },
      {
        id: 'farali-chivda',
        name: 'Farali Chivda',
        description: 'Special fasting-friendly mixture with sabudana and peanuts',
        price: 760,
        unit: 'per kg',
        images: [
          'https://images.unsplash.com/photo-1627035537702-ddca174d7987?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxzYWJ1ZGFuYXxlbnwwfHx8fDE3NTk1ODA4Mjl8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1627035537727-96e5d592bbb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxzYWJ1ZGFuYXxlbnwwfHx8fDE3NTk1ODA4Mjl8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1603554593710-89285666b691?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHxzYWJ1ZGFuYXxlbnwwfHx8fDE3NTk1ODA4Mjl8MA&ixlib=rb-4.1.0&q=85'
        ]
      },
      {
        id: 'makhana-chivda-masala',
        name: 'Makhana Chivda - Masala',
        description: 'Roasted lotus seeds with aromatic spices and herbs',
        price: 1600,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
      },
      {
        id: 'makhana-chivda-dry-fruits',
        name: 'Makhana Chivda - Masala & Dry Fruits',
        description: 'Premium makhana with masala spices and assorted dry fruits',
        price: 1850,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop'
      },
      {
        id: 'kurmura-chivda',
        name: 'Kurmura Chivda',
        description: 'Light and crispy puffed rice mixture with curry leaves',
        price: 500,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop'
      },
      {
        id: 'fried-poha-chivda',
        name: 'Fried Poha Chivda',
        description: 'Perfectly fried flattened rice with onions and spices',
        price: 550,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
      }
    ]
  },
  {
    id: 'chakli',
    name: 'Chakli Varieties',
    description: 'Spiral-shaped crispy delights made from different grains',
    icon: '🌀',
    items: [
      {
        id: 'rice-chakli',
        name: 'Rice Chakli',
        description: 'Classic spiral-shaped snack made from rice flour and spices',
        price: 625,
        unit: 'per kg',
        images: [
          'https://images.pexels.com/photos/9832636/pexels-photo-9832636.jpeg',
          'https://images.pexels.com/photos/5992272/pexels-photo-5992272.jpeg',
          'https://images.unsplash.com/photo-1621245725986-d794ddc5da5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjaGFrbGklMjBzcGlyYWx8ZW58MHx8fHwxNzU5NTgwODE2fDA&ixlib=rb-4.1.0&q=85'
        ]
      },
      {
        id: 'bhajni-chakli',
        name: 'Bhajni Chakli',
        description: 'Traditional Maharashtrian chakli with mixed lentil flour',
        price: 700,
        unit: 'per kg',
        images: [
          'https://images.pexels.com/photos/5992272/pexels-photo-5992272.jpeg',
          'https://images.pexels.com/photos/9832636/pexels-photo-9832636.jpeg',
          'https://images.pexels.com/photos/9832685/pexels-photo-9832685.jpeg'
        ]
      },
      {
        id: 'jowari-chakli',
        name: 'Jowari Chakli',
        description: 'Healthy chakli made from sorghum flour with authentic taste',
        price: 650,
        unit: 'per kg',
        images: [
          'https://images.unsplash.com/photo-1621245725986-d794ddc5da5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjaGFrbGklMjBzcGlyYWx8ZW58MHx8fHwxNzU5NTgwODE2fDA&ixlib=rb-4.1.0&q=85',
          'https://images.pexels.com/photos/9832636/pexels-photo-9832636.jpeg',
          'https://images.pexels.com/photos/5992272/pexels-photo-5992272.jpeg'
        ]
      }
    ]
  },
  {
    id: 'savory',
    name: 'Savory Delights',
    description: 'Assorted crispy and flavorful traditional snacks',
    icon: '🥨',
    items: [
      {
        id: 'farsi-puri',
        name: 'Farsi Puri',
        description: 'Delicate and crispy deep-fried bread perfect for snacking',
        price: 550,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'ribbon-pakoda',
        name: 'Ribbon Pakoda',
        description: 'Crunchy ribbon-shaped fritters with aromatic spices',
        price: 525,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'thika-sev',
        name: 'Thika Sev',
        description: 'Fine and crispy gram flour noodles with perfect seasoning',
        price: 540,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'mathri',
        name: 'Mathri',
        description: 'Flaky and crispy traditional biscuits with ajwain',
        price: 650,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'thika-shankarpala',
        name: 'Thika Shankarpala',
        description: 'Diamond-shaped crispy snacks with subtle spice blend',
        price: 625,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'sweet-shankarpala',
        name: 'Sweet Shankarpala',
        description: 'Sweet version of traditional shankarpala with jaggery',
        price: 675,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      }
    ]
  },
  {
    id: 'sweets',
    name: 'Festival Sweets',
    description: 'Traditional sweets to make your Diwali celebrations memorable',
    icon: '🍰',
    items: [
      {
        id: 'gujjia',
        name: 'Gujjia',
        description: 'Crescent-shaped pastry filled with khoya and dry fruits',
        price: 35,
        unit: 'per piece',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      },
      {
        id: 'karanji',
        name: 'Saada Karanji',
        description: 'Traditional Maharashtrian sweet dumpling with coconut filling',
        price: 28,
        unit: 'per piece',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      }
    ]
  },
  {
    id: 'laddus',
    name: 'Laddu Collection',
    description: 'Round balls of sweetness in various flavors',
    icon: '⚫',
    items: [
      {
        id: 'besan-laddu',
        name: 'Besan Laddu',
        description: 'Classic gram flour laddus with ghee and cardamom',
        price: 1050,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      },
      {
        id: 'rava-besan',
        name: 'Rava-Besan Laddu',
        description: 'Combination of semolina and gram flour in sweet balls',
        price: 800,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      },
      {
        id: 'rava-coconut',
        name: 'Rava-Coconut Laddu',
        description: 'Semolina laddus with fresh coconut and cardamom',
        price: 750,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      },
      {
        id: 'rava-plain',
        name: 'Rava-Plain Laddu',
        description: 'Simple and delicious semolina laddus',
        price: 675,
        unit: 'per kg',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      }
    ]
  }
];

export const shopInfo = {
  name: "Aparna's Diwali Delights",
  tagline: 'Traditional Sweets & Snacks for Your Festival Celebrations',
  description: 'Authentic homemade delicacies crafted with love by Aparna for your Diwali festivities',
  contact: {
    phone: '+91 9920632654',
    email: 'aparna.delights@gmail.com',
    address: 'Borivali (W), Mumbai, Maharashtra',
    fssai: '21521058000362'
  }
};

export const greetingMessages = {
  parents: [
    "May this Diwali bring endless joy, prosperity, and happiness to our beloved parents. Your love lights up our lives just like these beautiful diyas. Happy Diwali!",
    "Wishing you both a Diwali filled with sweet moments, bright lights, and the warmth of family love. Thank you for being our guiding light. Happy Diwali!",
    "May Goddess Lakshmi bless you with health, wealth, and all the happiness in the world. Your blessings are our greatest treasure. Happy Diwali!"
  ],
  friends: [
    "Friendship like ours shines brighter than any Diwali light! Wishing you a festival full of laughter, sweets, and amazing memories. Happy Diwali!",
    "May this Diwali sparkle with joy and shine with happiness for you and your family. Thanks for being such an amazing friend! Happy Diwali!",
    "Let's celebrate this Diwali with the same enthusiasm we bring to our friendship - full of light, laughter, and lots of sweets! Happy Diwali!"
  ],
  colleagues: [
    "Wishing you and your family a very Happy Diwali! May this festival of lights bring new opportunities, success, and prosperity in your career and life.",
    "May the light of Diwali illuminate your path to success and happiness. Looking forward to another year of great teamwork! Happy Diwali!",
    "Celebrating the festival of lights with wonderful colleagues like you makes it even more special. Wishing you prosperity and joy! Happy Diwali!"
  ],
  sister: [
    "To my wonderful sister, may this Diwali bring you all the happiness, success, and sweet moments you deserve. You light up our family! Happy Diwali!",
    "Having a sister like you is like having a permanent Diwali in life - full of light, joy, and sweetness. Wishing you the happiest Diwali!",
    "May Goddess Lakshmi shower you with her choicest blessings, dear sister. Your smile is brighter than any Diwali light! Happy Diwali!"
  ],
  brother: [
    "To my amazing brother, may this Diwali bring you success, happiness, and all your heart's desires. Thanks for always being my protector! Happy Diwali!",
    "Brothers like you make every festival special! Wishing you a Diwali filled with prosperity, joy, and lots of delicious sweets. Happy Diwali!",
    "May the festival of lights illuminate your life with endless happiness and success, dear brother. You're the best! Happy Diwali!"
  ],
  uncle: [
    "Wishing my wonderful uncle a very Happy Diwali! May this festival bring you good health, prosperity, and happiness. Your guidance means the world to us.",
    "May the divine light of Diwali spread peace, prosperity, and happiness in your life, dear uncle. Thank you for all your love and support! Happy Diwali!",
    "Celebrating Diwali with family is incomplete without your presence, uncle. Wishing you and aunty a festival full of joy and blessings! Happy Diwali!"
  ],
  aunty: [
    "To my lovely aunty, may this Diwali fill your home with happiness, your heart with joy, and your life with prosperity. You're simply wonderful! Happy Diwali!",
    "Wishing my dear aunty a Diwali as sweet as the sweets you make and as bright as your beautiful smile. May all your dreams come true! Happy Diwali!",
    "Your love and care make every festival special, dear aunty. May Goddess Lakshmi bless you with health, wealth, and happiness. Happy Diwali!"
  ]
};

export const relationshipTypes = [
  { id: 'parents', name: 'Parents', icon: '👨‍👩‍👧‍👦' },
  { id: 'friends', name: 'Friends', icon: '👫' },
  { id: 'colleagues', name: 'Colleagues', icon: '💼' },
  { id: 'sister', name: 'Sister', icon: '👭' },
  { id: 'brother', name: 'Brother', icon: '👬' },
  { id: 'uncle', name: 'Uncle', icon: '👨' },
  { id: 'aunty', name: 'Aunty', icon: '👩' }
];