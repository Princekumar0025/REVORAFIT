const products = [
  {
    name: "Premium Resistance Bands Set",
    slug: "premium-resistance-bands-set",
    description: "Full body workout resistance bands with 5 different tension levels. Includes handles, door anchor, and ankle straps.",
    shortDescription: "Versatile 5-band set for full body workouts.",
    price: 1499,
    discountPrice: 999,
    category: "fitness",
    stock: 50,
    benefits: ["Build strength", "Improve mobility", "Portable"],
    tags: ["resistance bands", "home workout", "strength"],
    images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800"],
    featured: true,
    bestseller: true,
    newArrival: false
  },
  {
    name: "Acupressure Mat and Pillow Set",
    slug: "acupressure-mat-pillow",
    description: "Relieve back pain, neck pain, and muscle tension. Thousands of acupressure points stimulate blood flow and relaxation.",
    shortDescription: "Relieve muscle tension and improve circulation naturally.",
    price: 2499,
    discountPrice: 1899,
    category: "physiotherapy",
    stock: 25,
    benefits: ["Pain relief", "Stress reduction", "Better sleep"],
    tags: ["acupressure", "pain relief", "relaxation"],
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"],
    featured: false,
    bestseller: true,
    newArrival: false
  },
  {
    name: "Adjustable Posture Corrector",
    slug: "adjustable-posture-corrector",
    description: "Comfortable and breathable posture brace for men and women. Helps align shoulders and spine, relieving back pain.",
    shortDescription: "Improve posture and relieve back pain.",
    price: 999,
    discountPrice: 699,
    category: "medical",
    stock: 100,
    benefits: ["Better posture", "Pain relief", "Confidence boost"],
    tags: ["posture", "back support", "health"],
    images: ["https://images.unsplash.com/photo-1552674605-15c2145efa38?w=800"],
    featured: true,
    bestseller: false,
    newArrival: true
  }
];

async function seed() {
  for (const product of products) {
    try {
      const res = await fetch('https://revorafit.vercel.app/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      const data = await res.json();
      console.log(`Added: ${data.name}`);
    } catch (e) {
      console.error(`Failed to add ${product.name}:`, e.message);
    }
  }
}

seed();
