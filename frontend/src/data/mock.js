// Mock data for Aparna's Diwali Delights
export const menuCategories = [
  {
    id: 'chivda',
    name: 'Chivda Collection',
    description: 'Crispy and flavorful traditional snacks perfect for Diwali celebrations',
    items: [
      {
        id: 'poha-chivda',
        name: 'Poha Chivda',
        description: 'Traditional flattened rice mixture with spices and peanuts',
        price: 600,
        unit: 'per kg',
        rating: 4.4,
        totalReviews: 18,
        reviews: [
          {
            id: 1,
            customerName: 'Rohit K.',
            rating: 5,
            comment: 'Excellent poha chivda! Last year we ordered for Diwali and it was so good. The perfect blend of spices and fresh ingredients.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Neeta P.',
            rating: 4,
            comment: 'Very good quality. Ordered during last Diwali season and everyone loved it. Will definitely order again this year.',
            date: '2025-10-02'
          },
          {
            id: 3,
            customerName: 'Amit G.',
            rating: 4,
            comment: 'Fresh and crunchy. Reminds me of homemade poha chivda. Good for gifting during festivals.',
            date: '2025-10-03'
          },
          {
            id: 4,
            customerName: 'Sushma R.',
            rating: 5,
            comment: 'Amazing taste! We had ordered last year for Diwali celebrations and it was perfect. Highly recommend.',
            date: '2025-10-04'
          }
        ],
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
        rating: 4.2,
        totalReviews: 22,
        reviews: [
          {
            id: 1,
            customerName: 'Kiran M.',
            rating: 4,
            comment: 'Good corn chivda. We ordered last Diwali and kids loved it. Crunchy and well-spiced.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Varun S.',
            rating: 5,
            comment: 'Perfect for snacking during festivals. Had ordered last year and it was fresh and tasty.',
            date: '2025-10-03'
          },
          {
            id: 3,
            customerName: 'Sunanda T.',
            rating: 4,
            comment: 'Nice corn chivda. Good for Diwali gifting. Packaging was also good last time.',
            date: '2025-10-05'
          }
        ],
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
        rating: 4.6,
        totalReviews: 27,
        reviews: [
          {
            id: 1,
            customerName: 'Preeti J.',
            rating: 5,
            comment: 'Premium quality! The dry fruits make it special. Ordered last Diwali and it was excellent for gifting.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Manoj D.',
            rating: 4,
            comment: 'Good mix of corn and dry fruits. Last year we got this for relatives and they loved it.',
            date: '2025-10-04'
          },
          {
            id: 3,
            customerName: 'Rashmi V.',
            rating: 5,
            comment: 'Worth the price! Cashews and almonds are fresh. Best corn chivda I have tasted.',
            date: '2025-10-01'
          },
          {
            id: 4,
            customerName: 'Deepak B.',
            rating: 4,
            comment: 'Very good quality. Ordered during last Diwali season and quality was consistent.',
            date: '2025-10-02'
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1633975573517-653b02dcae4f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzbmFjayUyMG1peHxlbnwwfHx8fDE3NTk1ODA4MTJ8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1589786742305-f24d19eedbe5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzbmFja3N8ZW58MHx8fHwxNzU5NTgwOTA2fDA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1613764816537-a43baeb559c1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBzbmFja3N8ZW58MHx8fHwxNzU5NTgwOTA2fDA&ixlib=rb-4.1.0&q=85'
        ]
      },
      {
        id: 'sabudana-chivda',
        name: 'Sabudana Chivda',
        description: 'Crispy tapioca pearls with sabudana and peanuts',
        price: 760,
        unit: 'per kg',
        rating: 4.5,
        totalReviews: 23,
        reviews: [
          {
            id: 1,
            customerName: 'Priya S.',
            rating: 5,
            comment: 'Amazing taste! Just like my grandmother used to make. Perfect crunch and flavor. Ordered last Diwali and it was perfect.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Rajesh K.',
            rating: 4,
            comment: 'Good quality sabudana chivda. Fresh and crispy. Will order again this year too.',
            date: '2025-10-03'
          },
          {
            id: 3,
            customerName: 'Anita M.',
            rating: 5,
            comment: 'Excellent product! Great for Diwali celebrations. Family loved it last year.',
            date: '2025-10-05'
          },
          {
            id: 4,
            customerName: 'Mahesh L.',
            rating: 4,
            comment: 'Traditional taste. Good for festivals and gifting. Had ordered during last Diwali.',
            date: '2025-10-03'
          }
        ],
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
        rating: 4.8,
        totalReviews: 15,
        reviews: [
          {
            id: 1,
            customerName: 'Sunita D.',
            rating: 5,
            comment: 'Premium quality makhana! Perfect seasoning and very fresh. Worth the price. Ordered last Diwali.',
            date: '2025-10-03'
          },
          {
            id: 2,
            customerName: 'Vikram P.',
            rating: 5,
            comment: 'Best makhana chivda I have ever tasted. Crispy and flavorful. Will order again this year.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Meera J.',
            rating: 4,
            comment: 'Good quality and taste. Packaging was excellent last year. Recommended!',
            date: '2025-10-04'
          }
        ],
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
      },
      {
        id: 'makhana-chivda-dry-fruits',
        name: 'Makhana Chivda - Masala & Dry Fruits',
        description: 'Premium makhana with masala spices and assorted dry fruits',
        price: 1850,
        unit: 'per kg',
        rating: 4.7,
        totalReviews: 12,
        reviews: [
          {
            id: 1,
            customerName: 'Ravi N.',
            rating: 5,
            comment: 'Excellent premium makhana! The dry fruits add great value. Best for Diwali gifting.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Kavita S.',
            rating: 4,
            comment: 'High quality product. Ordered last Diwali and it was fresh and tasty.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Sandip M.',
            rating: 5,
            comment: 'Worth every rupee! Perfect blend of makhana and dry fruits.',
            date: '2025-10-01'
          }
        ],
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
      },
      {
        id: 'kurmura-chivda',
        name: 'Kurmura Chivda',
        description: 'Light and crispy puffed rice mixture with curry leaves',
        price: 500,
        unit: 'per kg',
        rating: 4.3,
        totalReviews: 19,
        reviews: [
          {
            id: 1,
            customerName: 'Shweta R.',
            rating: 4,
            comment: 'Light and crispy. Good for tea-time snacking. Had ordered last year during festivals.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Ashish K.',
            rating: 5,
            comment: 'Perfect kurmura chivda! Kids love it. Very affordable and tasty.',
            date: '2025-10-04'
          },
          {
            id: 3,
            customerName: 'Nisha P.',
            rating: 4,
            comment: 'Good quality and fresh. Ordered during last Diwali and it was good.',
            date: '2025-10-02'
          }
        ],
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop'
      },
      {
        id: 'fried-poha-chivda',
        name: 'Fried Poha Chivda',
        description: 'Perfectly fried flattened rice with onions and spices',
        price: 550,
        unit: 'per kg',
        rating: 4.4,
        totalReviews: 16,
        reviews: [
          {
            id: 1,
            customerName: 'Ganesh T.',
            rating: 4,
            comment: 'Good fried poha chivda. Different from regular poha chivda. Ordered last Diwali.',
            date: '2025-10-03'
          },
          {
            id: 2,
            customerName: 'Priyanka D.',
            rating: 5,
            comment: 'Crispy and well-fried. Perfect seasoning. Will order again this year.',
            date: '2025-10-06'
          },
          {
            id: 3,
            customerName: 'Sachin B.',
            rating: 4,
            comment: 'Nice taste and texture. Good for Diwali celebrations.',
            date: '2025-10-03'
          }
        ],
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
      }
    ]
  },
  {
    id: 'chakli',
    name: 'Chakli Varieties',
    description: 'Spiral-shaped crispy delights made from different grains',
    items: [
      {
        id: 'rice-chakli',
        name: 'Rice Chakli',
        description: 'Classic spiral-shaped snack made from rice flour and spices',
        price: 625,
        unit: 'per kg',
        rating: 4.3,
        totalReviews: 18,
        reviews: [
          {
            id: 1,
            customerName: 'Kavita R.',
            rating: 4,
            comment: 'Traditional taste and good crunch. Reminds me of homemade chakli. Ordered last Diwali.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Anil S.',
            rating: 5,
            comment: 'Perfectly spiced rice chakli. Great for tea time snacking. Had this last year.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Deepa T.',
            rating: 4,
            comment: 'Nice crispy texture. Could be a bit more spicy but overall good.',
            date: '2025-10-02'
          }
        ],
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
        rating: 4.6,
        totalReviews: 29,
        reviews: [
          {
            id: 1,
            customerName: 'Vandana M.',
            rating: 5,
            comment: 'Authentic Maharashtrian taste! Just like Aaji used to make. Perfect texture and flavor. Best for Diwali.',
            date: '2025-10-05'
          },
          {
            id: 2,
            customerName: 'Sachin P.',
            rating: 4,
            comment: 'Great traditional chakli. Good quality ingredients and fresh preparation. Ordered last year.',
            date: '2025-10-02'
          },
          {
            id: 3,
            customerName: 'Manisha K.',
            rating: 5,
            comment: 'Excellent bhajni chakli! Crispy and well-spiced. Highly recommended for festivals.',
            date: '2025-10-03'
          },
          {
            id: 4,
            customerName: 'Nikhil J.',
            rating: 4,
            comment: 'Traditional recipe done right. Had this during last Diwali and loved it.',
            date: '2025-10-09'
          }
        ],
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
        rating: 4.1,
        totalReviews: 14,
        reviews: [
          {
            id: 1,
            customerName: 'Rekha G.',
            rating: 4,
            comment: 'Healthy alternative to regular chakli. Good taste and crispy texture.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Suresh M.',
            rating: 4,
            comment: 'Nice jowari chakli. Different but good. Ordered last Diwali for health-conscious relatives.',
            date: '2025-10-06'
          },
          {
            id: 3,
            customerName: 'Pallavi N.',
            rating: 5,
            comment: 'Excellent healthy option! My diabetic father loved it. Will order again.',
            date: '2025-10-09'
          }
        ],
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
    items: [
      {
        id: 'farsi-puri',
        name: 'Farsi Puri',
        description: 'Delicate and crispy deep-fried bread perfect for snacking',
        price: 550,
        unit: 'per kg',
        rating: 4.2,
        totalReviews: 21,
        reviews: [
          {
            id: 1,
            customerName: 'Sonal R.',
            rating: 4,
            comment: 'Crispy and light farsi puri. Good for serving with tea during festivals.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Hemant K.',
            rating: 4,
            comment: 'Traditional farsi puri. Ordered last Diwali and it was fresh and tasty.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Jayshree P.',
            rating: 5,
            comment: 'Perfect crispiness! Great for Diwali gifting. Kids love it.',
            date: '2025-10-02'
          }
        ],
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'ribbon-pakoda',
        name: 'Ribbon Pakoda',
        description: 'Crunchy ribbon-shaped fritters with aromatic spices',
        price: 525,
        unit: 'per kg',
        rating: 4.4,
        totalReviews: 17,
        reviews: [
          {
            id: 1,
            customerName: 'Vinod S.',
            rating: 5,
            comment: 'Excellent ribbon pakoda! Perfect shape and spicing. Ordered during last festivities.',
            date: '2025-10-03'
          },
          {
            id: 2,
            customerName: 'Smita D.',
            rating: 4,
            comment: 'Crunchy and well-made. Good for tea-time and festivals.',
            date: '2025-10-06'
          },
          {
            id: 3,
            customerName: 'Pravin M.',
            rating: 4,
            comment: 'Nice ribbon pakoda. Fresh and crispy. Will order again.',
            date: '2025-10-03'
          }
        ],
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'thika-sev',
        name: 'Thika Sev',
        description: 'Fine and crispy gram flour noodles with perfect seasoning',
        price: 540,
        unit: 'per kg',
        rating: 4.3,
        totalReviews: 25,
        reviews: [
          {
            id: 1,
            customerName: 'Rakesh T.',
            rating: 4,
            comment: 'Good thika sev. Fine texture and good spicing. Ordered last Diwali.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Manjusha B.',
            rating: 5,
            comment: 'Perfect sev! Just the right thickness and crunchiness. Great for mixing with poha.',
            date: '2025-10-04'
          },
          {
            id: 3,
            customerName: 'Dilip G.',
            rating: 4,
            comment: 'Traditional sev. Good quality and fresh. Will use for Diwali preparations.',
            date: '2025-10-09'
          }
        ],
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'mathri',
        name: 'Mathri',
        description: 'Flaky and crispy traditional biscuits with ajwain',
        price: 650,
        unit: 'per kg',
        rating: 4.5,
        totalReviews: 20,
        reviews: [
          {
            id: 1,
            customerName: 'Usha K.',
            rating: 5,
            comment: 'Excellent mathri! Perfect flakiness and ajwain flavor. Just like homemade.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Bhushan R.',
            rating: 4,
            comment: 'Good traditional mathri. Ordered last year during festivals and it was good.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Sangeeta M.',
            rating: 5,
            comment: 'Amazing crispy mathri! Great for serving guests during Diwali.',
            date: '2025-10-02'
          }
        ],
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'thika-shankarpala',
        name: 'Thika Shankarpala',
        description: 'Diamond-shaped crispy snacks with subtle spice blend',
        price: 625,
        unit: 'per kg',
        rating: 4.1,
        totalReviews: 13,
        reviews: [
          {
            id: 1,
            customerName: 'Yogesh P.',
            rating: 4,
            comment: 'Nice shankarpala. Good for tea-time. Ordered during last Diwali.',
            date: '2025-10-03'
          },
          {
            id: 2,
            customerName: 'Kalpana S.',
            rating: 4,
            comment: 'Crispy and well-made. Good for festivals and gifting.',
            date: '2025-10-06'
          }
        ],
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      },
      {
        id: 'sweet-shankarpala',
        name: 'Sweet Shankarpala',
        description: 'Sweet version of traditional shankarpala with jaggery',
        price: 675,
        unit: 'per kg',
        rating: 4.4,
        totalReviews: 18,
        reviews: [
          {
            id: 1,
            customerName: 'Madhavi N.',
            rating: 5,
            comment: 'Delicious sweet shankarpala! Perfect jaggery sweetness. Kids loved it last Diwali.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Gajanan D.',
            rating: 4,
            comment: 'Good sweet version. Natural jaggery taste. Will order again.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Shraddha R.',
            rating: 4,
            comment: 'Nice alternative to regular sweets. Good for health-conscious people.',
            date: '2025-10-03'
          }
        ],
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      }
    ]
  },
  {
    id: 'sweets',
    name: 'Karanji',
    description: 'Traditional sweets to make your Diwali celebrations memorable',
    items: [
      {
        id: 'gujjia',
        name: 'Gujjia',
        description: 'Crescent-shaped pastry filled with khoya and dry fruits',
        price: 35,
        unit: 'per piece',
        rating: 4.6,
        totalReviews: 28,
        reviews: [
          {
            id: 1,
            customerName: 'Sarita J.',
            rating: 5,
            comment: 'Amazing gujjia! Rich khoya filling and perfect sweetness. Ordered for last Diwali and everyone loved it.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Mohan K.',
            rating: 4,
            comment: 'Good gujjia with fresh khoya. Traditional taste and good size.',
            date: '2025-10-04'
          },
          {
            id: 3,
            customerName: 'Leela P.',
            rating: 5,
            comment: 'Excellent quality! Fresh and tasty. Best gujjia for Diwali celebrations.',
            date: '2025-10-02'
          },
          {
            id: 4,
            customerName: 'Narayan S.',
            rating: 4,
            comment: 'Traditional gujjia. Good for festivals and puja offerings.',
            date: '2025-10-09'
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1677745812171-2b9c871b123c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxndWppeWElMjBzd2VldHxlbnwwfHx8fDE3NTk1ODA4NzN8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1727018427695-35a6048c91e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxndWppeWElMjBzd2VldHxlbnwwfHx8fDE3NTk1ODA4NzN8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1617622163466-d1d56ec8b127?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxndWppeWElMjBzd2VldHxlbnwwfHx8fDE3NTk1ODA4NzN8MA&ixlib=rb-4.1.0&q=85'
        ]
      },
      {
        id: 'karanji',
        name: 'Saada Karanji',
        description: 'Traditional Maharashtrian sweet dumpling with coconut filling',
        price: 28,
        unit: 'per piece',
        rating: 4.7,
        totalReviews: 24,
        reviews: [
          {
            id: 1,
            customerName: 'Ashwini M.',
            rating: 5,
            comment: 'Perfect karanji! Fresh coconut filling and crispy outer layer. Just like Aaji made. Best for Diwali.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Kishore R.',
            rating: 4,
            comment: 'Traditional Maharashtrian karanji. Good coconut filling and authentic taste.',
            date: '2025-10-04'
          },
          {
            id: 3,
            customerName: 'Vidya T.',
            rating: 5,
            comment: 'Excellent quality karanji! Fresh ingredients and perfect sweetness level.',
            date: '2025-10-06'
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1617622163466-d1d56ec8b127?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxndWppeWElMjBzd2VldHxlbnwwfHx8fDE3NTk1ODA4NzN8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1677745812171-2b9c871b123c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxndWppeWElMjBzd2VldHxlbnwwfHx8fDE3NTk1ODA4NzN8MA&ixlib=rb-4.1.0&q=85',
          'https://images.unsplash.com/photo-1727018427695-35a6048c91e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxndWppeWElMjBzd2VldHxlbnwwfHx8fDE3NTk1ODA4NzN8MA&ixlib=rb-4.1.0&q=85'
        ]
      }
    ]
  },
  {
    id: 'laddus',
    name: 'Laddu Collection',
    description: 'Round balls of sweetness in various flavors',
    items: [
      {
        id: 'besan-laddu',
        name: 'Besan Laddu',
        description: 'Classic gram flour laddus with ghee and cardamom',
        price: 1050,
        unit: 'per kg',
        rating: 4.7,
        totalReviews: 30,
        reviews: [
          {
            id: 1,
            customerName: 'Sharada B.',
            rating: 5,
            comment: 'Absolutely divine! Pure ghee and perfectly sweetened. Best besan laddu in the city. Ordered last Diwali.',
            date: '2025-10-04'
          },
          {
            id: 2,
            customerName: 'Ramesh N.',
            rating: 5,
            comment: 'Melts in mouth! Traditional recipe done right. Ordered for last Diwali celebrations.',
            date: '2025-10-01'
          },
          {
            id: 3,
            customerName: 'Laxmi G.',
            rating: 4,
            comment: 'Very good quality and authentic taste. Fresh and well-made. Will order again.',
            date: '2025-10-06'
          },
          {
            id: 4,
            customerName: 'Chandrakant P.',
            rating: 5,
            comment: 'Premium quality besan laddu! Rich ghee taste and perfect texture.',
            date: '2025-10-03'
          }
        ],
        image: 'https://images.pexels.com/photos/8887055/pexels-photo-8887055.jpeg?w=400&h=300&fit=crop'
      },
      {
        id: 'rava-besan',
        name: 'Rava-Besan Laddu',
        description: 'Combination of semolina and gram flour in sweet balls',
        price: 800,
        unit: 'per kg',
        rating: 4.3,
        totalReviews: 22,
        reviews: [
          {
            id: 1,
            customerName: 'Swati K.',
            rating: 4,
            comment: 'Nice combination of rava and besan. Different texture and good taste.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Avinash D.',
            rating: 4,
            comment: 'Good laddu with unique texture. Ordered during last festivals.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Poonam R.',
            rating: 5,
            comment: 'Excellent rava-besan combination! Fresh and tasty.',
            date: '2025-10-02'
          }
        ],
        image: 'https://images.pexels.com/photos/8887021/pexels-photo-8887021.jpeg?w=400&h=300&fit=crop'
      },
      {
        id: 'rava-coconut',
        name: 'Rava-Coconut Laddu',
        description: 'Semolina laddus with fresh coconut and cardamom',
        price: 750,
        unit: 'per kg',
        rating: 4.4,
        totalReviews: 26,
        reviews: [
          {
            id: 1,
            customerName: 'Ranjana S.',
            rating: 5,
            comment: 'Fresh coconut taste! Perfect rava-coconut balance. Great for festivals.',
            date: '2025-10-01'
          },
          {
            id: 2,
            customerName: 'Milind T.',
            rating: 4,
            comment: 'Good coconut laddu. Fresh ingredients and nice texture.',
            date: '2025-10-03'
          },
          {
            id: 3,
            customerName: 'Varsha M.',
            rating: 4,
            comment: 'Traditional rava-coconut laddu. Ordered last year and liked it.',
            date: '2025-10-09'
          }
        ],
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
      },
      {
        id: 'rava-plain',
        name: 'Rava-Plain Laddu',
        description: 'Simple and delicious semolina laddus',
        price: 675,
        unit: 'per kg',
        rating: 4.2,
        totalReviews: 19,
        reviews: [
          {
            id: 1,
            customerName: 'Santosh B.',
            rating: 4,
            comment: 'Simple and tasty rava laddu. Good for those who prefer mild sweetness.',
            date: '2025-10-02'
          },
          {
            id: 2,
            customerName: 'Geeta J.',
            rating: 4,
            comment: 'Nice plain rava laddu. Good texture and freshness. Ordered last Diwali.',
            date: '2025-10-05'
          },
          {
            id: 3,
            customerName: 'Mahendra K.',
            rating: 5,
            comment: 'Perfect plain rava laddu! Not too sweet, just right.',
            date: '2025-10-03'
          }
        ],
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